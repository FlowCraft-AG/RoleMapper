/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { GraphQLRequest } from '@apollo/server';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { ENDPOINTS, TEST_MANDATES } from '../test-data.js';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';
import type { GraphQLResponseBody } from './query-resolver.test.js';

/**
 * Prüft, ob die Antwort korrekt ist und der Content-Type JSON ist.
 * @param status - HTTP-Statuscode
 * @param headers - HTTP-Header
 */
const validateHeader = (headers: any) => {
    expect(headers['content-type']).toMatch(/json/iu);
};

describe('MutationResolver', () => {
    let client: AxiosInstance;
    const graphqlPath = 'graphql';

    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => {
        await startServer();
        const baseURL = `https://${host}:${port}/`;
        client = axios.create({
            baseURL,
            httpsAgent,
            validateStatus: (status) => status < 500,
        });
    });

    afterAll(async () => {
        await shutdownServer();
    });

    test('[GRAPHQL] createEntity for MANDATES', async () => {
        const createInput = TEST_MANDATES.create;

        const body: GraphQLRequest = {
            query: `
            mutation CreateEntity {
                createEntity(input: {
                    entity: ${ENDPOINTS.MANDATES},
                    functionData: {
                        functionName: "${createInput.functionName}",
                        orgUnit: "${createInput.orgUnit}",
                        type: "${createInput.type}",
                        users: ${JSON.stringify(createInput.users)}
                    }
                }) {
                    success
                    message
                    result {
                        ... on Function {
                            _id
                            functionName
                            orgUnit
                            type
                            users
                        }
                    }
                }
            }
        `,
        };

        // GraphQL Anfrage
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
        );

        // Header validieren
        validateHeader(headers);

        // Status prüfen
        expect(status).toBe(HttpStatus.OK);

        // Sicherstellen, dass keine GraphQL-Fehler vorhanden sind
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        // Ergebnis prüfen
        const { createEntity } = data.data!;

        expect(createEntity.success).toBe(true);
        expect(createEntity.message).toBe('Create operation successful.');

        // Spezifische Felder prüfen
        const result = createEntity.result;

        expect(result).toBeDefined();
        expect(result.functionName).toBe(createInput.functionName);
        expect(result.orgUnit).toBe(createInput.orgUnit);
        // expect(result.type).toBe(createInput.type);
        expect(result.users).toEqual(createInput.users);
    });

    test('[GRAPHQL] updateEntity for MANDATES', async () => {
        const updateInput = TEST_MANDATES.update;
        const body: GraphQLRequest = {
            query: `
                mutation UpdateEntity {
                    updateEntity(input: {
                        entity: ${ENDPOINTS.MANDATES},
                        filters: [
                        {
                            field: ${updateInput.filters[0]!.field},
                            operator: ${updateInput.filters[0]!.operator},
                            value: "${updateInput.filters[0]!.value}"
                        }
                    ],

                        functionData: {
                        functionName: "${updateInput.data.functionName}"
                    }
                    }) {
                        success
                        message
                        affectedCount
                    }
                }
            `,
        };

        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
        );

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { updateEntity } = data.data!;

        expect(updateEntity.success).toBe(true);
        expect(updateEntity.message).toBe('Update operation successful.');
        expect(updateEntity.affectedCount).toBeGreaterThan(0);
    });

    test('[GRAPHQL] deleteEntity for MANDATES', async () => {
        const deleteInput = TEST_MANDATES.delete;
        const body: GraphQLRequest = {
            query: `
            mutation DeleteEntity {
                deleteEntity(input: {
                    entity: ${ENDPOINTS.MANDATES},
                    filters: [
                        {
                            field: ${deleteInput[0]!.field},
                            operator: ${deleteInput[0]!.operator},
                            value: "${deleteInput[0]!.value}"
                        }
                    ]
                }) {
                    success
                    message
                    affectedCount
                }
            }
        `,
        };

        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
        );

        // Assertions
        expect(status).toBe(HttpStatus.OK);

        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { deleteEntity } = data.data!;

        expect(deleteEntity.success).toBe(true);
        expect(deleteEntity.message).toBe('Delete operation successful.');
        expect(deleteEntity.affectedCount).toBeGreaterThan(0);
    });
});
