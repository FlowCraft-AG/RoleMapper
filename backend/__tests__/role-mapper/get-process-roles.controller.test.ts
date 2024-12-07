/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable sonarjs/no-duplicate-string */
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type {
    RolePayload,
    RoleResult,
} from '../../src/role-mapper/model/types/role-payload.type.js';
import {
    EXPECTED_RESULTS,
    INVALID_TEST_DATA,
    PROCESS,
    ROLES,
    TEST_EMPLOYEE_1,
    TEST_EMPLOYEE_2,
} from '../test-data.js';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
describe('get Process Roles REST', () => {
    let client: AxiosInstance;

    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => {
        await startServer();
        const baseURL = `https://${host}:${port}/roleMapper/process-roles`;
        client = axios.create({
            baseURL,
            httpsAgent,
            validateStatus: (status) => status < 500, // eslint-disable-line @typescript-eslint/no-magic-numbers
        });
    });

    afterAll(async () => {
        await shutdownServer();
    });

    // -------------------------------------------------------------------------
    // Tests für gültige Anfragen
    // -------------------------------------------------------------------------

    test('[REST] Rollen zum Dienstreiseantragprozess', async () => {
        const employee = TEST_EMPLOYEE_1;
        // given
        const query = `?processId=${PROCESS.PROCESS_1}&userId=${employee.userId}`;

        // when
        const { status, headers, data }: AxiosResponse<RolePayload> = await client.get(query);
        const roles: RoleResult[] = data.roles;
        const user = roles[0];
        const leiter = roles[1];

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(roles).toBeDefined();
        expect(roles.length).toBe(EXPECTED_RESULTS.ROLES_COUNT);

        expect(user).toBeDefined();
        expect(user?.roleName).toBe(ROLES.ROLE_1);
        expect(user?.users.length).toBe(1);
        expect(user?.users[0]?.userId).toBe(employee.userId);
        expect(user?.users[0]?.functionName).toBe(employee.functionName);

        expect(leiter).toBeDefined();
        expect(leiter?.roleName).toBe(ROLES.ROLE_2);
        expect(leiter?.users.length).toBe(1);
        expect(leiter?.users[0]?.userId).toBe(employee.leiter);
        expect(leiter?.users[0]?.functionName).toBe(employee.functionNameLeiter);
    });

    test('[REST] Rollen zum Dienstreiseantragprozess zum user rost0001', async () => {
        const employee = TEST_EMPLOYEE_2;
        // given
        const query = `?processId=${PROCESS.PROCESS_1}&userId=${employee.userId}`;

        // when
        const { status, headers, data }: AxiosResponse<RolePayload> = await client.get(query);
        const roles: RoleResult[] = data.roles;
        const user = roles[0];
        const leiter = roles[1];

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(roles).toBeDefined();
        expect(roles.length).toBe(EXPECTED_RESULTS.ROLES_COUNT);

        expect(user).toBeDefined();
        expect(user?.roleName).toBe(ROLES.ROLE_1);
        expect(user?.users.length).toBe(1);
        expect(user?.users[0]?.userId).toBe(employee.userId);
        expect(user?.users[0]?.functionName).toBe(employee.functionName);

        expect(leiter).toBeDefined();
        expect(leiter?.roleName).toBe(ROLES.ROLE_2);
        expect(leiter?.users.length).toBe(1);
        expect(leiter?.users[0]?.userId).toBe(employee.leiter);
        expect(leiter?.users[0]?.functionName).toBe(employee.functionNameLeiter);
    });

    test('[REST] Rollen zum Reisekostenprozess zum user rost0001', async () => {
        const employee = TEST_EMPLOYEE_1;
        // given
        const query = `?processId=${PROCESS.PROCESS_2}&userId=${employee.userId}`;

        // when
        const { status, headers, data }: AxiosResponse<RolePayload> = await client.get(query);
        const roles: RoleResult[] = data.roles;
        const rechnungsPrüfer = roles[0];
        const finanzAbteilung = roles[1];

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data).toBeDefined();
        expect(roles).toBeDefined();
        expect(roles.length).toBe(EXPECTED_RESULTS.ROLES_COUNT);

        expect(rechnungsPrüfer).toBeDefined();
        expect(rechnungsPrüfer?.roleName).toBe(ROLES.ROLE_3);
        expect(rechnungsPrüfer?.users.length).toBe(1);
        expect(rechnungsPrüfer?.users[0]?.userId).toBe(employee.rechnungsPrüfer);

        expect(finanzAbteilung).toBeDefined();
        expect(finanzAbteilung?.roleName).toBe(ROLES.ROLE_4);
        expect(finanzAbteilung?.users.length).toBe(employee.finanzAbteilung.length);
        expect(finanzAbteilung?.users[0]?.userId).toBe(employee.finanzAbteilung[0]);
        expect(finanzAbteilung?.users[1]?.userId).toBe(employee.finanzAbteilung[1]);
        expect(finanzAbteilung?.users[2]?.userId).toBe(employee.finanzAbteilung[2]);
        expect(finanzAbteilung?.users[3]?.userId).toBe(employee.finanzAbteilung[3]);
    });

    // -------------------------------------------------------------------------
    // Tests für ungültige Anfragen
    // -------------------------------------------------------------------------

    test('[REST] Ungültiger Prozess', async () => {
        const employee = TEST_EMPLOYEE_1;
        // given
        const url = `?processId=${INVALID_TEST_DATA.PROCESS}&userId=${employee.userId}`;

        // when
        const { status, headers, data }: AxiosResponse<RolePayload> = await client.get(url);

        // then
        expect(status).toBe(HttpStatus.NOT_FOUND);
        expect(headers['content-type']).toMatch(/json/iu);

        expect(data).toEqual({
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Not Found',
            message: `Keine Rollen für diesen Prozess gefunden. ${INVALID_TEST_DATA.PROCESS}`,
        });
    });

    test('[REST] Ungültiger User', async () => {
        // given
        const url = `?processId=${PROCESS.PROCESS_1}&userId=${INVALID_TEST_DATA.USER}`;

        // when
        const { status, headers, data }: AxiosResponse<RolePayload> = await client.get(url);

        // then
        expect(status).toBe(HttpStatus.NOT_FOUND);
        expect(headers['content-type']).toMatch(/json/iu);

        expect(data).toEqual({
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Not Found',
            message: `Keinen Benutzer gefunden mit der userId: ${INVALID_TEST_DATA.USER}`,
        });
    });
});
