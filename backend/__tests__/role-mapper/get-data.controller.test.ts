/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/naming-convention */
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import type { Function } from '../../src/role-mapper/model/entity/function.entity.js';
import type { Process } from '../../src/role-mapper/model/entity/process.entity.js';
import { ENDPOINTS, EXPECTED_RESULTS, PROCESS, TEST_EMPLOYEE_1 } from '../test-data.js';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';

// -----------------------------------------------------------------------------
// Helper-Funktionen
// -----------------------------------------------------------------------------

/**
 * Prüft, ob die Antwort korrekt ist und der Content-Type JSON ist.
 * @param status - HTTP-Statuscode
 * @param headers - HTTP-Header
 */
const validateResponse = (status: number, headers: any) => {
    expect(status).toBe(HttpStatus.OK);
    expect(headers['content-type']).toMatch(/json/iu);
};

// -----------------------------------------------------------------------------
// Test Suite
// -----------------------------------------------------------------------------
describe('RoleMapper API: get Data', () => {
    let client: AxiosInstance;

    beforeAll(async () => {
        await startServer();
        const baseURL = `https://${host}:${port}/roleMapper/`;
        client = axios.create({
            baseURL,
            httpsAgent,
            validateStatus: (status) => status < 500,
        });
    });

    afterAll(async () => {
        await shutdownServer();
    });

    test('Alle Benutzer', async () => {
        const { status, headers, data }: AxiosResponse<any[]> = await client.get(
            `${ENDPOINTS.USERS}/data`,
        );

        validateResponse(status, headers);

        expect(data).toBeDefined();
        expect(data.length).toBe(EXPECTED_RESULTS.USERS_COUNT);
    });

    test('einen Benutzer mit userId', async () => {
        const user = TEST_EMPLOYEE_1;
        const { status, headers, data }: AxiosResponse<any[]> = await client.get(
            `${ENDPOINTS.USERS}/data?field=userId&operator=EQ&value=${user.userId}`,
        );

        validateResponse(status, headers);

        expect(data).toBeDefined();
        expect(data.length).toBe(1);
        expect(data[0].userId).toBe(user.userId);
    });

    test('Alle Funktionen mit Benutzer userId', async () => {
        const user = TEST_EMPLOYEE_1;
        const { status, headers, data }: AxiosResponse<Function[]> = await client.get(
            `${ENDPOINTS.FUNCTIONS}/data?field=users&operator=EQ&value=${user.userId}`,
        );

        validateResponse(status, headers);

        expect(data).toBeDefined();

        for (const function_ of data) {
            expect(function_.users).toContain(user.userId);
        }
    });

    test('Alle Prozesse', async () => {
        const { status, headers, data }: AxiosResponse<any[]> = await client.get(
            `${ENDPOINTS.PROCESSES}/data`,
        );

        validateResponse(status, headers);

        expect(data).toBeDefined();
        expect(data.length).toBe(EXPECTED_RESULTS.PROCESSES_COUNT);
    });

    test('Prozess mit ProzessId', async () => {
        const { status, headers, data }: AxiosResponse<Process[]> = await client.get(
            `${ENDPOINTS.PROCESSES}/data?field=processId&operator=EQ&value=${PROCESS.PROCESS_1}`,
        );

        validateResponse(status, headers);

        expect(data).toBeDefined();
        expect(data[0]?.processId).toBe(PROCESS.PROCESS_1);
    });

    test('Alle Rollen', async () => {
        const { status, headers, data }: AxiosResponse<any[]> = await client.get(
            `${ENDPOINTS.ROLES}/data`,
        );

        validateResponse(status, headers);

        expect(data).toBeDefined();
        expect(data.length).toBe(EXPECTED_RESULTS.ROLE_COUNT);
    });

    test('Alle OrgUnits', async () => {
        const { status, headers, data }: AxiosResponse<any[]> = await client.get(
            `${ENDPOINTS.ORG_UNITS}/data`,
        );

        validateResponse(status, headers);

        expect(data).toBeDefined();
        expect(data.length).toBe(EXPECTED_RESULTS.ORG_UNITS_COUNT);
    });
});
