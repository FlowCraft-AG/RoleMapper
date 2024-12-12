/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @stylistic/indent */
/* eslint-disable security/detect-object-injection */

/* eslint-disable @typescript-eslint/naming-convention */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { getLogger } from '../../logger/logger.js';
import { InvalidFilterException, InvalidOperatorException } from '../error/exceptions.js';
import { EntityCategoryType, EntityType } from '../model/entity/entities.entity.js';
import { MandateDocument, Mandates } from '../model/entity/mandates.entity.js';
import { OrgUnit, OrgUnitDocument } from '../model/entity/org-unit.entity.js';
import { Process, ProcessDocument } from '../model/entity/process.entity.js';
import { Role, RoleDocument } from '../model/entity/roles.entity.js';
import { User, UserDocument } from '../model/entity/user.entity.js';
import { CreateDataInput } from '../model/input/create.input.js';
import { FilterInput } from '../model/input/filter.input.js';
import { UpdateDataInput } from '../model/input/update.input.js';
import { FilterFields } from '../model/types/filter.type.js';
import { operatorMap } from '../model/types/map.type.js';

@Injectable()
export class WriteService {
    readonly #logger = getLogger(WriteService.name);

    readonly #modelMap: Record<string, Model<EntityType>>;

    constructor(
        @InjectModel(User.name) userModel: Model<UserDocument>,
        @InjectModel(Process.name) processModel: Model<ProcessDocument>,
        @InjectModel(Mandates.name) functionModel: Model<MandateDocument>,
        @InjectModel(OrgUnit.name) orgUnitModel: Model<OrgUnitDocument>,
        @InjectModel(Role.name) roleModel: Model<RoleDocument>,
    ) {
        this.#modelMap = {
            USERS: userModel,
            MANDATES: functionModel,
            PROCESSES: processModel,
            ROLES: roleModel,
            ORG_UNITS: orgUnitModel,
        };
    }

    /**
     * Erstellt eine neue Entität.
     * @param {string} entity - Der Name der Entität.
     * @param {DataInputDTO} data - Die Daten für die neue Entität.
     * @returns {Promise<EntityType>} - Die erstellte Entität.
     * @throws {Error} - Wenn die Entität unbekannt ist.
     */

    async createEntity(entity: EntityCategoryType, data: CreateDataInput | undefined) {
        this.#logger.debug('createEntity: entity=%s, data=%o', entity, data);
        const model = this.#getModel(entity);
        const result = await model.create(data);
        return result.toObject();
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
        entity: EntityCategoryType,
        filters: FilterInput[],
        data: UpdateDataInput | undefined,
    ) {
        this.#logger.debug('updateEntity: entity=%s, filters=%o, data=%o', entity, filters, data);
        const model = this.#getModel(entity);
        const filterQuery = this.#buildFilterQuery(filters);
        const result = await model.updateMany(filterQuery, data).exec();
        this.#logger.debug('updateEntity: result=%o', result);
        return {
            success: result.modifiedCount > 0,
            message:
                result.modifiedCount > 0
                    ? 'Update operation successful.'
                    : 'No documents matched the filter',
            modifiedCount: result.modifiedCount,
            upsertedId: result.upsertedId,
            upsertedCount: result.upsertedCount,
            matchedCount: result.matchedCount,
        };
    }

    /**
     * Löscht eine oder mehrere Entitäten.
     * @param {string} entity - Der Name der Entität.
     * @param {FilterInputDTO | undefined} filter - Die Filterkriterien.
     * @returns {Promise<any>} - Das Ergebnis der Löschung.
     * @throws {Error} - Wenn die Entität unbekannt ist.
     */
    async deleteEntity(entity: EntityCategoryType, filters: FilterInput[]) {
        this.#logger.debug('deleteEntity: entity=%s, filters=%o', entity, filters);
        const model = this.#getModel(entity);
        const filterQuery = this.#buildFilterQuery(filters);
        const result = await model.deleteMany(filterQuery).exec();
        return {
            success: result.deletedCount > 0,
            message:
                result.deletedCount > 0
                    ? 'Delete operation successful.'
                    : 'No documents matched the filter',
            deletedCount: result.deletedCount,
        };
    }

    async addUserToFunction(functionName: string, userId: string) {
        this.#logger.debug('addUserToFunction: functionName=%s, userId=%s', functionName, userId);

        // Funktion basierend auf functionName finden
        const mandate = await this.#modelMap.MANDATES?.findOne({ functionName }).exec();

        if (!mandate) {
            throw new Error(`Function mit dem Namen "${functionName}" nicht gefunden.`);
        }

        // Benutzer hinzufügen, wenn die Funktion existiert
        const updatedRole = await this.#modelMap
            .MANDATES!.findByIdAndUpdate(
                mandate._id, // Hier den _id-Wert verwenden
                { $addToSet: { users: userId } }, // Verhindert Duplikate
                { new: true }, // Gibt das aktualisierte Dokument zurück
            )
            .exec();

        if (!updatedRole) {
            throw new Error(`Fehler beim Aktualisieren der Funktion "${functionName}".`);
        }

        this.#logger.debug('User erfolgreich hinzugefügt: %o', updatedRole);

        return updatedRole;
    }

    async removeUserFromFunction(functionName: string, userId: string) {
        this.#logger.debug(
            'removeUserFromFunction: functionName=%s, userId=%s',
            functionName,
            userId,
        );

        // Funktion basierend auf functionName finden
        const mandate = await this.#modelMap.MANDATES?.findOne({ functionName }).exec();

        if (!mandate) {
            throw new Error(`Function mit dem Namen "${functionName}" nicht gefunden.`);
        }

        // Benutzer entfernen
        const updatedRole = await this.#modelMap
            .MANDATES!.findByIdAndUpdate(
                mandate._id, // Hier den _id-Wert verwenden
                { $pull: { users: userId } }, // Benutzer aus dem Array entfernen
                { new: true }, // Gibt das aktualisierte Dokument zurück
            )
            .exec();

        if (!updatedRole) {
            throw new Error(`Fehler beim Aktualisieren der Funktion "${functionName}".`);
        }

        this.#logger.debug('User erfolgreich entfernt: %o', updatedRole);

        return updatedRole;
    }

    #getModel(entity: EntityCategoryType): Model<EntityType> {
        const model = this.#modelMap[entity];
        if (!model) {
            throw new BadRequestException(`Unknown entity: ${entity}`);
        }
        return model;
    }

    /**
     * Erstellt eine Filterabfrage aus den gegebenen Filtern.
     * @param {FilterInputDTO | undefined} filters - Die Filterkriterien.
     * @returns {FilterQuery<any>} - Die erstellte Filterabfrage.
     */
    #buildFilterQuery(filters?: FilterInput[]): FilterQuery<any> {
        if (!filters || filters.length === 0) {
            this.#logger.debug('buildFilterQuery: No filters provided');
            return {};
        }

        const query: FilterQuery<any> = {};

        for (const filter of filters) {
            this.#processFilter(query, filter);
        }

        return query;
    }

    #processFilter(query: FilterQuery<any>, filter: FilterInput) {
        if (filter.and) {
            query.$and = filter.and.map((subFilter) => this.#buildFilterQuery([subFilter]));
        }
        if (filter.or) {
            query.$or = filter.or.map((subFilter) => this.#buildFilterQuery([subFilter]));
        }
        if (filter.not) {
            query.$not = this.#buildFilterQuery([filter.not]);
        }
        if ((filter.field ?? '') && filter.operator && filter.value !== undefined) {
            this.#addFieldFilter(query, filter);
        } else if ((filter.field ?? '') || filter.operator || filter.value !== undefined) {
            this.#handleIncompleteFilter(filter);
        }
    }

    #addFieldFilter(query: FilterQuery<any>, filter: FilterInput) {
        if (!filter.operator) {
            this.#logger.error('Invalid operator: %s', filter.operator);
            throw new InvalidOperatorException(filter.operator);
        }
        const mongoOperator = operatorMap[filter.operator];
        query[filter.field as FilterFields] = { [mongoOperator]: filter.value };
    }

    #handleIncompleteFilter(filter: FilterInput) {
        this.#logger.error('Incomplete filter provided: %o', filter);
        throw new InvalidFilterException([
            (filter.field ?? '') ? '' : 'field',
            filter.operator ? '' : 'operator',
            filter.value === undefined ? 'value' : '',
        ]);
    }
}
