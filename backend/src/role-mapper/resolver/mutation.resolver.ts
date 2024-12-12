/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { CreateEntityInput } from '../model/dto/create.dto.js';
import { DeleteEntityInput } from '../model/dto/delete.dto.js';
import { UpdateEntityInput } from '../model/dto/update.dto.js';
import { CreateDataInput } from '../model/input/create.input.js';
import { UpdateDataInput } from '../model/input/update.input.js';
import { MutationPayload } from '../model/payload/mutation.payload.js';
import { WriteService } from '../service/write.service.js';

@Resolver()
@Injectable()
export class MutationResolver {
    readonly #logger = getLogger(MutationResolver.name);
    readonly #service: WriteService;
    constructor(service: WriteService) {
        this.#service = service;
    }

    /**
     * Führt eine Mutation basierend auf den Eingabeparametern aus.
     * @param {MutationInput} input - Die Eingabeparameter für die Mutation.
     * @returns {Promise<MutationPayload>} - Die Antwort der Mutation.
     */
    /**
     * Erstellt eine neue Entität in der Datenbank.
     */
    @Mutation('createEntity')
    @Public()
    async createEntity(@Args('input') input: CreateEntityInput): Promise<MutationPayload> {
        this.#logger.debug('createEntity: input=%o', input);
        const { entity, userData, functionData, processData, orgUnitData, roleData } = input;

        try {
            // Map zur Zuordnung von Entitäten zu den jeweiligen Daten
            const entityDataMap: Record<string, CreateDataInput | undefined> = {
                USERS: userData,
                MANDATES: functionData,
                PROCESSES: processData,
                ORG_UNITS: orgUnitData,
                ROLES: roleData,
            };

            const data = entityDataMap[entity];

            // Validierung der Eingabe
            if (!entity) throw new Error('Entity type must be provided');
            if (!data) throw new Error(`Missing data for entity type: ${entity}`);

            // Erstellung der Entität basierend auf der dynamischen Zuordnung
            const result = await this.#service.createEntity(entity, data);

            // Rückgabe des Ergebnisses
            return {
                success: true,
                message: `Create operation successful.`,
                result,
            };
        } catch (error) {
            this.#logger.error('createEntity: Error occurred: %o', error);
            return {
                success: false,
                message: (error as Error).message,
                result: undefined,
            };
        }
    }

    /**
     * Aktualisiert eine bestehende Entität in der Datenbank.
     */
    @Public()
    @Mutation('updateEntity')
    async updateEntity(@Args('input') input: UpdateEntityInput): Promise<MutationPayload> {
        this.#logger.debug('updateEntity: input=%o', input);
        // eslint-disable-next-line @stylistic/operator-linebreak
        const { entity, filters, userData, functionData, processData, orgUnitData, roleData } =
            input;
        try {
            // Map zur Zuordnung von Entitäten zu den jeweiligen Daten
            const entityDataMap: Record<string, UpdateDataInput | undefined> = {
                USERS: userData,
                MANDATES: functionData,
                PROCESSES: processData,
                ORG_UNITS: orgUnitData,
                ROLES: roleData,
            };

            const data = entityDataMap[entity];

            // Validierung der Eingabe
            if (!entity) throw new Error('Entity type must be provided');
            if (!data) throw new Error(`Missing data for entity type: ${entity}`);
            const result = await this.#service.updateEntity(entity, filters, data);
            return {
                success: result.success,
                message: result.message,
                affectedCount: result.modifiedCount,
            };
        } catch (error) {
            return {
                success: false,
                message: (error as Error).message,
                result: undefined,
            };
        }
    }

    /**
     * Löscht eine bestehende Entität aus der Datenbank.
     */
    @Public()
    @Mutation('deleteEntity')
    async deleteEntity(@Args('input') input: DeleteEntityInput): Promise<MutationPayload> {
        this.#logger.debug('deleteEntity: input=%o', input);
        const { entity, filters } = input;

        try {
            const result = await this.#service.deleteEntity(entity, filters);
            return {
                success: result.success,
                message: result.message,
                affectedCount: result.deletedCount,
            };
        } catch (error) {
            return {
                success: false,
                message: (error as Error).message,
                result: undefined,
            };
        }
    }

    @Public()
    @Mutation('addUserToFunction')
    async addUserToRole(@Args('functionName') functionId: string, @Args('userId') userId: string) {
        this.#logger.debug('addUserToRole: functionId=%s, userId=%s', functionId, userId);
        try {
            const updatedFunction = await this.#service.addUserToFunction(functionId, userId);
            this.#logger.debug('Updated Role:', updatedFunction);
            return updatedFunction;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    @Public()
    @Mutation('removeUserFromFunction')
    async removeUserFromRole(
        @Args('functionName') functionId: string,
        @Args('userId') userId: string,
    ) {
        this.#logger.debug('removeUserFromRole: functionId=%s, userId=%s', functionId, userId);
        try {
            const updatedFunction = await this.#service.removeUserFromFunction(functionId, userId);
            this.#logger.debug('Updated Role:', updatedFunction);
            return updatedFunction;
        } catch (error) {
            this.#logger.error('Error:', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }
}
