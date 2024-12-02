import { afterAll, beforeAll, describe, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import { SUPPORTED_ENTITIES } from '../../src/roleMapper/model/entity/entities.entity.js';
import type { Function } from '../../src/roleMapper/model/entity/function.entity.js';
import type { Process } from '../../src/roleMapper/model/entity/process.entity.js';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';

// -----------------------------------------------------------------------------
// Testdaten
// -----------------------------------------------------------------------------

const ENDPOINTS = {
    USERS: `${SUPPORTED_ENTITIES[0]}`,
    FUNCTIONS: `${SUPPORTED_ENTITIES[1]}`,
    PROCESSES: `${SUPPORTED_ENTITIES[2]}`,
    ROLES: `${SUPPORTED_ENTITIES[3]}`,
    ORG_UNITS: `${SUPPORTED_ENTITIES[4]}`,
};

const TEST_DATA = {
    USER_ID: 'gyca1011',
    EMPLOYEE_ID: 'rost0001',
    PROCESS_ID: 'DA0001',
};

const EXPECTED_RESULTS = {
    USERS_COUNT: 390,
    FUNCTIONS_COUNT: 11,
    PROCESSES_COUNT: 2,
    ROLES_COUNT: 4,
    ORG_UNITS_COUNT: 10,
};

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

    test('Benutzer mit userId gyca1011', async () => {
        const { status, headers, data }: AxiosResponse<any[]> = await client.get(
            `${ENDPOINTS.USERS}/data?field=userId&operator=EQ&value=${TEST_DATA.USER_ID}`,
        );

        validateResponse(status, headers);

        expect(data).toBeDefined();
        expect(data.length).toBe(1);
        expect(data[0].userId).toBe(TEST_DATA.USER_ID);
    });

    test('Alle Funktionen mit Benutzer rost0001', async () => {
        const { status, headers, data }: AxiosResponse<Function[]> = await client.get(
            `${ENDPOINTS.FUNCTIONS}/data?field=users&operator=EQ&value=${TEST_DATA.EMPLOYEE_ID}`,
        );

        validateResponse(status, headers);

        expect(data).toBeDefined();

        for (const function_ of data) {
            expect(function_.users).toContain(TEST_DATA.EMPLOYEE_ID);
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

    test('Prozess mit ID DA0001', async () => {
        const { status, headers, data }: AxiosResponse<Process[]> = await client.get(
            `${ENDPOINTS.PROCESSES}/data?field=processId&operator=EQ&value=${TEST_DATA.PROCESS_ID}`,
        );

        validateResponse(status, headers);

        expect(data).toBeDefined();
        expect(data[0]?.processId).toBe(TEST_DATA.PROCESS_ID);
    });

    test('Alle Rollen', async () => {
        const { status, headers, data }: AxiosResponse<any[]> = await client.get(
            `${ENDPOINTS.ROLES}/data`,
        );

        validateResponse(status, headers);

        expect(data).toBeDefined();
        expect(data.length).toBe(EXPECTED_RESULTS.ROLES_COUNT);
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
