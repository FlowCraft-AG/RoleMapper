/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance } from 'axios';
import { sendGraphQLRequest } from '../graphql-helper.js';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';

/**
 * Prüft, ob die Antwort korrekt ist und der Content-Type JSON ist.
 * @param headers - HTTP-Header
 */
const validateHeader = (headers: any) => {
    expect(headers['content-type']).toMatch(/json/iu);
};

describe('MutationResolver', () => {
    let client: AxiosInstance;
    const invalidProcessKey = 'invalidKey';
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

    test('[CAMUNDA] Starte ungültigen Prozess', async () => {
        const query = `
            mutation {
                startProcess(processKey: "${invalidProcessKey}", userId: "${validUserId}") {
                    success
                    message
                    response {
                        processInstanceKey
                    }
                }
            }
        `;
        const { status, headers, data } = await sendGraphQLRequest(client, query);

        validateHeader(headers);
        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeDefined();
        expect(data.data).toBeNull();
    });

    test('[CAMUNDA] Starte gültigen Prozess', async () => {
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
        expect(data.data).toBeDefined();

        const { startProcess } = data.data!;
        expect(startProcess.success).toBe(true);
        expect(startProcess.response.processInstanceKey).toBeDefined();
        expect(startProcess.response.bpmnProcessId).toBe(validProcessKey);
    });

    test('[CAMUNDA] Schließe gültige Aufgabe ab', async () => {
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
        expect(data.data).toBeDefined();

        const { completeUserTask } = data.data!;
        expect(completeUserTask.id).toBe(testTaskId);
        expect(completeUserTask.taskState).toBe('COMPLETED');
    });

    test('[CAMUNDA] Schließe Aufgabe mit ungültiger ID ab', async () => {
        const query = `
            mutation {
                completeUserTask(taskId: "invalidTask", variables: { approved: false }) {
                    id
                    name
                    taskState
                }
            }
        `;
        const { status, headers, data } = await sendGraphQLRequest(client, query);

        validateHeader(headers);
        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeDefined();
        expect(data.data).toBeNull();
    });

    test('[CAMUNDA] Breche Prozessinstanz ab', async () => {
        const processInstanceKey = 'validInstanceKey';
        const query = `
            mutation {
                cancelProcessInstance(processInstanceKey: "${processInstanceKey}")
            }
        `;
        const { status, headers, data } = await sendGraphQLRequest(client, query);

        validateHeader(headers);
        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeUndefined();
        expect(data.data.cancelProcessInstance).toBe(
            `Process instance cancelled: ${processInstanceKey}`,
        );
    });

    test('[CAMUNDA] Breche nicht vorhandene Prozessinstanz ab', async () => {
        const processInstanceKey = 'nonExistingKey';
        const query = `
            mutation {
                cancelProcessInstance(processInstanceKey: "${processInstanceKey}")
            }
        `;
        const { status, headers, data } = await sendGraphQLRequest(client, query);

        validateHeader(headers);
        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeDefined();
        expect(data.data).toBeNull();
    });

    test('[CAMUNDA] Lösche Prozessinstanz', async () => {
        const processInstanceKey = 'validInstanceKey';
        const query = `
            mutation {
                deleteProcessInstance(processInstanceKey: "${processInstanceKey}")
            }
        `;
        const { status, headers, data } = await sendGraphQLRequest(client, query);

        validateHeader(headers);
        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeUndefined();
        expect(data.data.deleteProcessInstance).toBe(
            `Process instance deleted: ${processInstanceKey}`,
        );
    });

    test('[CAMUNDA] Lösche nicht vorhandene Prozessinstanz', async () => {
        const processInstanceKey = 'nonExistingKey';
        const query = `
            mutation {
                deleteProcessInstance(processInstanceKey: "${processInstanceKey}")
            }
        `;
        const { status, headers, data } = await sendGraphQLRequest(client, query);

        validateHeader(headers);
        expect(status).toBe(HttpStatus.OK);
        expect(data.errors).toBeDefined();
        expect(data.data).toBeNull();
    });
});
