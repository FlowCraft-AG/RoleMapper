/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @stylistic/operator-linebreak */
/* eslint-disable @typescript-eslint/naming-convention */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { getLogger } from '../../logger/logger.js';
import { RoleResult } from '../controller/read.controller.js';
import { FilterDTO } from '../model/dto/filter.dto.js';
import { SupportedEntities } from '../model/entity/entities.entity.js';
import { Function, FunctionDocument } from '../model/entity/function.entity.js';
import { OrgUnit, OrgUnitDocument } from '../model/entity/orgUnit.entity.js';
import { Process, ProcessDocument } from '../model/entity/process.entity.js';
import { Role, RoleDocument } from '../model/entity/roles.entity.js';
import { User, UserDocument } from '../model/entity/user.entity.js';
import { InvalidFilterException, InvalidOperatorException } from './exceptions.js';

@Injectable()
export class ReadService {
    readonly #logger = getLogger(ReadService.name);

    readonly #modelMap: Record<string, Model<any>>;

    constructor(
        @InjectModel(User.name) userModel: Model<UserDocument>,
        @InjectModel(Process.name) processModel: Model<ProcessDocument>,
        @InjectModel(Function.name) functionModel: Model<FunctionDocument>,
        @InjectModel(OrgUnit.name) orgUnitModel: Model<OrgUnitDocument>,
        @InjectModel(Role.name) roleModel: Model<RoleDocument>,
    ) {
        this.#modelMap = {
            USERS: userModel,
            FUNCTIONS: functionModel,
            PROCESSES: processModel,
            ROLES: roleModel,
            ORG_UNITS: orgUnitModel,
        };
    }

    /**
     * Sucht die Rollen und die zugehörigen Benutzer für einen gegebenen Prozess.
     *
     * @param {string} processId - Die ID des Prozesses, für den die Rollen gesucht werden.
     * @param {string} userId - Die ID des Benutzers, der die Anfrage stellt (für Abfragen verwendet).
     * @returns {Promise<{ roles: RoleResult[] }>} Eine Liste der Rollen und der zugehörigen Benutzer.
     * @throws {NotFoundException} Wenn der Prozess oder der Benutzer nicht gefunden werden kann.
     */
    async findProcessRoles(processId: string, userId: string): Promise<{ roles: RoleResult[] }> {
        this.#logger.debug('findProcessRoles: processId=%s, userId=%s', processId, userId);

        const process = (await this.#modelMap.PROCESSES!.findOne({ processId }).exec()) as
            | Process
            | undefined;
        if (!process?.roles) {
            throw new NotFoundException(`Keine Rollen für diesen Prozess gefunden. ${processId}`);
        }

        if (!(await this.#modelMap.USERS!.exists({ userId }))) {
            throw new NotFoundException(`Keinen Benutzer gefunden mit der userId: ${userId}`);
        }

        const roleIds = process.roles.flatMap(
            (element): string[] => Object.values(element) as string[],
        );
        this.#logger.debug('roleIds=%o', roleIds);

        const roles = await this.#modelMap.ROLES!.find({ roleId: { $in: roleIds } }).exec();
        this.#logger.debug('findProcessRoles: roles=%o', roles);
        const rolesMap = new Map(roles.map(({ roleId, query }) => [roleId, query]));
        this.#logger.debug('findProcessRoles: rolesMap=%o', rolesMap);

        if (rolesMap.size === 0) {
            this.#logger.warn('findProcessRoles: Keine Rollen gefunden für: %o', roleIds);
        }

        const results = await Promise.all(
            process.roles.map(async (roleObject: any) => {
                const [roleKey, roleId] =
                    Object.entries((roleObject as Record<string, unknown>) ?? {})[0] ?? [];
                this.#logger.debug('findProcessRoles: roleKey=%s, roleId=%s', roleKey, roleId);
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                if (roleKey === null || !roleId || !rolesMap.has(roleId)) {
                    this.#logger.warn('Ungültige oder fehlende Rolle: %o', roleObject);
                    return;
                }

                try {
                    const queryPipeline = rolesMap.get(roleId)! as any[];
                    const users = await this.#modelMap
                        .FUNCTIONS!.aggregate(queryPipeline)
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
        return { roles: results as RoleResult[] };
    }

    /**
     * Führt eine dynamische Filterung für eine angegebene Entität durch.
     *
     * @param {string} entity - Der Name der Ziel-Entität (z. B. `USERS`, `FUNCTIONS`).
     * @param {FilterDTO} filters - Die Filterbedingungen.
     * @returns {Promise<any[]>} Eine Liste der gefilterten Daten.
     * @throws {BadRequestException} Wenn die Entität nicht unterstützt wird.
     */
    async findData(entity: string, filters: FilterDTO): Promise<any[]> {
        this.#logger.debug('findData: entity=%s, filters=%o', entity, filters);

        const model = this.#modelMap[entity as SupportedEntities];
        if (!model) {
            const validEntities = Object.keys(this.#modelMap).join(', ');
            throw new BadRequestException(
                `Nicht unterstützte Entität: ${entity}. Unterstützte Entitäten sind: ${validEntities}`,
            );
        }

        const filterQuery = this.buildFilterQuery(filters);
        this.#logger.debug('findData: Filter Query=%o', filterQuery);

        // eslint-disable-next-line unicorn/no-array-callback-reference
        return model.find(filterQuery).exec();
    }

    /**
     * Erstellt rekursiv eine MongoDB-Filter-Query basierend auf den angegebenen Bedingungen.
     *
     * @param {FilterDTO} filters - Die Filterbedingungen in einem rekursiven Schema.
     * @returns {FilterQuery<any>} Die generierte MongoDB-Query.
     * @throws {InvalidOperatorException} Wenn ein ungültiger Operator angegeben wird.
     * @throws {InvalidFilterException} Wenn ein unvollständiger Filter angegeben wird.
     */
    private buildFilterQuery(filters?: FilterDTO): FilterQuery<any> {
        if (this.isEmptyFilter(filters)) {
            return {};
        }

        const query: FilterQuery<any> = {};

        if (filters) {
            this.processLogicalOperators(filters, query);
        }

        if (filters && this.isAnyFieldSet(filters)) {
            this.validateFilterFields(filters);
            this.buildFieldQuery(filters, query);
        }

        return query;
    }

    private isEmptyFilter(filters?: FilterDTO): boolean {
        return (
            !filters ||
            (Object.keys(filters).length === 0 &&
                filters.field === null &&
                filters.operator === null &&
                filters.value === undefined)
        );
    }

    private processLogicalOperators(filters: FilterDTO, query: FilterQuery<any>): void {
        if (filters.and)
            query.$and = filters.and.map((subFilter) => this.buildFilterQuery(subFilter));
        if (filters.or) query.$or = filters.or.map((subFilter) => this.buildFilterQuery(subFilter));
        if (filters.not) query.$not = this.buildFilterQuery(filters.not);
    }

    private isAnyFieldSet(filters: FilterDTO): boolean {
        return (
            filters.field !== null || filters.operator !== undefined || filters.value !== undefined
        );
    }

    private validateFilterFields(filters: FilterDTO): void {
        const missingFields: string[] = [];
        if (filters.field === null) missingFields.push('Feld');
        if (filters.operator === undefined) missingFields.push('Operator');
        if (filters.value === undefined) missingFields.push('Wert');

        if (missingFields.length > 0) {
            throw new InvalidFilterException(missingFields);
        }
    }

    private buildFieldQuery(filters: FilterDTO, query: FilterQuery<any>): void {
        const OPERATOR_MAP: Record<string, string> = {
            EQ: '$eq',
            IN: '$in',
            GTE: '$gte',
            LTE: '$lte',
            LIKE: '$regex',
        };

        const mongoOperator = OPERATOR_MAP[filters.operator!]!;
        if (mongoOperator === null) {
            throw new InvalidOperatorException(filters.operator!);
        }

        query[filters.field!] = { [mongoOperator]: filters.value };
    }
}
