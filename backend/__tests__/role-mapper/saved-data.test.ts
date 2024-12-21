/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance } from 'axios';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';
import { type GraphQLResponseBody } from './query-resolver.test.js';

const graphqlPath = 'graphql';
let client: AxiosInstance;
let newSavedDataId: string;

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

const validateHeader = (headers: any) => {
    expect(headers['content-type']).toMatch(/json/iu);
};

const sendGraphQLRequest = async (query: string) => {
    try {
        return await client.post<GraphQLResponseBody>(graphqlPath, { query });
    } catch (error) {
        throw new Error(`GraphQL request failed: ${(error as Error).message}`);
    }
};

describe('saveQuery and getSavedData GraphQL Mutation and Query', () => {
    // Test 1: Save Query
    test('[GRAPHQL] saveQuery for a valid function', async () => {
        const query = `
            mutation SaveQuery {
    saveQuery(
        functionName: "alle IWI studenten"
        input: {
            entity: USERS
            filter: { field: orgUnit, operator: EQ, value: "IWI" }
            sort: { field: userId, direction: ASC }
        }
        orgUnitId: "675ae493d8a9043ad4d61c2c"
    ) {
        success
        message
        result {
            _id
        }
    }
}
        `;

        const { status, headers, data } = await sendGraphQLRequest(query);

        validateHeader(headers);

        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { saveQuery } = data.data!;

        expect(saveQuery).toBeDefined(); // Assuming the mutation returns `true` on success

        const { success, message, result } = saveQuery;

        expect(success).toBe(true);
        expect(message).toBe('Save operation successful.');
        expect(result).toBeDefined();
        expect(result._id).toBeDefined();

        newSavedDataId = saveQuery.result._id;
    });

    // Test 2: Get Saved Data
    test('[GRAPHQL] getSavedData for a valid ID', async () => {
        const query = `
            query GetSavedData {
                getSavedData(id: "${newSavedDataId}") {
                    functionName
                    users
                }
            }
        `;

        const { status, headers, data } = await sendGraphQLRequest(query);

        validateHeader(headers);

        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { getSavedData } = data.data!;

        expect(getSavedData.functionName).toBe('alle IWI studenten');
        expect(getSavedData.users).toContain('gyca1011');
    });

    // Test 3: Create a Duplicate Query (Expect Error)
    test('[GRAPHQL] saveQuery creates duplicate with error', async () => {
        const query = `
            mutation SaveQuery {
    saveQuery(
        functionName: "alle IWI studenten"
        input: {
            entity: USERS
            filter: { field: orgUnit, operator: EQ, value: "IWI" }
            sort: { field: userId, direction: ASC }
        }
        orgUnitId: "675ae493d8a9043ad4d61c2c"
    ) {
        success
        message
        result {
            _id
        }
    }
}

        `;

        const { status, headers, data } = await sendGraphQLRequest(query);

        validateHeader(headers);

        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeDefined();
        expect(data.data).toBeDefined();
        expect(data.data?.saveQuery).toBeNull();

        const message = data.errors ? data.errors[0].message : 'Unknown error';

        expect(message).toMatch('Fehler beim Speichern der Query');
        // expect(message).toMatch(
        //     'Eine Funktion mit diesem Namen existiert bereits (case-insensitive).',
        // );
    });

    // Test 4: Delete the Saved Query
    test('[GRAPHQL] deleteQuery for the saved function', async () => {
        const query = `
            mutation DeleteEntity {
                            deleteEntity(input: {
                                entity: MANDATES,
                                filter:
                                    {
                                        field: functionName,
                                        operator: EQ,
                                        value: "alle IWI studenten"
                                    }

                            }) {
                                success
                                message
                                affectedCount
                            }
                        }
        `;

        const { status, headers, data } = await sendGraphQLRequest(query);

        validateHeader(headers);

        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { deleteEntity } = data.data!;

        expect(deleteEntity.success).toBe(true);
        expect(deleteEntity.message).toBe('Delete operation successful.');
        expect(deleteEntity.affectedCount).toBeGreaterThan(0);
    });
});
