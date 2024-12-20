/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @stylistic/indent */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @stylistic/operator-linebreak */

/* eslint-disable @typescript-eslint/naming-convention */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { getLogger } from '../../logger/logger.js';
import { EntityCategoryType, EntityType } from '../model/entity/entities.entity.js';
import { MandateDocument, Mandates } from '../model/entity/mandates.entity.js';
import { OrgUnit, OrgUnitDocument } from '../model/entity/org-unit.entity.js';
import { Process, ProcessDocument } from '../model/entity/process.entity.js';
import { Role, RoleDocument } from '../model/entity/roles.entity.js';
import { User, UserDocument } from '../model/entity/user.entity.js';
import {
    CreateDataInput,
    CreateFunctionInput,
    CreateOrgUnitInput,
} from '../model/input/create.input.js';
import { FilterInput } from '../model/input/filter.input.js';
import { UpdateDataInput } from '../model/input/update.input.js';
import { ReadService } from './read.service.js';

@Injectable()
export class WriteService {
    readonly #logger = getLogger(WriteService.name);
    readonly #readService: ReadService;
    readonly #modelMap: Record<string, Model<EntityType>>;

    constructor(
        @InjectModel(User.name) userModel: Model<UserDocument>,
        @InjectModel(Process.name) processModel: Model<ProcessDocument>,
        @InjectModel(Mandates.name) functionModel: Model<MandateDocument>,
        @InjectModel(OrgUnit.name) orgUnitModel: Model<OrgUnitDocument>,
        @InjectModel(Role.name) roleModel: Model<RoleDocument>,
        readService: ReadService,
    ) {
        this.#modelMap = {
            USERS: userModel,
            MANDATES: functionModel,
            PROCESSES: processModel,
            ROLES: roleModel,
            ORG_UNITS: orgUnitModel,
        };
        this.#readService = readService;
    }

    /**
     * Erstellt eine neue Entität.
     * @param {string} entity - Der Name der Entität.
     * @param {DataInputDTO} data - Die Daten für die neue Entität.
     * @returns {Promise<EntityType>} - Die erstellte Entität.
     * @throws {Error} - Wenn die Entität unbekannt ist.
     */

    async createEntity(entity: EntityCategoryType, data: CreateDataInput) {
        this.#logger.debug('createEntity: entity=%s, data=%o', entity, data);
        const model = this.#getModel(entity);

        // Typprüfung für ORG_UNITS
        if (entity === 'ORG_UNITS' && this.#isCreateOrgUnitInput(data)) {
            data.parentId = this.#convertToObjectId(data.parentId, 'parentId');
        }

        // Typprüfung für MANDATES
        if (entity === 'MANDATES' && this.#isCreateMandateInput(data)) {
            data.orgUnit = this.#convertToObjectId(data.orgUnit, 'orgUnit') ?? new Types.ObjectId();
        }

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
        filters: FilterInput,
        data: UpdateDataInput | undefined,
    ) {
        this.#logger.debug('updateEntity: entity=%s, filters=%o, data=%o', entity, filters, data);
        const model = this.#getModel(entity);
        const filterQuery = this.#readService.buildFilterQuery(filters);
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
    async deleteEntity(entity: EntityCategoryType, filters: FilterInput) {
        this.#logger.debug('deleteEntity: entity=%s, filters=%o', entity, filters);
        const model = this.#getModel(entity);
        const filterQuery = this.#readService.buildFilterQuery(filters);
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
            throw new NotFoundException(`Funktion mit dem Namen "${functionName}" nicht gefunden.`);
        }

        let updatedMandate;

        if ((mandate as MandateDocument).isSingleUser) {
            // Einzelbenutzer-Mandant: Ersetze den Benutzer
            this.#logger.debug('Einzelbenutzer-Mandant erkannt. Ersetze den Benutzer.');
            throw new Error(
                'Einzelbenutzer-Funktion erkannt! Diese Funktion kann nur einem User zugewiesen werden.',
            );
            // updatedMandate = await this.#modelMap
            //     .MANDATES!.findByIdAndUpdate(
            //         mandate._id, // ID des Mandanten
            //         { $set: { users: [userId] } }, // Ersetze den gesamten Benutzer-Array
            //         { new: true }, // Gibt das aktualisierte Dokument zurück
            //     )
            //     .exec();
        } else {
            // Mehrbenutzer-Mandant: Füge Benutzer hinzu, falls noch nicht vorhanden
            this.#logger.debug('Mehrbenutzer-Mandant erkannt. Füge Benutzer hinzu.');
            updatedMandate = await this.#modelMap
                .MANDATES!.findByIdAndUpdate(
                    mandate._id,
                    { $addToSet: { users: userId } }, // Verhindert Duplikate
                    { new: true }, // Gibt das aktualisierte Dokument zurück
                )
                .exec();
        }

        if (!updatedMandate) {
            throw new Error(`Fehler beim Aktualisieren der Funktion "${functionName}".`);
        }

        this.#logger.debug(
            'Benutzer erfolgreich aktualisiert: mandate=%s, updatedUsers=%o',
            functionName,
            (updatedMandate as MandateDocument).users,
        );

        return updatedMandate;
    }

    async removeUserFromFunction(functionName: string, userId: string, newUserId?: string) {
        this.#logger.debug(
            'removeUserFromFunction: functionName=%s, userId=%s, newUserId=%s',
            functionName,
            userId,
            newUserId,
        );

        // Funktion basierend auf functionName finden
        const mandate = await this.#modelMap.MANDATES?.findOne({ functionName }).exec();

        if (!mandate) {
            throw new Error(`Funktion mit dem Namen "${functionName}" nicht gefunden.`);
        }

        if (!(mandate as MandateDocument).users.includes(userId)) {
            throw new Error(
                `Der Benutzer "${userId}" ist nicht mit der Funktion "${functionName}" verknüpft.`,
            );
        }
        if ((mandate as MandateDocument).isSingleUser) {
            // Einzelbenutzer-Mandant: Prüfen, ob ein neuer Benutzer angegeben wurde
            if (!(newUserId ?? '')) {
                throw new Error(
                    `Der Benutzer "${userId}" kann nicht entfernt werden, da der Mandant nur einen Benutzer erlaubt. Bitte geben Sie einen neuen Benutzer an.`,
                );
            }

            // Benutzer ersetzen
            this.#logger.debug(
                'Einzelbenutzer-Mandant erkannt. Ersetze Benutzer "%s" mit "%s".',
                userId,
                newUserId,
            );
            const updatedMandate = await this.#modelMap
                .MANDATES!.findByIdAndUpdate(
                    mandate._id, // ID des Mandanten
                    { $set: { users: [newUserId] } }, // Ersetze den Benutzer
                    { new: true }, // Gibt das aktualisierte Dokument zurück
                )
                .exec();

            if (!updatedMandate) {
                throw new Error(
                    `Fehler beim Ersetzen des Benutzers "${userId}" in der Funktion "${functionName}".`,
                );
            }

            this.#logger.debug(
                'Benutzer erfolgreich ersetzt: mandate=%s, updatedUsers=%o',
                functionName,
                (updatedMandate as MandateDocument).users,
            );

            return updatedMandate;
        } else {
            // Mehrbenutzer-Mandant: Benutzer entfernen
            this.#logger.debug('Mehrbenutzer-Mandant erkannt. Entferne Benutzer "%s".', userId);
            const updatedMandate = await this.#modelMap
                .MANDATES!.findByIdAndUpdate(
                    mandate._id,
                    { $pull: { users: userId } }, // Benutzer aus dem Array entfernen
                    { new: true }, // Gibt das aktualisierte Dokument zurück
                )
                .exec();

            if (!updatedMandate) {
                throw new Error(
                    `Fehler beim Entfernen des Benutzers "${userId}" in der Funktion "${functionName}".`,
                );
            }

            this.#logger.debug(
                'Benutzer erfolgreich entfernt: mandate=%s, updatedUsers=%o',
                functionName,
                (updatedMandate as MandateDocument).users,
            );

            return updatedMandate;
        }
    }

    #getModel(entity: EntityCategoryType): Model<EntityType> {
        const model = this.#modelMap[entity];
        if (!model) {
            throw new BadRequestException(`Unknown entity: ${entity}`);
        }
        return model;
    }

    // Hilfsfunktion zur Typprüfung
    #isCreateOrgUnitInput(data: CreateDataInput | undefined): data is CreateOrgUnitInput {
        return (data as CreateOrgUnitInput)?.name !== undefined;
    }

    #isCreateMandateInput(data: CreateDataInput | undefined): data is CreateFunctionInput {
        return (data as CreateFunctionInput)?.functionName !== undefined;
    }

    #convertToObjectId(
        value: Types.ObjectId | string | undefined,
        fieldName: string,
    ): Types.ObjectId | undefined {
        if (value !== undefined && value !== null && typeof value === 'string') {
            try {
                return new (Types.ObjectId as unknown as new (id: string) => Types.ObjectId)(value);
            } catch (error) {
                const errorMessage = (error as Error).message;
                throw new Error(`Ungültige ${fieldName}: ${value}, Fehler: ${errorMessage}`);
            }
        }
        return value;
    }
}
