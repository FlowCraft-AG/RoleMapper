import { Injectable } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { WriteService } from '../service/write.service.js';
import { MutationInput } from './mutation.input.js';
import { MutationResponse } from './mutation.response.js';

@Resolver()
@Injectable()
export class MutationResolver {
    constructor(private readonly service: WriteService) {}

    /**
     * Führt eine Mutation basierend auf den Eingabeparametern aus.
     * @param {MutationInput} input - Die Eingabeparameter für die Mutation.
     * @returns {Promise<MutationResponse>} - Die Antwort der Mutation.
     */
    @Mutation(() => MutationResponse)
    @Public()
    async executeMutation(@Args('input') input: MutationInput): Promise<MutationResponse> {
        const { entity, operation, data, filter } = input;

        try {
            let result;

            switch (operation) {
                case 'CREATE':
                    result = await this.service.createEntity(entity, data);
                    break;

                case 'UPDATE':
                    result = await this.service.updateEntity(entity, filter, data);
                    break;

                case 'DELETE':
                    result = await this.service.deleteEntity(entity, filter);
                    break;

                default:
                    throw new Error(`Unsupported operation: ${operation}`);
            }

            return {
                success: true,
                message: `${operation} operation successful.`,
                result,
            };
        } catch (error) {
            return {
                success: false,
                message: (error as Error).message,
                result: null,
            };
        }
    }
}
