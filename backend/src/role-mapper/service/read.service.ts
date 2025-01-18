/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/naming-convention */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { getLogger } from '../../logger/logger.js';
import { InvalidOperatorException } from '../error/exceptions.js';
import { EntityCategoryType, EntityType } from '../model/entity/entities.entity.js';
import { MandateDocument, Mandates } from '../model/entity/mandates.entity.js';
import { OrgUnit, OrgUnitDocument } from '../model/entity/org-unit.entity.js';
import { Process, ProcessDocument, ShortRole } from '../model/entity/process.entity.js';
import { Role, RoleDocument } from '../model/entity/roles.entity.js';
import { User, UserDocument } from '../model/entity/user.entity.js';
import { FilterInput } from '../model/input/filter.input.js';
import { PaginationParameters } from '../model/input/pagination-parameters.js';
import { SortInput } from '../model/input/sort.input.js';
import { GetUsersByFunctionResult } from '../model/payload/get-users.payload.js';
import { RoleResult, UserWithFunction } from '../model/payload/role-payload.type.js';
import {
    UnassignedFunctionsPayload,
    UserRetirementInfo,
} from '../model/payload/unassigned-functions.payload.js';
import { FilterField, FilterFields } from '../model/types/filter.type.js';
import { operatorMap } from '../model/types/map.type.js';
import { retiringUsersPipeline } from './pipeline/retiring-users.pipeline.js';

/**
 * Service für Leseoperationen von Entitäten.
 *
 * Diese Klasse stellt Methoden für das Abrufen, Filtern, Sortieren und Paginieren
 * von Entitäten wie Benutzer, Prozesse, Mandate und Organisationseinheiten bereit.
 */
@Injectable()
export class ReadService {
    // Logger für Debugging
    readonly #logger = getLogger(ReadService.name);

    // Mapping von Entitätskategorien zu den entsprechenden Mongoose-Modellen
    readonly #modelMap: Record<EntityCategoryType, Model<any>>;

    /**
     * Konstruktor für den ReadService.
     *
     * @param {Model<UserDocument>} userModel - Das Mongoose-Modell für Benutzer.
     * @param {Model<ProcessDocument>} processModel - Das Mongoose-Modell für Prozesse.
     * @param {Model<MandateDocument>} mandateModel - Das Mongoose-Modell für Mandate.
     * @param {Model<OrgUnitDocument>} orgUnitModel - Das Mongoose-Modell für Organisationseinheiten.
     * @param {Model<RoleDocument>} roleModel - Das Mongoose-Modell für Rollen.
     */
    constructor(
        @InjectModel(User.name) userModel: Model<UserDocument>,
        @InjectModel(Process.name) processModel: Model<ProcessDocument>,
        @InjectModel(Mandates.name) mandateModel: Model<MandateDocument>,
        @InjectModel(OrgUnit.name) orgUnitModel: Model<OrgUnitDocument>,
        @InjectModel(Role.name) roleModel: Model<RoleDocument>,
    ) {
        // Initialisiere das Modell-Mapping für Entitäten.
        this.#modelMap = {
            USERS: userModel,
            MANDATES: mandateModel,
            PROCESSES: processModel,
            ROLES: roleModel,
            ORG_UNITS: orgUnitModel,
        };
    }

    /**
     * Sucht die Rollen und die zugehörigen Benutzer für einen angegebenen Prozess.
     *
     * Diese Methode ruft die Prozessdaten aus der Datenbank ab, extrahiert die Rolleninformationen
     * und führt für jede Rolle eine Aggregations-Pipeline aus, um die zugehörigen Benutzer zu ermitteln.
     *
     * @param {string} _id - Die eindeutige ID des Prozesses, dessen Rollen abgerufen werden sollen.
     * @param {string} userId - Die ID des Benutzers, der die Anfrage stellt.
     * @returns {Promise<{ roles: RoleResult[] }>} Ein Promise, das eine Liste von Rollen und den zugehörigen Benutzern zurückgibt.
     *
     * @throws {NotFoundException} Wird ausgelöst, wenn der Prozess nicht existiert, keine Rollen hat oder der Benutzer nicht existiert.
     *
     * @example
     * ```typescript
     * const result = await findProcessRoles('64b1f768d9a8e900001b1b2f', 'user123');
     * console.log(result.roles); // Gibt die Rollen und die zugehörigen Benutzer aus
     * ```
     */
    async findProcessRoles(
        _id: string,
        userId: string,
        specifiedOrgUnit?: string,
    ): Promise<{ roles: RoleResult[] }> {
        this.#logger.debug('findProcessRoles: _id=%s, userId=%s', _id, userId);

        // Standardwert zuweisen, falls `specifiedOrgUnit` nicht gesetzt ist
        specifiedOrgUnit = specifiedOrgUnit ?? undefined;

        // Abrufen des Prozesses aus der Datenbank anhand der Prozess-ID
        const process: Process = await this.#modelMap.PROCESSES?.findOne({ _id }).exec();
        if (process?.roles === undefined) {
            throw new NotFoundException(`Keine Rollen für diesen Prozess gefunden. ${_id}`);
        }
        this.#logger.debug('findProcessRoles: process=%o', process);

        // Überprüfen, ob der angegebene Benutzer existiert
        if (!(await this.#modelMap.USERS.exists({ userId }))) {
            throw new NotFoundException(
                `findProcessRoles: Keinen Benutzer gefunden mit der userId: ${userId}`,
            );
        }

        // Extrahieren der Rollen-IDs aus dem Prozess
        const roleIdsCollection = process.roles.flatMap((role: ShortRole) => {
            if (role.roleType === 'COLLECTION') {
                return role.roleId;
            }
            return [];
        });

        const roleIdFunction = process.roles.flatMap((role: ShortRole) => {
            if (role.roleType === 'IMPLICITE_FUNCTION') {
                return { id: role.roleId, name: role.roleName };
            }
            return [];
        });

        const roleIdOrgUnit = process.roles.flatMap((role: ShortRole) => {
            if (role.roleType === 'IMPLICITE_ORG_UNIT') {
                return { id: role.roleId, name: role.roleName };
            }
            return [];
        });

        if (roleIdsCollection.length === 0) {
            throw new NotFoundException(
                `Keine Rolleninformationen gefunden für Prozess-ID: ${_id}`,
            );
        }

        this.#logger.debug('findProcessRoles: Rollen-IDs aus Prozess: %o', roleIdsCollection);

        // Abrufen der Rollen aus der Datenbank anhand der IDs
        const roles: Role[] = await this.#modelMap.ROLES.find({
            _id: { $in: roleIdsCollection },
        }).exec();
        if (roles?.length === 0) {
            throw new NotFoundException(
                `Keine Rolleninformationen gefunden für IDs: ${roleIdsCollection.join(', ')}`,
            );
        }
        this.#logger.debug('findProcessRoles: roles=%o', roles);

        // Verarbeitung der Rollen und zugehörigen Benutzer mit Aggregations-Pipeline
        const resultsCollection = await Promise.all(

            roles.map(async (role) => {
                this.#logger.debug('Verarbeite Rolle: %o', role);

                try {
                    // Abfrage-Pipeline aus der Rolle ausführen
                    const queryPipeline = role.query ?? [];
                    const users = await this.#modelMap.MANDATES.aggregate(queryPipeline)
                        .option({ let: { userId, specifiedOrgUnit } }) // Lokale Variable für die Pipeline
                        .exec();

                    // Ergebnisstruktur für die Rolle erstellen
                    return {
                        roleName: role.name,
                        roleId: role.roleId,
                        users,
                    };
                } catch (error) {
                    this.#logger.error(
                        'Fehler bei der Verarbeitung der Rolle: %s, Rolle-ID: %s. Fehler: %o',
                        role.name,
                        role.roleId,
                        error,
                    );
                    return; // Fehlerhafte Rolle überspringen
                }
            }),
        );

        const resultFunction = await Promise.all(
            roleIdFunction.map(async (roleId) => {
                this.#logger.debug('Verarbeite RollenId: %s', roleId);

                let users;
                let functionName: string | undefined;
                try {
                    const function_ = (await this.#modelMap.MANDATES.findOne({
                        _id: roleId.id,
                    }).exec()) as Mandates;
                    if (function_ === undefined) {
                        throw new Error('Keine Funktion gefunden');
                    }

                    if (function_.isImpliciteFunction === true) {
                        const data = await this.executeSavedQuery(function_._id as string);
                        users = data.data as Mandates[];
                    } else {
                        // Abrufen der Benutzer aus der Datenbank
                        users = await this.#modelMap.USERS.find({
                            userId: { $in: function_.users },
                        }).exec();
                        this.#logger.debug('Benutzer: %o', users);
                        functionName = function_.functionName;
                    }

                    const normalizedUsers: UserWithFunction[] = users?.map((user: User) => ({
                        user: { ...user.toObject() },
                        functionName: functionName ?? undefined,
                    }));

                    this.#logger.debug('normalizedUsers: %o', normalizedUsers);

                    return {
                        roleName: roleId.name,
                        roleId: roleId.id,
                        users: normalizedUsers,
                    };
                } catch (error) {
                    this.#logger.error(
                        'Fehler bei der Verarbeitung der Rolle: %s, Rolle-ID: %o. Fehler: %o',
                        'Funktion',
                        roleId,
                        error,
                    );
                    return; // Fehlerhafte Rolle überspringen
                }
            }),
        );

        const resultOrgUnit = await Promise.all(
            roleIdOrgUnit.map(async (roleId) => {
                this.#logger.debug('Verarbeite RollenId: %s', roleId);

                try {
                    const orgUnit = (await this.#modelMap.ORG_UNITS.findOne({
                        _id: roleId.id,
                    }).exec()) as OrgUnit;
                    if (orgUnit === undefined) {
                        throw new Error('Keine Organisationseinheit gefunden');
                    }
                    const users = await this.findData<User>(
                        'USERS',
                        {
                            OR: [
                                { field: 'orgUnit', operator: 'EQ', value: orgUnit.alias },
                                { field: 'orgUnit', operator: 'EQ', value: orgUnit.kostenstelleNr },
                            ],
                        },
                        { limit: 0 },
                        { field: 'userId', direction: 'ASC' },
                    );

                    const normalizedUsers: UserWithFunction[] = users?.map((user) => ({
                        user,
                        functionName: undefined, // Funktion ist nicht vorhanden
                    }));
                    return {
                        roleName: roleId.name,
                        roleId: roleId.id,
                        users: normalizedUsers,
                    };
                } catch (error) {
                    this.#logger.error(
                        'Fehler bei der Verarbeitung der Rolle: %s, Rolle-ID: %s. Fehler: %o',
                        'Organisationseinheit',
                        roleId,
                        error,
                    );
                    return; // Fehlerhafte Rolle überspringen
                }
            }),
        );
        // Ergebnisse filtern, um fehlerhafte Rollen zu entfernen
        const filteredResults = resultsCollection.filter(Boolean);
        this.#logger.debug('findProcessRoles: filteredResults=%o', filteredResults);

        const endResult = [...filteredResults, ...resultFunction, ...resultOrgUnit];
        this.#logger.debug('findProcessRoles: endResult=%o', endResult);

        this.#logger.info('findProcessRoles: Verarbeitung abgeschlossen');
        return { roles: endResult as RoleResult[] };
    }

    /**
     * Führt eine gespeicherte Abfrage aus, um Mandatsdaten zu erhalten.
     *
     * Diese Methode ruft eine gespeicherte Abfrage aus der Datenbank ab und führt die
     * darin enthaltenen Filter-, Paginierungs- und Sortierkriterien aus, um relevante
     * Daten zu ermitteln.
     *
     * @param {string} id - Die eindeutige ID der gespeicherten Abfrage.
     * @returns {Promise<{ savedQuery: any, data: any }>} Ein Promise, das die gespeicherte Abfrage
     * und die gefilterten Daten zurückgibt.
     *
     * @throws {NotFoundException} Wird ausgelöst, wenn keine gespeicherte Abfrage mit der angegebenen ID gefunden wird
     * oder die gespeicherte Abfrage keine gültigen Kriterien enthält.
     *
     * @example
     * ```typescript
     * const result = await executeSavedQuery('64b1f768d9a8e900001b1b2f');
     * console.log(result.savedQuery); // Die gespeicherte Query
     * console.log(result.data); // Die gefilterten Daten
     * ```
     */
    async executeSavedQuery(
        id: string,
    ): Promise<{ savedQuery: MandateDocument; data: EntityType[] }> {
        // Abrufen der gespeicherten Query basierend auf functionName und orgUnitId
        const savedQuery = await this.#modelMap.MANDATES.findOne({
            _id: id,
        });

        this.#logger.debug('executeSavedQuery: savedQuery=%o', savedQuery);
        if (savedQuery === undefined || savedQuery.query === undefined) {
            throw new Error('Keine gespeicherte Query gefunden');
        }

        // Extrahieren der Filter-, Sortier- und Paginierungsparameter aus der gespeicherten Query
        const { filter, pagination, sort } = savedQuery.query;

        // Aufruf der findData-Methode mit den abgerufenen Parametern
        const data: EntityType[] = await this.findData('USERS', filter, pagination, sort);

        // Nur Mandates zurückgeben
        return { savedQuery, data };
    }

    /**
     * Findet alle Funktionen (Mandates), bei denen:
     * - Das `users`-Array leer ist oder nicht existiert.
     * - `isImpliciteFunction` auf `false` gesetzt ist.
     *
     * @returns {Promise<Mandates[]>} Eine Liste von Funktionen ohne Benutzer und ohne implizite Zuordnung.
     */
    async findUnassignedFunctions(): Promise<Mandates[]> {
        this.#logger.debug('findUnassignedFunctions');
        const unassignedFunctions: Mandates[] = await this.#modelMap.MANDATES.find({
            $and: [
                { isImpliciteFunction: false }, // Nur Funktionen, die nicht implizit sind
                {
                    $or: [
                        { users: { $exists: false } }, // `users` existiert nicht
                        { users: { $size: 0 } }, // `users` ist ein leeres Array
                    ],
                },
            ],
        });
        this.#logger.debug('findUnassignedFunctions: unassignedFunctions=%o', unassignedFunctions);
        return unassignedFunctions;
    }

    /**
     * Findet alle Funktionen, denen keine Benutzer zugewiesen sind,
     * oder deren Benutzer innerhalb eines definierten Zeitraums ausscheiden.
     *
     * @param {number} lookaheadPeriod - Der Zeitraum für die Betrachtung.
     * @param {"TAGE" | "MONATE" | "JAHRE"} timeUnit - Die Zeiteinheit (TAGE, MONATE, JAHRE).
     * @returns {Promise<any[]>} Liste von Funktionen mit relevanten Benutzern.
     */
    async findFunctionsWithRetiringUsers(
        lookaheadPeriod = 0,
        // timeUnit: 'TAGE' | 'MONATE' | 'JAHRE' = 'JAHRE',
        timeUnit = 'JAHRE',
    ): Promise<UnassignedFunctionsPayload[]> {
        const now = new Date();
        const lookaheadDate = new Date();

        // Zeitraum basierend auf der Zeiteinheit berechnen
        switch (timeUnit) {
            case 'TAGE': {
                lookaheadDate.setDate(now.getDate() + lookaheadPeriod);
                break;
            }
            case 'MONATE': {
                lookaheadDate.setMonth(now.getMonth() + lookaheadPeriod);
                break;
            }
            case 'JAHRE': {
                lookaheadDate.setFullYear(now.getFullYear() + lookaheadPeriod);
                break;
            }
            default: {
                throw new Error('default case');
            }
        }

        // Verwende die Aggregationspipeline für die Abfrage
        const results = await this.#modelMap.MANDATES.aggregate(
            retiringUsersPipeline(now, lookaheadDate),
        );

        // Formatierte Ergebnisse zurückgeben
        return results.map((result: UnassignedFunctionsPayload) => ({
            function: result.function,
            userList: result.userList.map((user: UserRetirementInfo) => ({
                userId: user.userId,
                timeLeft: Math.ceil(user.timeLeft),
            })),
        }));
    }

    /**
     * Führt eine Filterabfrage für eine bestimmte Entität aus.
     *
     * Diese Methode generiert eine MongoDB-Abfrage basierend auf den angegebenen Filter-,
     * Paginierungs- und Sortierparametern und ruft die gefilterten Daten aus der entsprechenden
     * Entität ab. Die Ergebnisse können optional paginiert und sortiert werden.
     *
     * @template T - Der Typ der Entität, die abgerufen wird (z. B. User, Mandates).
     * @param {EntityCategoryType} entity - Der Name der Zielentität (z. B. 'USERS', 'MANDATES').
     * @param {FilterInput} [filter] - Die Filterkriterien für die Abfrage.
     * @param {PaginationParameters} [pagination] - Paginierungsparameter, um Ergebnisse zu begrenzen und zu verschieben.
     * @param {SortInput} [orderBy] - Sortieroptionen, um die Reihenfolge der Ergebnisse festzulegen.
     * @returns {Promise<T[]>} Ein Promise, das eine Liste der gefilterten Entitäten zurückgibt.
     *
     * @throws {BadRequestException} Wird ausgelöst, wenn die angegebene Entität nicht unterstützt wird.
     *
     * @example
     * ```typescript
     * const users = await findData<User>('USERS',
     *     { field: 'active', operator: 'EQ', value: true },
     *     { offset: 0, limit: 10 },
     *     { field: 'name', direction: 'ASC' });
     * console.log(users);
     * ```
     */
    async findData<T extends EntityType>(
        entity: EntityCategoryType,
        filter?: FilterInput,
        pagination?: PaginationParameters,
        orderBy?: SortInput,
    ): Promise<T[]> {
        this.#logger.debug(
            'findData: entity=%s, filter=%o, pagination=%o, orderBy=%o',
            entity,
            filter,
            pagination,
            orderBy,
        );

        // Modell für die angegebene Entität abrufen
        const model = this.#getModel(entity);

        // Erstellen der Filter-Query basierend auf den Eingabeparametern
        const filterQuery = this.buildFilterQuery(filter);
        this.#logger.debug('findData: filterQuery=%o', filterQuery);

        // Erstellen der Sortierkriterien
        const sortQuery = this.buildSortQuery(orderBy);
        this.#logger.debug('findData: sortQuery=%o', sortQuery);

        // Daten mit der generierten Query, Sortierung und Paginierung abrufen
        const rawData = await model
            .find(filterQuery)
            .sort(sortQuery)
            .skip(pagination?.offset ?? 0)
            .limit(pagination?.limit ?? 10)
            .exec();

        const data = rawData.map(
            (document: EntityType): EntityType => document.toObject() as EntityType,
        );
        this.#logger.debug(
            'findData: pagination limit=$s, offset=%s',
            pagination?.limit,
            pagination?.offset,
        );
        return data as T[];
    }

    /**
     * Erstellt rekursiv eine MongoDB-Filter-Query basierend auf den angegebenen Bedingungen.
     *
     * Diese Methode verarbeitet Filterbedingungen, einschließlich logischer Operatoren (`AND`, `OR`, `NOR`)
     * und einzelner Feldbedingungen. Sie kann auch spezielle Felder mappen und Werte wie ObjectIds konvertieren,
     * falls erforderlich.
     *
     * @param {FilterInput} [filter] - Die Filterbedingungen, einschließlich logischer Operatoren und Feldbedingungen.
     *                                 Wenn kein Filter angegeben ist oder der Filter leer ist, wird eine leere Query zurückgegeben.
     * @returns {FilterQuery<any>} Eine generierte MongoDB-Filter-Query, die in `Model.find` oder ähnlichen Methoden verwendet werden kann.
     *
     * @throws {InvalidOperatorException} Wenn ein ungültiger Operator im Filter verwendet wird.
     * @throws {Error} Wenn der Filter unvollständig ist (z. B. fehlendes Feld, Operator oder Wert).
     *
     * @example
     * ```typescript
     * const filter: FilterInput = {
     *     field: 'name',
     *     operator: 'EQ',
     *     value: 'John Doe',
     *     AND: [
     *         { field: 'active', operator: 'EQ', value: true },
     *         { field: 'roleId', operator: 'IN', value: ['123', '456'] }
     *     ]
     * };
     * const query = buildFilterQuery(filter);
     * console.log(query);
     * // { $and: [{ name: { $eq: 'John Doe' } }, { active: { $eq: true } }, { roleId: { $in: ['123', '456'] } }] }
     * ```
     */
    buildFilterQuery(filter?: FilterInput): FilterQuery<any> {
        if (this.#isEmptyFilter(filter)) {
            this.#logger.debug('buildFilterQuery: keine Filterbedingungen angegeben');
            return {};
        }

        const query: FilterQuery<any> = {};

        // Mappe spezielle Felder (z. B. courseOfStudy, level)
        if (filter?.field !== undefined) {
            filter.field = this.#mapSpecialFields(filter.field) as FilterField;
        }

        // Verarbeitung der logischen Operatoren (AND, OR, NOT)
        if (filter) {
            this.#processLogicalOperators(filter, query);
        }

        // Verarbeitung der Felder, falls gesetzt
        if (filter && this.#isAnyFieldSet(filter)) {
            // Log-Ausgabe, um den Typ und Wert des Filters zu überprüfen
            this.#logger.warn('field %s', filter.field);
            this.#logger.warn('value ist vom Typ %s', typeof filter.value);
            this.#logger.warn('value: %o', filter.value);

            // Wenn das Filterfeld eine ObjectId sein könnte, konvertiere es
            if (filter.field === 'orgUnit' && typeof filter.value === 'string') {
                // Versuche, die String-ID in eine ObjectId umzuwandeln
                const convertedValue = this.#convertToObjectIdIfNeeded(filter.value);
                if (convertedValue instanceof Types.ObjectId) {
                    this.#logger.debug('ObjectId konvertiert: %s', convertedValue);
                }
                filter.value = convertedValue; // Setze den konvertierten Wert zurück
            }

            // this.#validateFilterFields(filter);
            this.#buildFieldQuery(filter, query);
        }

        return query;
    }

    /**
     * Erstellt eine Sortier-Query basierend auf den angegebenen Bedingungen.
     *
     * Diese Methode generiert eine MongoDB-konforme Sortier-Query, die in `Model.find` oder ähnlichen
     * Abfragen verwendet werden kann. Die Sortierung erfolgt nach einem angegebenen Feld und einer
     * Richtung (`ASC` für aufsteigend, `DESC` für absteigend).
     *
     * @param {SortInput} [orderBy] - Die Sortierbedingungen, bestehend aus einem Feld und einer Richtung.
     *                                Wenn keine Sortierbedingungen angegeben sind, wird eine leere Query zurückgegeben.
     * @returns {Record<string, 1 | -1>} Eine Sortier-Query, wobei `1` für aufsteigend und `-1` für absteigend steht.
     *
     * @throws {Error} Wird ausgelöst, wenn das Sortierfeld nicht angegeben ist oder die Richtung ungültig ist.
     *
     * @example
     * ```typescript
     * const sortQuery = buildSortQuery({ field: 'name', direction: 'ASC' });
     * console.log(sortQuery); // { name: 1 }
     *
     * const emptySortQuery = buildSortQuery();
     * console.log(emptySortQuery); // {}
     * ```
     */
    buildSortQuery(orderBy?: SortInput): Record<string, 1 | -1> {
        if (!orderBy) {
            this.#logger.debug('buildSortQuery: Keine Sortierbedingungen angegeben');
            return {};
        }

        const { field, direction } = orderBy;

        // Validierung des Felds
        if (!field) {
            throw new Error('Sortierfeld darf nicht leer sein.');
        }

        // Mappe das Feld, falls ein Mapping existiert
        const mappedField = this.#mapSpecialFields(field);
        this.#logger.debug('buildSortQuery: mappedField=%s', mappedField);

        // Validierung der Richtung
        if (direction !== 'ASC' && direction !== 'DESC') {
            throw new Error(`Ungültige Sortierrichtung: ${direction}`);
        }

        const sortQuery: Record<string, 1 | -1> = {
            [mappedField]: direction === 'ASC' ? 1 : -1,
        };

        this.#logger.debug('buildSortQuery: sortQuery=%o', sortQuery);
        return sortQuery;
    }

    /**
     * Findet Benutzer basierend auf der Funktion eines Mandats.
     *
     * Diese Methode sucht ein Mandat anhand der angegebenen ID und ruft die Benutzer
     * ab, die der Funktion des Mandats zugeordnet sind. Zusätzlich werden relevante
     * Informationen wie der Funktionsname, ob die Funktion implizit ist und die
     * zugehörige Organisationseinheit zurückgegeben.
     *
     * @param {string} id - Die eindeutige ID des Mandats.
     * @returns {Promise<GetUsersByFunctionResult>} Ein Promise, das die Benutzer und zusätzliche Informationen zurückgibt.
     *
     * @throws {NotFoundException} Wird ausgelöst, wenn kein Mandat für die angegebene ID gefunden wird.
     * @throws {TypeError} Wird ausgelöst, wenn die ID des Mandats keine gültige `ObjectId` ist.
     *
     * @example
     * ```typescript
     * const result = await findUsersByFunction('64b1f768d9a8e900001b1b2f');
     * console.log(result.functionName); // Gibt den Funktionsnamen des Mandats aus.
     * console.log(result.users); // Gibt die Liste der Benutzer aus.
     * ```
     */
    async findUsersByFunction(id: string): Promise<GetUsersByFunctionResult> {
        this.#logger.debug('findUsersByFunction: id=%s', id);

        // Filterkriterien für das Mandat erstellen
        const mandateFilter: FilterInput = { field: '_id', value: id, operator: 'EQ' };
        const sort: SortInput = { field: 'userId', direction: 'ASC' };

        // Abrufen des Mandats anhand der ID
        const mandates: Mandates[] = await this.findData<Mandates>(
            'MANDATES',
            mandateFilter,
            undefined,
            sort,
        );

        // Überprüfen, ob das Mandat existiert
        if (mandates.length === 0) {
            this.#logger.warn('findUsersByFunction: Kein Mandat gefunden für id=%s', id);
            throw new NotFoundException(`findUsersByFunction: Kein Mandat gefunden für ID: ${id}`);
        }

        const mandate = mandates[0];
        if (!mandate) {
            this.#logger.warn('findUsersByFunction: Kein Mandat gefunden für id=%s', id);
            throw new NotFoundException(`findUsersByFunction: Kein Mandat gefunden für ID: ${id}`);
        }

        // Validieren der ObjectId des Mandats
        if (!(mandate._id instanceof Types.ObjectId)) {
            throw new TypeError('findUsersByFunction: Ungültige ObjectId im Mandat.');
        }

        const { users, functionName, isImpliciteFunction, orgUnit } = mandate;
        this.#logger.debug('findUsersByFunction: mandate=%o', mandate);

        // Überprüfen, ob Benutzer vorhanden sind
        if (!users || users.length === 0) {
            this.#logger.warn('findUsersByFunction: Keine Benutzer im Mandat gefunden.');
            return { functionName, users: [], isImpliciteFunction, orgUnit };
        }

        // Filter für die Benutzerergebnisse erstellen
        const userFilter: FilterInput = {
            OR: users.map((u) => ({ field: 'userId', operator: 'EQ', value: u })),
        };

        // Benutzer abrufen, die mit dem Mandat verknüpft sind
        const userList: User[] = await this.findData('USERS', userFilter, undefined, sort);
        return { functionName, users: userList, isImpliciteFunction, orgUnit };
    }

    /**
     * Findet alle übergeordneten Organisationseinheiten einer gegebenen Organisationseinheit.
     *
     * Diese Methode ermittelt die Hierarchie der Organisationseinheiten, indem sie rekursiv die
     * `parentId`-Felder durchläuft und alle übergeordneten Organisationseinheiten sammelt.
     *
     * @param {Types.ObjectId} _id - Die eindeutige ID der aktuellen Organisationseinheit.
     * @returns {Promise<OrgUnit[]>} Ein Promise, das eine Liste aller übergeordneten Organisationseinheiten zurückgibt.
     *
     * @throws {NotFoundException} Wird ausgelöst, wenn die Organisationseinheit mit der angegebenen ID nicht gefunden wird.
     *
     * @example
     * ```typescript
     * const ancestors = await findAncestors(new Types.ObjectId('64b1f768d9a8e900001b1b2f'));
     * console.log(ancestors); // Gibt die Liste der übergeordneten Organisationseinheiten aus
     * ```
     */
    async findAncestors(_id: Types.ObjectId): Promise<OrgUnit[]> {
        this.#logger.debug('findAncestors: id=%s', _id);

        // Abrufen der aktuellen Organisationseinheit
        const currentOrgUnit: OrgUnit | undefined = await this.#modelMap.ORG_UNITS.findOne({
            _id,
        }).exec();

        // Überprüfen, ob die Organisationseinheit existiert
        if (!currentOrgUnit) {
            throw new NotFoundException(
                `findAncestors: Keine Organisationseinheit gefunden für ID: ${_id}`,
            );
        }

        const ancestors: OrgUnit[] = [];

        // Rekursive Hilfsfunktion zum Abrufen der übergeordneten Organisationseinheiten
        const findParent = async (currentId: Types.ObjectId | undefined): Promise<void> => {
            const parentOrgUnit: OrgUnit | null = await this.#modelMap.ORG_UNITS.findOne({
                _id: currentId,
            }).exec();

            if (parentOrgUnit?.parentId) {
                this.#logger.debug('findAncestors: parentOrgUnit=%o', parentOrgUnit);
                await findParent(parentOrgUnit.parentId); // Rekursion
                ancestors.push(parentOrgUnit); // Nach der Rekursion hinzufügen, um die Reihenfolge umzukehren
            } else if (parentOrgUnit) {
                ancestors.push(parentOrgUnit); // Falls keine weiteren Eltern vorhanden sind, hinzufügen
            }
        };

        // Starte die Rekursion mit der `parentId` der aktuellen Organisationseinheit
        await findParent(currentOrgUnit.parentId);

        this.#logger.debug('findAncestors: ancestors=%o', ancestors);
        return ancestors;
    }

    /**
     * Mappt ein Eingabefeld auf ein spezifisches Feld in der Datenbank.
     *
     * Diese Methode überprüft, ob ein gegebenes Feld in der `fieldMap` vorhanden ist und gibt
     * das entsprechende gemappte Feld zurück. Falls kein Mapping existiert, wird das Originalfeld zurückgegeben.
     * Dieses Mapping wird verwendet, um Eingabefelder auf die Datenstruktur der Datenbank abzustimmen.
     *
     * @param {string} field - Der Name des Eingabefelds, das gemappt werden soll.
     * @returns {string} Der gemappte Feldname, falls ein Mapping existiert, ansonsten das Originalfeld.
     *
     * @example
     * ```typescript
     * const mappedField = this.#mapSpecialFields('courseOfStudy');
     * console.log(mappedField); // 'student.courseOfStudy'
     *
     * const unmappedField = this.#mapSpecialFields('unknownField');
     * console.log(unmappedField); // 'unknownField'
     * ```
     */
    #mapSpecialFields(field: string): string {
        const fieldMap: Record<string, string> = {
            courseOfStudy: 'student.courseOfStudy',
            level: 'student.level',
            examRegulation: 'student.examRegulation',
            costCenter: 'employee.costCenter',
            department: 'employee.department',
            courseOfStudyUnique: 'student.courseOfStudyUnique',
            courseOfStudyShort: 'student.courseOfStudyShort',
            courseOfStudyName: 'student.courseOfStudyName',
            firstName: 'profile.firstName',
            lastName: 'profile.lastName',
        };

        return fieldMap[field] ?? field;
    }

    /**
     * Ruft das Mongoose-Modell für eine gegebene Entitätskategorie ab.
     *
     * Diese Methode verwendet eine interne Map (`#modelMap`), um das entsprechende
     * Mongoose-Modell basierend auf der Entitätskategorie zurückzugeben.
     * Falls die Entitätskategorie ungültig ist, wird eine `BadRequestException` ausgelöst.
     *
     * @param {EntityCategoryType} entity - Die Entitätskategorie (z. B. 'USERS', 'MANDATES').
     * @returns {Model<EntityType>} Das Mongoose-Modell, das der angegebenen Entitätskategorie entspricht.
     *
     * @throws {BadRequestException} Wird ausgelöst, wenn die angegebene Entitätskategorie nicht unterstützt wird.
     *
     * @example
     * ```typescript
     * const userModel = this.#getModel('USERS');
     * console.log(userModel); // Gibt das Mongoose-Modell für Benutzer zurück
     * ```
     */
    #getModel(entity: EntityCategoryType): Model<EntityType> {
        const model = this.#modelMap[entity];
        const validEntities = Object.keys(this.#modelMap).join(', ');
        if (model === undefined) {
            throw new BadRequestException(
                `Nicht unterstützte Entität: ${entity}. Unterstützte Entitäten sind: ${validEntities}`,
            );
        }
        return model as Model<EntityType>;
    }

    /**
     * Überprüft, ob ein gegebener Filter leer ist.
     *
     * Diese Methode prüft, ob der übergebene Filter `undefined` ist oder keine
     * definierten Bedingungen enthält. Sie wird verwendet, um zu entscheiden, ob
     * eine Filter-Query generiert werden soll.
     *
     * @param {FilterInput} [filter] - Der Filter, der überprüft werden soll.
     * @returns {boolean} `true`, wenn der Filter leer oder `undefined` ist, andernfalls `false`.
     *
     * @example
     * ```typescript
     * const isEmpty = this.#isEmptyFilter(undefined);
     * console.log(isEmpty); // true
     *
     * const isNotEmpty = this.#isEmptyFilter({ field: 'name', operator: 'EQ', value: 'John' });
     * console.log(isNotEmpty); // false
     * ```
     */
    #isEmptyFilter(filter?: FilterInput): boolean {
        return !filter || filter === undefined;
    }

    /**
     * Verarbeitet logische Operatoren (`AND`, `OR`, `NOR`) in einem Filter und fügt sie der MongoDB-Query hinzu.
     *
     * Diese Methode iteriert über die im Filter enthaltenen logischen Operatoren und erstellt
     * für jeden Operator eine entsprechende MongoDB-Query-Bedingung (`$and`, `$or`, `$nor`).
     * Die Bedingungen werden rekursiv über die Methode `buildFilterQuery` verarbeitet.
     *
     * @param {FilterInput} filter - Der Filter, der logische Operatoren enthalten kann.
     * @param {FilterQuery<any>} query - Die MongoDB-Query, zu der die Bedingungen hinzugefügt werden.
     *
     * @example
     * ```typescript
     * const filter: FilterInput = {
     *     AND: [
     *         { field: 'name', operator: 'EQ', value: 'John' },
     *         { field: 'active', operator: 'EQ', value: true }
     *     ],
     *     OR: [
     *         { field: 'role', operator: 'IN', value: ['admin', 'user'] }
     *     ]
     * };
     * const query: FilterQuery<any> = {};
     * this.#processLogicalOperators(filter, query);
     * console.log(query);
     * // {
     * //   $and: [
     * //       { name: { $eq: 'John' } },
     * //       { active: { $eq: true } }
     * //   ],
     * //   $or: [
     * //       { role: { $in: ['admin', 'user'] } }
     * //   ]
     * // }
     * ```
     */
    #processLogicalOperators(filter: FilterInput, query: FilterQuery<any>): void {
        if (filter.AND) {
            query.$and = filter.AND.map((subFilter) => this.buildFilterQuery(subFilter));
        }
        if (filter.OR) {
            query.$or = filter.OR.map((subFilter) => this.buildFilterQuery(subFilter));
        }
        if (filter.NOR) {
            query.$nor = filter.NOR.map((subFilter) => this.buildFilterQuery(subFilter));
        }
    }

    /**
     * Überprüft, ob im Filter ein gültiges Feld, ein Operator und ein Wert gesetzt sind.
     *
     * Diese Methode prüft, ob der Filter alle notwendigen Informationen enthält,
     * um eine gültige Filterbedingung zu erstellen. Sie wird verwendet, um sicherzustellen,
     * dass ein Filter nicht unvollständig ist.
     *
     * @param {FilterInput} filter - Der Filter, der überprüft werden soll.
     * @returns {boolean} `true`, wenn ein Feld, ein Operator und ein Wert im Filter gesetzt sind,
     * andernfalls `false`.
     *
     * @example
     * ```typescript
     * const validFilter: FilterInput = { field: 'name', operator: 'EQ', value: 'John' };
     * console.log(this.#isAnyFieldSet(validFilter)); // true
     *
     * const invalidFilter: FilterInput = { field: 'name', operator: 'EQ' };
     * console.log(this.#isAnyFieldSet(invalidFilter)); // false
     * ```
     */
    #isAnyFieldSet(filter: FilterInput): boolean {
        return !!filter.field && !!filter.operator && filter.value !== undefined;
    }

    /**
     * Erstellt eine MongoDB-Query für ein einzelnes Feld basierend auf dem angegebenen Filter.
     *
     * Diese Methode validiert den Filter und den Operator, mappt den Operator auf den entsprechenden
     * MongoDB-Operator und fügt die Bedingung der MongoDB-Query hinzu.
     *
     * @param {FilterInput} filter - Der Filter, der die Bedingungen für das Feld enthält.
     * @param {FilterQuery<any>} query - Die MongoDB-Query, zu der die Bedingung hinzugefügt wird.
     *
     * @throws {Error} Wird ausgelöst, wenn das Feld oder der Operator im Filter fehlt.
     * @throws {InvalidOperatorException} Wird ausgelöst, wenn der angegebene Operator nicht unterstützt wird.
     *
     * @example
     * ```typescript
     * const filter: FilterInput = { field: 'name', operator: 'EQ', value: 'John' };
     * const query: FilterQuery<any> = {};
     * this.#buildFieldQuery(filter, query);
     * console.log(query); // { name: { $eq: 'John' } }
     * ```
     */
    #buildFieldQuery(filter: FilterInput, query: FilterQuery<any>): void {
        // Validierung von Operator und Feld
        if (!filter.operator || filter.field === null) {
            throw new Error(
                `Ungültiger Filter: operator oder field fehlt (${JSON.stringify(filter)})`,
            );
        }

        // Zuordnung des MongoDB-Operators und Hinzufügen des Filters zur Query
        const mongoOperator = operatorMap[filter.operator];
        if (!mongoOperator) {
            throw new InvalidOperatorException(filter.operator);
        }

        query[filter.field as FilterFields] = { [mongoOperator]: filter.value };
    }

    /**
     * Konvertiert einen String in eine MongoDB `ObjectId`, falls er dem gültigen Format entspricht.
     *
     * Diese Methode überprüft, ob der gegebene Wert ein 24-stelliger hexadezimaler String ist,
     * und konvertiert ihn in eine `ObjectId`. Falls der Wert nicht dem Format entspricht,
     * wird er unverändert zurückgegeben.
     *
     * @param {string} value - Der Wert, der überprüft und ggf. konvertiert werden soll.
     * @returns {Types.ObjectId | string} Eine `ObjectId`, falls der Wert ein gültiges Format hat,
     * andernfalls der ursprüngliche String.
     *
     * @example
     * ```typescript
     * const objectId = this.#convertToObjectIdIfNeeded('64b1f768d9a8e900001b1b2f');
     * console.log(objectId instanceof Types.ObjectId); // true
     *
     * const nonObjectId = this.#convertToObjectIdIfNeeded('invalid-id');
     * console.log(nonObjectId); // 'invalid-id'
     * ```
     */
    #convertToObjectIdIfNeeded(value: string) {
        if (typeof value === 'string' && /^[\da-f]{24}$/i.test(value)) {
            // Wenn der Wert eine 24-stellige hexadezimale Zahl ist, dann konvertiere ihn in eine ObjectId
            return new Types.ObjectId(value);
        }
        return value; // Falls keine ObjectId, gib den Wert unverändert zurück
    }
}
