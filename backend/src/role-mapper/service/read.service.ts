/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @stylistic/indent */
/* eslint-disable @typescript-eslint/naming-convention */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { getLogger } from '../../logger/logger.js';
import { InvalidOperatorException } from '../error/exceptions.js';
import { EntityCategoryType, EntityType } from '../model/entity/entities.entity.js';
import { MandateDocument, Mandates } from '../model/entity/mandates.entity.js';
import { OrgUnit, OrgUnitDocument } from '../model/entity/org-unit.entity.js';
import { Process, ProcessDocument } from '../model/entity/process.entity.js';
import { Role, RoleDocument } from '../model/entity/roles.entity.js';
import { User, UserDocument } from '../model/entity/user.entity.js';
import { FilterInput } from '../model/input/filter.input.js';
import { PaginationParameters } from '../model/input/pagination-parameters.js';
import { SortInput } from '../model/input/sort.input.js';
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
        const process = (await this.#modelMap.PROCESSES?.findOne({ processId }).exec()) as
            | Process
            | undefined;
        if (!process?.roles) {
            throw new NotFoundException(`Keine Rollen für diesen Prozess gefunden. ${processId}`);
        }

        // Überprüfen, ob der angegebene Benutzer existiert
        if (!(await this.#modelMap.USERS.exists({ userId }))) {
            throw new NotFoundException(`Keinen Benutzer gefunden mit der userId: ${userId}`);
        }

        // Abrufen der Rollen-IDs aus dem Prozess
        const roleIds = process.roles.flatMap(
            (element): string[] => Object.values(element) as string[],
        );
        this.#logger.debug('roleIds=%o', roleIds);

        // Abrufen der Rollen aus der Datenbank anhand der IDs
        const roles = await this.#modelMap.ROLES.find({ roleId: { $in: roleIds } }).exec();
        this.#logger.debug('findProcessRoles: roles=%o', roles);

        // Zuordnen der Rollen zu einer Map, um sie schnell abzurufen
        const rolesMap = new Map(roles.map(({ roleId, query }) => [roleId, query]));
        this.#logger.debug('findProcessRoles: rolesMap=%o', rolesMap);

        if (rolesMap.size === 0) {
            this.#logger.warn('findProcessRoles: Keine Rollen gefunden für: %o', roleIds);
        }

        // Verarbeitung der Rollen und der zugehörigen Benutzer
        const results = await Promise.all(
            process.roles.map(async (roleObject: any) => {
                // eslint-disable-next-line @stylistic/operator-linebreak
                const [roleKey, roleId] =
                    Object.entries((roleObject as Record<string, unknown>) ?? {})[0] ?? [];
                this.#logger.debug('findProcessRoles: roleKey=%s, roleId=%s', roleKey, roleId);

                // Überprüfen, ob die Rolle gültig ist
                if (roleKey === null || roleId === undefined || !rolesMap.has(roleId)) {
                    this.#logger.warn('Ungültige oder fehlende Rolle: %o', roleObject);
                    return;
                }

                try {
                    // Ausführen einer Aggregationsabfrage, um die Benutzer für die Rolle zu finden
                    const queryPipeline = rolesMap.get(roleId)! as any[];
                    const users = await this.#modelMap.MANDATES.aggregate(queryPipeline)
                        .option({ let: { userId } })
                        .exec();
                    return { roleName: roleKey, users };
                } catch (error) {
                    this.#logger.error('Fehler bei Rolle %s: %o', roleKey, error);
                    return;
                }
            }),
        );
        const filteredResults = results.filter(Boolean);
        this.#logger.debug('findProcessRoles: filteredResults=%o', filteredResults);
        this.#logger.info('findProcessRoles: Verarbeitung abgeschlossen');
        return { roles: filteredResults as RoleResult[] };
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
    async findData(
        entity: EntityCategoryType,
        filter?: FilterInput,
        pagination?: PaginationParameters,
        orderBy?: SortInput,
    ) {
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
        this.#logger.debug('findData: data=%o', data);
        const rawData = data.map(
            (document: EntityType): EntityType => document.toObject() as EntityType,
        );
        this.#logger.debug('findData: rawData=%o', rawData);

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
        return paginatedData;
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

        // Validierung der Richtung
        if (direction !== 'ASC' && direction !== 'DESC') {
            throw new Error(`Ungültige Sortierrichtung: ${direction}`);
        }

        const sortQuery: Record<string, 1 | -1> = {
            [field]: direction === 'ASC' ? 1 : -1,
        };

        this.#logger.debug('buildSortQuery: sortQuery=%o', sortQuery);
        return sortQuery;
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
}
