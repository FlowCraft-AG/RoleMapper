/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance } from 'axios';
import type { GraphQLResponseBody } from '../graphql-helper.js';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';

const validateHeader = (headers: any) => {
    expect(headers['content-type']).toMatch(/json/iu);
};

const sendGraphQLRequest = async (client: AxiosInstance, query: string) => {
    try {
        return await client.post<GraphQLResponseBody>('graphql', { query });
    } catch (error) {
        throw new Error(`GraphQL request failed: ${(error as Error).message}`);
    }
};

describe('Camunda Mutation Snapshots', () => {
    let client: AxiosInstance;
    const validProcessKey = 'testProcess';
    const validUserId = 'testUser';
    const testTaskId = 'testTask';

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

    test('[CAMUNDA] Starte gültigen Prozess (Snapshot)', async () => {
        const query = `
            mutation {
                startProcess(processKey: "${validProcessKey}", userId: "${validUserId}") {
                    success
                    message
                    response {
                        processInstanceKey
                        processDefinitionKey
                        bpmnProcessId
                    }
                }
            }
        `;
        const { status, headers, data } = await sendGraphQLRequest(client, query);

        validateHeader(headers);

        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeUndefined();

        // Snapshot-Test
        expect(data).toMatchSnapshot();
    });

    test('[CAMUNDA] Schließe Aufgabe ab (Snapshot)', async () => {
        const query = `
            mutation {
                completeUserTask(taskId: "${testTaskId}", variables: { approved: true }) {
                    id
                    name
                    taskState
                }
            }
        `;
        const { status, headers, data } = await sendGraphQLRequest(client, query);

        validateHeader(headers);

        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeUndefined();

        // Snapshot-Test
        expect(data).toMatchSnapshot();
    });
});
