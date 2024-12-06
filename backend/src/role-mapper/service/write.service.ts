/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @stylistic/operator-linebreak */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    FilterQuery,
    Model,
    UpdateQuery,
    UpdateWithAggregationPipeline,
    UpdateWriteOpResult,
} from 'mongoose';
import { getLogger } from '../../logger/logger.js';
import { DataInputDTO } from '../model/dto/data.dto.js';
import { FilterInputDTO } from '../model/dto/filter.dto.js';
import {
    Collections,
    SUPPORTED_ENTITIES,
    SupportedEntities,
} from '../model/entity/entities.entity.js';
import { FunctionDocument } from '../model/entity/function.entity.js';
import { OrgUnit, OrgUnitDocument } from '../model/entity/org-unit.entity.js';
import { Process, ProcessDocument } from '../model/entity/process.entity.js';
import { Role, RoleDocument } from '../model/entity/roles.entity.js';
import { User, UserDocument } from '../model/entity/user.entity.js';
import { MutationResponse } from '../resolver/mutation.response.js';

@Injectable()
export class WriteService {
    readonly #logger = getLogger(WriteService.name);

    readonly #modelMap: Record<string, Model<Collections>>;

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
     * Erstellt eine neue Entität.
     * @param {string} entity - Der Name der Entität.
     * @param {DataInputDTO} data - Die Daten für die neue Entität.
     * @returns {Promise<Collections>} - Die erstellte Entität.
     * @throws {Error} - Wenn die Entität unbekannt ist.
     */
    async createEntity(entity: string, data: DataInputDTO | undefined): Promise<Collections> {
        this.#logger.debug('createEntity: entity=%s, data=%o', entity, data);

        if (!SUPPORTED_ENTITIES.includes(entity as SupportedEntities)) {
            throw new Error(`Invalid entity: ${entity}`);
        }

        const model: Model<Collections> = this.#modelMap[
            entity as SupportedEntities
        ] as Model<Collections> & { __v: number };
        if (model === undefined) {
            throw new Error(`Entity model not found for: ${entity}`);
        }

        return model.create(data);
    }

    /**
     * Aktualisiert eine oder mehrere Entitäten.
     * @param {string} entity - Der Name der Entität.
     * @param {FilterInputDTO | undefined} filter - Die Filterkriterien.
     * @param {any} data - Die neuen Daten für die Entität.
     * @returns {Promise<any>} - Das Ergebnis der Aktualisierung.
     * @throws {Error} - Wenn die Entität unbekannt ist.
     */
    async updateEntity(
        entity: string,
        filter: FilterInputDTO | undefined,
        data: UpdateWithAggregationPipeline | UpdateQuery<any> | undefined,
    ): Promise<UpdateWriteOpResult> {
        this.#logger.debug('updateEntity: entity=%s, filter=%o, data=%o', entity, filter, data);
        const model = this.#modelMap[entity as SupportedEntities];
        if (!model) throw new Error(`Unknown entity: ${entity}`);

        const filterQuery = this.buildFilterQuery(filter);
        return model.updateMany(filterQuery, data).exec();
    }

    /**
     * Löscht eine oder mehrere Entitäten.
     * @param {string} entity - Der Name der Entität.
     * @param {FilterInputDTO | undefined} filter - Die Filterkriterien.
     * @returns {Promise<any>} - Das Ergebnis der Löschung.
     * @throws {Error} - Wenn die Entität unbekannt ist.
     */
    async deleteEntity(
        entity: string,
        filter: FilterInputDTO | undefined,
    ): Promise<MutationResponse> {
        this.#logger.debug('deleteEntity: entity=%s, filter=%o', entity, filter);
        const model = this.#modelMap[entity as SupportedEntities];
        if (!model) throw new Error(`Unknown entity: ${entity}`);

        const filterQuery = this.buildFilterQuery(filter);
        const result = await model.deleteMany(filterQuery).exec();
        return {
            success: result.deletedCount > 0,
            message:
                result.deletedCount > 0 ? 'Deletion successful' : 'No documents matched the filter',
        };
    }

    /**
     * Erstellt eine Filterabfrage aus den gegebenen Filtern.
     * @param {FilterInputDTO | undefined} filters - Die Filterkriterien.
     * @returns {FilterQuery<any>} - Die erstellte Filterabfrage.
     */
    private buildFilterQuery(filters?: FilterInputDTO): FilterQuery<any> {
        if (!filters) return {};

        const query: FilterQuery<any> = {};

        const OPERATOR_MAP: Record<string, string> = {
            EQ: '$eq',
            In: '$in',
            GTE: '$gte',
        };

        if (filters.and) {
            query.$and = filters.and.map((subFilter) => this.buildFilterQuery(subFilter));
        }
        if (filters.or) {
            query.$or = filters.or.map((subFilter) => this.buildFilterQuery(subFilter));
        }
        if (filters.not) {
            query.$not = this.buildFilterQuery(filters.not);
        }
        if (filters.field! && filters.operator !== undefined && filters.value !== undefined) {
            const mongoOperator = OPERATOR_MAP[filters.operator];
            if (!mongoOperator!) {
                throw new Error(`Invalid operator: ${filters.operator}`);
            }
            query[filters.field] = { [mongoOperator]: filters.value };
        } else if (
            filters.field! ||
            filters.operator !== undefined ||
            filters.value !== undefined
        ) {
            throw new Error(
                `Invalid filter: field, operator, and value must all be defined for a single filter.`,
            );
        }

        return query;
    }
}
