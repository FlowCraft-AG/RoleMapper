/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance } from 'axios';
import { ENDPOINTS, TEST_MANDATES2, TEST_MANDATES3 } from '../test-data.js';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';
import type { GraphQLResponseBody } from './query-resolver.test.js';

/**
 * Prüft, ob die Antwort korrekt ist und der Content-Type JSON ist.
 * @param headers - HTTP-Header
 */
const validateHeader = (headers: any) => {
    expect(headers['content-type']).toMatch(/json/iu);
};

/**
 * Sendet eine GraphQL-Anfrage und gibt die Antwort zurück.
 * @param client - Axios-Instance
 * @param query - GraphQL-Query
 */
const sendGraphQLRequest = async (client: AxiosInstance, query: string) => {
    try {
        return await client.post<GraphQLResponseBody>('graphql', { query });
    } catch (error) {
        throw new Error(`GraphQL request failed: ${(error as Error).message}`);
    }
};

describe('MutationResolver', () => {
    let client: AxiosInstance;

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
        const createInput = TEST_MANDATES2.create;
        const query = `
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
        `;

        const { status, headers, data } = await sendGraphQLRequest(client, query);

        validateHeader(headers);

        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { createEntity } = data.data!;

        expect(createEntity.success).toBe(true);
        expect(createEntity.message).toBe('Create operation successful.');

        const result = createEntity.result;

        expect(result).toBeDefined();
        expect(result.functionName).toBe(createInput.functionName);
        expect(result.orgUnit).toBe(createInput.orgUnit);
        expect(result.users).toEqual(createInput.users);
    });

    test('[GRAPHQL] updateEntity for MANDATES', async () => {
        const updateInput = TEST_MANDATES2.update;
        const query = `
            mutation UpdateEntity {
                updateEntity(input: {
                    entity: ${ENDPOINTS.MANDATES},
                    filter:
                        {
                            field: ${updateInput.filter.field},
                            operator: ${updateInput.filter.operator},
                            value: "${updateInput.filter.value}"
                        },
                    functionData: {
                        functionName: "${updateInput.data.functionName}"
                    }
                }) {
                    success
                    message
                    affectedCount
                }
            }
        `;

        const { status, headers, data } = await sendGraphQLRequest(client, query);

        validateHeader(headers);

        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { updateEntity } = data.data!;

        expect(updateEntity.success).toBe(true);
        expect(updateEntity.message).toBe('Update operation successful.');
        expect(updateEntity.affectedCount).toBeGreaterThan(0);
    });

    test('[GRAPHQL] deleteEntity for MANDATES', async () => {
        const deleteInput = TEST_MANDATES2.delete;
        const query = `
            mutation DeleteEntity {
                deleteEntity(input: {
                    entity: ${ENDPOINTS.MANDATES},
                    filter:
                        {
                            field: ${deleteInput.field},
                            operator: ${deleteInput.operator},
                            value: "${deleteInput.value}"
                        }

                }) {
                    success
                    message
                    affectedCount
                }
            }
        `;

        const { status, headers, data } = await sendGraphQLRequest(client, query);

        validateHeader(headers);

        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { deleteEntity } = data.data!;

        expect(deleteEntity.success).toBe(true);
        expect(deleteEntity.message).toBe('Delete operation successful.');
        expect(deleteEntity.affectedCount).toBeGreaterThan(0);
    });

    test('[GRAPHQL] add to Function', async () => {
        const mandate = TEST_MANDATES3;
        const query = `
            mutation AddUserToFunction {
                addUserToFunction(functionName: "${mandate.functionName}", userId: "${mandate.userId}") {
                    _id
                    functionName
                    users
                    orgUnit
                    type
                }
            }
        `;

        const { status, headers, data } = await sendGraphQLRequest(client, query);

        validateHeader(headers);

        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { addUserToFunction } = data.data!;

        expect(addUserToFunction).toBeDefined();
        expect(addUserToFunction.functionName).toBe(mandate.functionName);
        expect(addUserToFunction.users).toContain(mandate.userId);
    });

    test('[GRAPHQL] remove from Function', async () => {
        const mandate = TEST_MANDATES3;
        const query = `
            mutation RemoveUserFromFunction {
                removeUserFromFunction(functionName: "${mandate.functionName}", userId: "${mandate.userId}") {
                    _id
                    functionName
                    users
                    orgUnit
                    type
                }
            }
        `;

        const { status, headers, data } = await sendGraphQLRequest(client, query);

        validateHeader(headers);

        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { removeUserFromFunction } = data.data!;

        expect(removeUserFromFunction).toBeDefined();
        expect(removeUserFromFunction.functionName).toBe(mandate.functionName);
        expect(removeUserFromFunction.users).not.toContain(mandate.userId);
    });
});
