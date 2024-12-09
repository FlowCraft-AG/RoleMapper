/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import type { DataPayload, DataResult } from '../../src/role-mapper/model/payload/data.payload.js';
import { ENDPOINTS, EXPECTED_RESULTS, PROCESS, TEST_DATA, TEST_EMPLOYEE_1 } from '../test-data.js';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';
import { isMandate, isOrgUnit, isProcess, isRole, isUser } from '../type-guard.js';

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

    test('[REST] Erfolgreiche Abfrage für Entity USERS', async () => {
        const query = `${ENDPOINTS.USERS}/data`;

        // Anfrage ausführen
        const { status, headers, data }: AxiosResponse<DataPayload> = await client.get(query);
        const results: DataResult[] = data.datas;

        // Assertions
        validateResponse(status, headers);

        expect(results).toBeDefined();
        expect(data.totalCount).toBeGreaterThan(0);

        // Überprüfung der Self-Links
        for (const result of results) {
            expect(result._links).toBeDefined();
            expect(result._links.self.href).toContain(
                `field=_id&operator=EQ&value=${result.data._id}`,
            );
        }
    });

    test('[REST] Erfolgreiche Abfrage für Entity USERS mit Pagination', async () => {
        const query = `${ENDPOINTS.USERS}/data?limit=${TEST_DATA.PAGINATION_LIMIT}`;

        // Anfrage ausführen
        const { status, headers, data }: AxiosResponse<DataPayload> = await client.get(query);
        const results: DataResult[] = data.datas;

        // Assertions
        validateResponse(status, headers);

        expect(results).toBeDefined();
        expect(data.totalCount).toBe(TEST_DATA.PAGINATION_LIMIT);

        // Überprüfung der Self-Links
        for (const result of results) {
            expect(result._links).toBeDefined();
            expect(result._links.self.href).toContain(
                `field=_id&operator=EQ&value=${result.data._id}`,
            );
        }
    });

    test('[REST] Erfolgreiche Abfrage für Entity MANDATES', async () => {
        const query = `${ENDPOINTS.MANDATES}/data`;

        const { status, headers, data }: AxiosResponse<DataPayload> = await client.get(query);

        validateResponse(status, headers);

        expect(data).toBeDefined();
        expect(data.totalCount).toBeGreaterThan(0);
    });

    test('einen Benutzer mit userId', async () => {
        const user = TEST_EMPLOYEE_1;
        const query = `${ENDPOINTS.USERS}/data?field=userId&operator=EQ&value=${user.userId}`;

        const { status, headers, data }: AxiosResponse<DataPayload> = await client.get(query);

        // Validierung des Status und der Header
        validateResponse(status, headers);

        // Prüfen, ob Daten vorhanden sind
        expect(data).toBeDefined();
        expect(data.totalCount).toBe(1);

        // Benutzer-Daten aus der Antwort extrahieren
        const entity = data.datas[0]?.data;

        if (entity !== undefined && isUser(entity)) {
            // Benutzer-Daten prüfen
            expect(entity.userId).toBe(user.userId);
        } else {
            throw new Error('Erwarteter Benutzer, aber anderer Typ gefunden.');
        }
    });

    test('Alle Funktionen mit Benutzer userId', async () => {
        const user = TEST_EMPLOYEE_1;
        const query = `${ENDPOINTS.MANDATES}/data?field=users&operator=EQ&value=${user.userId}`;

        const { status, headers, data }: AxiosResponse<DataPayload> = await client.get(query);

        // Validierung des Status und der Header
        validateResponse(status, headers);

        // Prüfen, ob die Daten existieren
        expect(data).toBeDefined();
        expect(data.totalCount).toBeGreaterThan(0);

        // Prüfen, ob alle Mandate den Benutzer enthalten
        for (const mandate of data.datas) {
            const entity = mandate.data;

            if (isMandate(entity)) {
                expect(entity.users).toContain(user.userId);
            } else {
                throw new Error('Erwartete Funktion, aber anderer Typ gefunden.');
            }
        }
    });

    test('Alle Prozesse', async () => {
        const query = `${ENDPOINTS.PROCESSES}/data`;
        const { status, headers, data }: AxiosResponse<DataPayload> = await client.get(query);

        // Validierung des Status und der Header
        validateResponse(status, headers);

        // Überprüfen, ob die Datenstruktur vorhanden ist
        expect(data).toBeDefined();
        expect(data.totalCount).toBeGreaterThan(0);
        expect(data.datas).toBeDefined();

        // Überprüfen, ob jedes Element ein Prozess ist
        for (const process of data.datas) {
            const entity = process.data;

            if (isProcess(entity)) {
                // Beispielhafte Assertions für Prozesse
                expect(entity).toHaveProperty('processId');
                expect(typeof entity.processId).toBe('string');
                expect(entity).toHaveProperty('name');
                expect(typeof entity.name).toBe('string');
            } else {
                throw new Error('Erwarteter Prozess, aber anderer Typ gefunden.');
            }
        }
    });

    test('Prozess mit ProzessId', async () => {
        const query = `${ENDPOINTS.PROCESSES}/data?field=processId&operator=EQ&value=${PROCESS.PROCESS_1}`;

        const { status, headers, data }: AxiosResponse<DataPayload> = await client.get(query);

        // Validierung des Status und der Header
        validateResponse(status, headers);

        // Überprüfen, ob die Datenstruktur korrekt ist
        expect(data).toBeDefined();
        expect(data.totalCount).toBe(1); // Erwartung, dass genau ein Prozess zurückgegeben wird
        expect(data.datas).toBeDefined();

        const process = data.datas[0]?.data;

        // Überprüfung, ob das zurückgegebene Objekt ein Prozess ist
        if (process !== undefined && isProcess(process)) {
            expect(process.processId).toBe(PROCESS.PROCESS_1);
        }
    });

    test('Alle Rollen', async () => {
        const query = `${ENDPOINTS.ROLES}/data`;
        const { status, headers, data }: AxiosResponse<DataPayload> = await client.get(query);

        // Validierung des Status und der Header
        validateResponse(status, headers);

        // Überprüfen, ob die Datenstruktur korrekt ist
        expect(data).toBeDefined();
        expect(data.totalCount).toBeGreaterThan(0);
        expect(data.datas).toBeDefined();

        for (const roleResult of data.datas) {
            const role = roleResult.data;

            // Überprüfung, ob das zurückgegebene Objekt eine Rolle ist
            if (isRole(role)) {
                expect(role.roleId).toBeDefined();
                expect(role.name).toBeDefined();
            }
        }
    });

    test('Alle OrgUnits', async () => {
        const query = `${ENDPOINTS.ORG_UNITS}/data`;
        const { status, headers, data }: AxiosResponse<DataPayload> = await client.get(query);

        // Validierung des Status und der Header
        validateResponse(status, headers);

        // Überprüfen, ob die Datenstruktur korrekt ist
        expect(data).toBeDefined();
        expect(data.totalCount).toBe(EXPECTED_RESULTS.ORG_UNITS_COUNT); // Erwartete Anzahl der OrgUnits
        expect(data.datas).toBeDefined();

        for (const orgUnitResult of data.datas) {
            const orgUnit = orgUnitResult.data;

            // Überprüfung, ob das zurückgegebene Objekt eine OrgUnit ist
            if (isOrgUnit(orgUnit)) {
                expect(orgUnit.name).toBeDefined();
                expect(orgUnit._id).toBeDefined();
            } else {
                throw new Error('Erwartete OrgUnit, aber anderer Typ gefunden.');
            }
        }
    });
});
