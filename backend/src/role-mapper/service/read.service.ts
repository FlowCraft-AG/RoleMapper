/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @stylistic/indent */
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
import { GetUsersByFunctionResult } from '../model/payload/kp.payload.js';
import { RoleResult } from '../model/payload/role-payload.type.js';
import { FilterField, FilterFields } from '../model/types/filter.type.js';
import { operatorMap } from '../model/types/map.type.js';

/**
 * Der Service, der alle Leseoperationen für Entitäten wie Benutzer, Prozesse und Mandate behandelt.
 *
 * Verantwortlich für das Abrufen von Entitätsdaten aus der Datenbank und das Erstellen von dynamischen Abfragen
 * basierend auf gegebenen Filtern.
 */
@Injectable()
export class ReadService {
    readonly #logger = getLogger(ReadService.name); // Logger für die Service-Protokollierung

    // Mappt Entitätsnamen auf ihre entsprechenden Mongoose-Modelle.
    readonly #modelMap: Record<EntityCategoryType, Model<any>>;

    /**
     * Konstruktor für den Service, der die Mongoose-Modelle injiziert.
     *
     * @param userModel - Modell für Benutzer.
     * @param processModel - Modell für Prozesse.
     * @param mandateModel - Modell für Mandate.
     * @param orgUnitModel - Modell für organisatorische Einheiten.
     * @param roleModel - Modell für Rollen.
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
     * Sucht die Rollen und die zugehörigen Benutzer für einen gegebenen Prozess.
     *
     * @param {string} processId - Die ID des Prozesses, für den die Rollen gesucht werden.
     * @param {string} userId - Die ID des Benutzers, der die Anfrage stellt.
     * @returns {Promise<{ roles: RoleResult[] }>} Eine Liste der Rollen und der zugehörigen Benutzer.
     * @throws {NotFoundException} Wenn der Prozess oder der Benutzer nicht gefunden werden kann.
     */
    async findProcessRoles(processId: string, userId: string): Promise<{ roles: RoleResult[] }> {
        this.#logger.debug('findProcessRoles: processId=%s, userId=%s', processId, userId);

        // Abrufen des Prozesses aus der Datenbank anhand der Prozess-ID
        const process: Process = await this.#modelMap.PROCESSES?.findOne({ processId }).exec();
        if (process?.roles === undefined) {
            throw new NotFoundException(`Keine Rollen für diesen Prozess gefunden. ${processId}`);
        }

        // Überprüfen, ob der angegebene Benutzer existiert
        if (!(await this.#modelMap.USERS.exists({ userId }))) {
            throw new NotFoundException(
                `findProcessRoles: Keinen Benutzer gefunden mit der userId: ${userId}`,
            );
        }

        // Alle Rollen-IDs aus dem Prozess extrahieren
        const roleIds = process.roles.flatMap((role: ShortRole) => role.roleId);
        this.#logger.debug('findProcessRoles: Rollen-IDs aus Prozess: %o', roleIds);

        // Abrufen der Rollen aus der Datenbank anhand der IDs
        const roles: Role[] = await this.#modelMap.ROLES.find({ roleId: { $in: roleIds } }).exec();
        if (roles?.length === 0) {
            throw new NotFoundException(
                `Keine Rolleninformationen gefunden für IDs: ${roleIds.join(', ')}`,
            );
        }
        this.#logger.debug('findProcessRoles: roles=%o', roles);

        // // Zuordnen der Rollen zu einer Map, um sie schnell abzurufen
        // const rolesMap = new Map(roles.map((role) => [role.roleId, role.query]));
        // this.#logger.debug('findProcessRoles: rolesMap=%o', rolesMap);

        // if (rolesMap.size === 0) {
        //     this.#logger.warn('findProcessRoles: Keine Rollen gefunden für: %o', roleIds);
        // }

        // Rollen und zugehörige Benutzer mit Aggregations-Pipeline verarbeiten
        const results = await Promise.all(
            roles.map(async (role) => {
                this.#logger.debug('Verarbeite Rolle: %o', role);

                try {
                    // Abfrage-Pipeline aus der Rolle ausführen
                    const queryPipeline = role.query ?? [];
                    const users = await this.#modelMap.MANDATES.aggregate(queryPipeline)
                        .option({ let: { userId } }) // Lokale Variable für die Pipeline
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
        const filteredResults = results.filter(Boolean);
        this.#logger.debug('findProcessRoles: filteredResults=%o', filteredResults);
        this.#logger.info('findProcessRoles: Verarbeitung abgeschlossen');
        return { roles: filteredResults as RoleResult[] };
    }

    // Funktion zum Abrufen der gespeicherten Query und Ausführen der findData-Methode
    async executeSavedQuery(id: string) {
        // Abrufen der gespeicherten Query basierend auf functionName und orgUnitId
        const savedQuery = await this.#modelMap.MANDATES.findOne({
            _id: id,
        });

        this.#logger.debug('executeSavedQuery: savedQuery=%o', savedQuery);

        if (savedQuery === undefined || savedQuery.query === undefined) {
            throw new Error('Keine gespeicherte Query gefunden');
        }

        const functionName: string = savedQuery.functionName;
        // Extrahieren der Filter-, Sortier- und Paginierungsparameter aus der gespeicherten Query
        const { filter, pagination, sort } = savedQuery.query;

        // Aufruf der findData-Methode mit den abgerufenen Parametern
        const data = await this.findData('USERS', filter, pagination, sort);

        // Nur Mandates zurückgeben
        return { functionName, data };
    }

    /**
     * Führt eine dynamische Filterung für eine angegebene Entität durch.
     *
     * @param {string} entity - Der Name der Ziel-Entität (z. B. `users`, `mandates`).
     * @param {FilterInput} filter - Die Filterbedingungen.
     * @param {PaginationParameters} pagination - Parameter für die Seitennummerierung.
     * @returns {Promise} Eine Liste der gefilterten Daten.
     * @throws {BadRequestException} Wenn die Entität nicht unterstützt wird.
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

        // Daten mit der generierten Query und Sortierung abrufen
        const data = await model.find(filterQuery).sort(sortQuery).exec();
        const rawData = data.map(
            (document: EntityType): EntityType => document.toObject() as EntityType,
        );

        // Anwendung der Paginierung, wenn angegeben
        const paginatedData = pagination
            ? rawData.slice(
                  (pagination.offset ?? 0) || 0,
                  ((pagination.offset ?? 0) || 0) + (pagination.limit ?? 0),
              )
            : rawData;
        this.#logger.debug(
            'findData: pagination limit=$s, offset=%s',
            pagination?.limit,
            pagination?.offset,
        );
        return paginatedData as T[];
    }

    /**
     * Erstellt rekursiv eine MongoDB-Filter-Query basierend auf den angegebenen Bedingungen.
     *
     * @param {FilterInput} filter - Die Filterbedingungen.
     * @returns {FilterQuery<any>} Die generierte MongoDB-Query.
     * @throws {InvalidOperatorException} Wenn ein ungültiger Operator angegeben wird.
     * @throws {InvalidFilterException} Wenn ein unvollständiger Filter angegeben wird.
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
     * @param {SortInput} orderBy - Die Sortierbedingungen.
     * @returns {SortQuery} Die generierte Sortier-Query.
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

    async findUsersByFunction(id: string): Promise<GetUsersByFunctionResult> {
        this.#logger.debug('findUsersByFunction: id=%s', id);

        const mandateFilter: FilterInput = { field: '_id', value: id, operator: 'EQ' };
        const sort: SortInput = { field: 'userId', direction: 'ASC' };

        const mandates: Mandates[] = await this.findData<Mandates>(
            'MANDATES',
            mandateFilter,
            undefined,
            sort,
        );

        if (mandates.length === 0) {
            this.#logger.warn('Kein Mandat gefunden für id=%s', id);
            throw new NotFoundException(`Kein Mandat gefunden für ID: ${id}`);
        }

        const mandate = mandates[0];
        if (!mandate) {
            this.#logger.warn('Kein Mandat gefunden für id=%s', id);
            throw new NotFoundException(`Kein Mandat gefunden für ID: ${id}`);
        }

        if (!(mandate._id instanceof Types.ObjectId)) {
            throw new TypeError('Ungültige ObjectId im Mandat.');
        }

        const { users, functionName, isImpliciteFunction, orgUnit } = mandate;
        this.#logger.debug('findUsersByFunction: mandate=%o', mandate);

        if (!users || users.length === 0) {
            this.#logger.warn('Keine Benutzer im Mandat gefunden.');
            return { functionName, users: [], isImpliciteFunction, orgUnit };
        }

        const userFilter: FilterInput = {
            OR: users.map((u) => ({ field: 'userId', operator: 'EQ', value: u })),
        };

        const userList: User[] = await this.findData('USERS', userFilter, undefined, sort);

        return { functionName, users: userList, isImpliciteFunction, orgUnit };
    }

    async findAncestors(id: Types.ObjectId): Promise<OrgUnit[]> {
        this.#logger.debug('findAncestors: id=%s', id);

        const currentOrgUnit: OrgUnit | undefined = await this.#modelMap.ORG_UNITS.findOne({
            _id: id,
        }).exec();

        if (!currentOrgUnit) {
            throw new NotFoundException(`Keine Organisationseinheit gefunden für ID: ${id}`);
        }

        const ancestors: OrgUnit[] = [];

        // Rekursive Hilfsfunktion
        const findParent = async (currentId: Types.ObjectId | undefined): Promise<void> => {
            const orgUnit: OrgUnit | null = await this.#modelMap.ORG_UNITS.findOne({
                _id: currentId,
            }).exec();

            if (orgUnit?.parentId) {
                this.#logger.debug('Found parent: %o', orgUnit);
                await findParent(orgUnit.parentId); // Rekursion
                ancestors.push(orgUnit); // Nach der Rekursion hinzufügen, um die Reihenfolge umzukehren
            } else if (orgUnit) {
                ancestors.push(orgUnit); // Falls keine weiteren Eltern vorhanden sind, hinzufügen
            }
        };

        await findParent(currentOrgUnit.parentId);

        this.#logger.debug('findAncestors: ancestors=%o', ancestors);
        return ancestors;
    }

    /**
     * Mappt spezielle Felder (z. B. courseOfStudy -> student.courseOfStudy).
     *
     * @param field - Das ursprüngliche Feld.
     * @returns Das gemappte Feld (falls ein Mapping existiert), sonst das Original.
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
     * Überprüft, ob der Filter leer ist.
     *
     * @param {FilterInput} filter - Die Filterbedingungen.
     * @returns {boolean} `true`, wenn der Filter leer ist, andernfalls `false`.
     */
    #isEmptyFilter(filter?: FilterInput): boolean {
        return !filter || filter === undefined;
    }

    /**
     * Verarbeitet logische Operatoren (`and`, `or`, `not`) im Filter.
     *
     * @param {FilterInput} filter - Die Filterbedingungen.
     * @param {FilterQuery<any>} query - Die MongoDB-Query.
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
     * Überprüft, ob mindestens ein Feld im Filter gesetzt ist.
     *
     * @param {FilterInput} filter - Die Filterbedingungen.
     * @returns {boolean} `true`, wenn mindestens ein Feld gesetzt ist, andernfalls `false`.
     */
    #isAnyFieldSet(filter: FilterInput): boolean {
        return !!filter.field && !!filter.operator && filter.value !== undefined;
    }

    /**
     * Validiert die Felder im Filter.
     *
     * @param {FilterInput} filter - Die Filterbedingungen.
     * @throws {InvalidFilterException} Wenn ein unvollständiger Filter angegeben wird.
     */
    // #validateFilterFields(filter: FilterInput): void {
    //     const missingFields: string[] = [];
    //     if (filter.field === null) missingFields.push('Feld');
    //     if (!filter.operator) missingFields.push('Operator');
    //     if (filter.value === undefined || filter.value === null) missingFields.push('Wert');

    //     if (missingFields.length > 0) {
    //         throw new InvalidFilterException(missingFields);
    //     }
    // }

    /**
     * Erstellt eine MongoDB-Query für ein einzelnes Feld.
     *
     * @param {FilterInput} filter - Die Filterbedingungen.
     * @param {FilterQuery<any>} query - Die MongoDB-Query.
     * @throws {InvalidOperatorException} Wenn ein ungültiger Operator angegeben wird.
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

    // Diese Methode prüft, ob der Wert eine gültige ObjectId ist und konvertiert ihn
    #convertToObjectIdIfNeeded(value: string) {
        if (typeof value === 'string' && /^[\da-f]{24}$/i.test(value)) {
            // Wenn der Wert eine 24-stellige hexadezimale Zahl ist, dann konvertiere ihn in eine ObjectId
            return new Types.ObjectId(value);
        }
        return value; // Falls keine ObjectId, gib den Wert unverändert zurück
    }
}
