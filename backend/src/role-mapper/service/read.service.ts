import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { getLogger } from '../../logger/logger.js';
import { InvalidFilterException, InvalidOperatorException } from '../error/exceptions.js';
import { FilterInputDTO } from '../model/dto/filter.dto.js';
import { MandateDocument, Mandates } from '../model/entity/mandates.entity.js';
import { OrgUnit, OrgUnitDocument } from '../model/entity/org-unit.entity.js';
import { Process, ProcessDocument } from '../model/entity/process.entity.js';
import { Role, RoleDocument } from '../model/entity/roles.entity.js';
import { User, UserDocument } from '../model/entity/user.entity.js';
import { GetData } from '../model/input/data.input.js';
import { PaginationParams as PaginationParameters } from '../model/input/pagination-params.js';
import { EntityCategory } from '../model/types/entity-category.type.js';
import {
    ALLOWED_FIELDS,
    AllowedFields,
    FilterOperator,
    OPERATOR_KEYS,
    OPERATOR_VALUES,
} from '../model/types/filter.type.js';
import { RoleResult } from '../model/types/role-payload.type.js';

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
    readonly #modelMap: Record<string, Model<any>>;

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
            users: userModel,
            mandates: mandateModel,
            processes: processModel,
            roles: roleModel,
            orgUnits: orgUnitModel,
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
        const process = (await this.#modelMap.processes?.findOne({ processId }).exec()) as
            | Process
            | undefined;
        if (!process?.roles) {
            throw new NotFoundException(`Keine Rollen für diesen Prozess gefunden. ${processId}`);
        }

        // Überprüfen, ob der angegebene Benutzer existiert
        if (!(await this.#modelMap.users!.exists({ userId }))) {
            throw new NotFoundException(`Keinen Benutzer gefunden mit der userId: ${userId}`);
        }

        // Abrufen der Rollen-IDs aus dem Prozess
        const roleIds = process.roles.flatMap(
            (element): string[] => Object.values(element) as string[],
        );
        this.#logger.debug('roleIds=%o', roleIds);

        // Abrufen der Rollen aus der Datenbank anhand der IDs
        const roles = await this.#modelMap.roles!.find({ roleId: { $in: roleIds } }).exec();
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
                    const users = await this.#modelMap
                        .mandates!.aggregate(queryPipeline)
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
     * @param {string} entity - Der Name der Ziel-Entität (z. B. `USERS`, `FUNCTIONS`).
     * @param {FilterInputDTO} filters - Die Filterbedingungen.
     * @param {PaginationParameters} pagination - Parameter für die Seitennummerierung.
     * @returns {Promise<GetData<T>[]>} Eine Liste der gefilterten Daten.
     * @throws {BadRequestException} Wenn die Entität nicht unterstützt wird.
     */
    async findData<T extends EntityCategory>(
        entity: string,
        filters?: FilterInputDTO[],
        pagination?: PaginationParameters,
    ): Promise<GetData<T>[]> {
        this.#logger.debug(
            'findData2: entity=%s, filters=%o pagination=%o',
            entity,
            filters,
            pagination,
        );

        // Modell für die angegebene Entität abrufen
        const model = this.#modelMap[entity.toLowerCase()];
        if (!model) {
            const validEntities = Object.keys(this.#modelMap).join(', ');
            throw new BadRequestException(
                `Nicht unterstützte Entität: ${entity}. Unterstützte Entitäten sind: ${validEntities}`,
            );
        }

        // Erstellen der Filter-Query basierend auf den Eingabeparametern
        const filterQuery = this.buildFilterQuery(filters);

        // Daten mit der generierten Query abrufen
        // eslint-disable-next-line unicorn/no-array-callback-reference
        const data = await model.find(filterQuery).exec();
        return data as GetData<T>[];
    }

    /**
     * Erstellt rekursiv eine MongoDB-Filter-Query basierend auf den angegebenen Bedingungen.
     *
     * @param {FilterInputDTO} filters - Die Filterbedingungen.
     * @returns {FilterQuery<any>} Die generierte MongoDB-Query.
     * @throws {InvalidOperatorException} Wenn ein ungültiger Operator angegeben wird.
     * @throws {InvalidFilterException} Wenn ein unvollständiger Filter angegeben wird.
     */
    private buildFilterQuery(filters?: FilterInputDTO[]): FilterQuery<any> {
        if (this.isEmptyFilter(filters)) {
            this.#logger.debug('buildFilterQuery: keine Filterbedingungen angegeben');
            return {};
        }

        const query: FilterQuery<any> = {};

        // Verarbeitung der logischen Operatoren (AND, OR, NOT)
        if (filters) {
            this.processLogicalOperators(filters, query);
        }

        // Verarbeitung der Felder, falls gesetzt
        if (filters && this.isAnyFieldSet(filters)) {
            this.validateFilterFields(filters);
            this.buildFieldQuery(filters, query);
        }
        return query;
    }

    /**
     * Überprüft, ob der Filter leer ist.
     *
     * @param {FilterInputDTO} filters - Die Filterbedingungen.
     * @returns {boolean} `true`, wenn der Filter leer ist, andernfalls `false`.
     */
    private isEmptyFilter(filters?: FilterInputDTO[]): boolean {
        return !filters || filters.length === 0;
    }

    /**
     * Verarbeitet logische Operatoren (`and`, `or`, `not`) im Filter.
     *
     * @param {FilterInputDTO} filters - Die Filterbedingungen.
     * @param {FilterQuery<any>} query - Die MongoDB-Query.
     */
    private processLogicalOperators(filters: FilterInputDTO[], query: FilterQuery<any>): void {
        for (const filter of filters) {
            if (filter.and) {
                query.$and = filter.and.map((subFilter) => this.buildFilterQuery([subFilter]));
            }
            if (filter.or) {
                query.$or = filter.or.map((subFilter) => this.buildFilterQuery([subFilter]));
            }
            if (filter.not) {
                query.$not = this.buildFilterQuery([filter.not]);
            }
        }
    }

    /**
     * Überprüft, ob mindestens ein Feld im Filter gesetzt ist.
     *
     * @param {FilterInputDTO} filters - Die Filterbedingungen.
     * @returns {boolean} `true`, wenn mindestens ein Feld gesetzt ist, andernfalls `false`.
     */
    private isAnyFieldSet(filters: FilterInputDTO[]): boolean {
        return filters.some((filter) => filter.field !== null && filter.operator && filter.value);
    }

    /**
     * Validiert die Felder im Filter.
     *
     * @param {FilterInputDTO} filters - Die Filterbedingungen.
     * @throws {InvalidFilterException} Wenn ein unvollständiger Filter angegeben wird.
     */
    private validateFilterFields(filters: FilterInputDTO[]): void {
        for (const filter of filters) {
            const missingFields: string[] = [];
            if (filter.field === null) missingFields.push('Feld');
            if (!filter.operator) missingFields.push('Operator');
            if (filter.value === undefined || filter.value === null) missingFields.push('Wert');

            if (missingFields.length > 0) {
                throw new InvalidFilterException(missingFields);
            }
        }
    }

    /**
     * Erstellt eine MongoDB-Query für ein einzelnes Feld.
     *
     * @param {FilterInputDTO} filters - Die Filterbedingungen.
     * @param {FilterQuery<any>} query - Die MongoDB-Query.
     * @throws {InvalidOperatorException} Wenn ein ungültiger Operator angegeben wird.
     */
    private buildFieldQuery(filters: FilterInputDTO[], query: FilterQuery<any>): void {
        const OPERATOR_MAP = Object.fromEntries(
            // eslint-disable-next-line security/detect-object-injection
            OPERATOR_KEYS.map((key, index) => [key, OPERATOR_VALUES[index]]),
        ) as Record<FilterOperator, string>;

        for (const filter of filters) {
            // Überprüfen, ob das Feld erlaubt ist
            if (!ALLOWED_FIELDS.has(filter.field as AllowedFields)) {
                throw new Error(`Ungültiges Feld: ${filter.field}`);
            }

            // Validierung von Operator und Feld
            if (!filter.operator || filter.field === null) {
                throw new Error(
                    `Ungültiger Filter: operator oder field fehlt (${JSON.stringify(filter)})`,
                );
            }

            // Zuordnung des MongoDB-Operators und Hinzufügen des Filters zur Query
            const mongoOperator = OPERATOR_MAP[filter.operator as FilterOperator] ?? '';
            if (!mongoOperator) {
                throw new InvalidOperatorException(filter.operator);
            }

            query[filter.field as AllowedFields] = { [mongoOperator]: filter.value };
        }
    }
}
