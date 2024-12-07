import { Injectable } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { MutationInput } from '../model/dto/mutation.input.js';
import { MutationPayload } from '../model/types/mutation.dto.js';
import { WriteService } from '../service/write.service.js';

@Resolver()
@Injectable()
export class MutationResolver {
    constructor(private readonly service: WriteService) {}

    /**
     * Führt eine Mutation basierend auf den Eingabeparametern aus.
     * @param {MutationInput} input - Die Eingabeparameter für die Mutation.
     * @returns {Promise<MutationPayload>} - Die Antwort der Mutation.
     */
    @Mutation('createEntity')
    @Public()
    async executeMutation(@Args('input') input: MutationInput): Promise<MutationPayload> {
        const { entity, operation, data, filter } = input;

        try {
            let result;

            switch (operation) {
                case 'CREATE': {
                    result = await this.service.createEntity(entity, data);
                    break;
                }

                case 'UPDATE': {
                    result = await this.service.updateEntity(entity, filter, data);
                    break;
                }

                case 'DELETE': {
                    result = await this.service.deleteEntity(entity, filter);
                    break;
                }
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
                result: undefined,
            };
        }
    }
}
