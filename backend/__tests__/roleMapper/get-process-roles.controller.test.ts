import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { type RolePayload } from '../../src/roleMapper/controller/read.controller.js';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------

let baseURI: string = '';
const DIENSTREISEANTRAG = 'DA0001';
const REISEKOSTENANTRAG = 'RA0001';
const USER1 = 'muud0001';
const USER2 = 'rost0001';
const UNGÜLTIGER_PROZESS = 'DA0000';
const UNGÜLTIGER_USER = 'muud0000';

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
describe('get Process Roles', () => {
    let client: AxiosInstance;

    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => {
        await startServer();
        baseURI = `https://${host}:${port}/roleMapper`;
        const baseURL = `${baseURI}/process-roles`;
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

    test('Rollen zum Dienstreiseantragprozess zum user muud0001', async () => {
        // given
        const query = `?processId=${DIENSTREISEANTRAG}&userId=${USER1}`;

        // when
        const { status, headers, data }: AxiosResponse<RolePayload> = await client.get(query);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);

        expect(data.roles).toEqual([
                {
                    roleName: 'Antragssteller',
                    users: [
                        {
                            functionName: 'Professor',
                            _id: '673ede38e1746bf8e6aa1adf',
                            userId: `${USER1}`,
                            userType: 'employee',
                            userRole: 'professor',
                            orgUnit: 'A0004',
                            active: true,
                            validFrom: '1998-04-01T00:00:00.000Z',
                            validUntil: '2100-12-31T00:00:00.000Z',
                            employee: {
                                costCenter: 'A0004',
                                department: 'Fakultät für Informatik und Wirtschaftsinformatik',
                            },
                        },
                    ],
                },
                {
                    roleName: 'Vorgesetzter',
                    users: [
                        {
                            functionName: 'Dekan IWI',
                            _id: '673ede38e1746bf8e6aa1ade',
                            userId: 'nefr0002',
                            userType: 'employee',
                            userRole: 'professor',
                            orgUnit: 'A0004',
                            active: true,
                            validFrom: '1995-09-01T00:00:00.000Z',
                            validUntil: '2100-12-31T00:00:00.000Z',
                            employee: {
                                costCenter: 'A0004',
                                department: 'Fakultät für Informatik und Wirtschaftsinformatik',
                            },
                        },
                    ],
                },
            ],
        );
    });

    test('Rollen zum Dienstreiseantragprozess zum user rost0001', async () => {
        // given
        const url = `?processId=${DIENSTREISEANTRAG}&userId=${USER2}`;

        // when
        const { status, headers, data }: AxiosResponse<RolePayload> = await client.get(url);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data).toBeDefined();

        expect(data.roles[0]?.roleName).toEqual('Antragssteller');
        expect(data.roles[0]?.users[0]?.userId).toEqual(USER2);
        expect(data.roles[1]?.users[0]?.userId).toEqual('scgu0003');
        expect(data.roles[1]?.roleName).toEqual('Vorgesetzter');
    });

  test('Rollen zum Reisekostenprozess zum user rost0001', async () => {
    // given
    const query = `?processId=${REISEKOSTENANTRAG}&userId=${USER2}`;

    // when
    const { status, headers, data }: AxiosResponse<RolePayload> = await client.get(query);

    // then
    expect(status).toBe(HttpStatus.OK);
    expect(headers['content-type']).toMatch(/json/iu);

    expect(data.roles).toEqual([
      {
        roleName: 'Rechnungsprüfung',
        users: [
          {
            functionName: 'Leitung (Finanzen)',
            _id: '673ede38e1746bf8e6aa1b35',
            userId: 'kodo0001',
            userType: 'employee',
            userRole: 'adminTechnicalStaff',
            orgUnit: 'A0021',
            active: true,
            validFrom: '2010-03-01T00:00:00.000Z',
            validUntil: '2100-12-31T23:59:59.000Z',
            employee: {
              costCenter: 'A0021',
              department: 'Hochschulverwaltung',
            },
          },
        ],
      },
      {
        roleName: 'Finanzabteilung',
        users: [
          {
            functionName: 'Leitung (Finanzen)',
            _id: '673ede38e1746bf8e6aa1b31',
            userId: 'scdo0001',
            userType: 'employee',
            userRole: 'adminTechnicalStaff',
            orgUnit: 'A0021',
            active: true,
            validFrom: '2022-07-12T00:00:00.000Z',
            validUntil: '2100-12-31T00:00:00.000Z',
            employee: {
              costCenter: 'A0021',
              department: 'Hochschulverwaltung',
            },
          },
          {
            functionName: 'Leitung (Finanzen)',
            _id: '673ede38e1746bf8e6aa1b35',
            userId: 'kodo0001',
            userType: 'employee',
            userRole: 'adminTechnicalStaff',
            orgUnit: 'A0021',
            active: true,
            validFrom: '2010-03-01T00:00:00.000Z',
            validUntil: '2100-12-31T23:59:59.000Z',
            employee: {
              costCenter: 'A0021',
              department: 'Hochschulverwaltung',
            },
          },
          {
            functionName: 'Mitarbeiter (Finanzen)',
            _id: '673ede38e1746bf8e6aa1b37',
            userId: 'dita0001',
            userType: 'employee',
            userRole: 'adminTechnicalStaff',
            orgUnit: 'A0021',
            active: true,
            validFrom: '2008-09-01T00:00:00.000Z',
            validUntil: '2025-12-31T23:59:59.000Z',
            employee: {
              costCenter: 'A0021',
              department: 'Hochschulverwaltung',
            },
          },
          {
            functionName: 'Mitarbeiter (Finanzen)',
            _id: '673ede38e1746bf8e6aa1b34',
            userId: 'bola0001',
            userType: 'employee',
            userRole: 'phdStudent',
            orgUnit: 'A0021',
            active: true,
            validFrom: '2021-01-20T00:00:00.000Z',
            validUntil: '2026-12-31T22:59:59.000Z',
            employee: {
              costCenter: 'A0021',
              department: 'Hochschulverwaltung',
            },
          },
        ],
      },
    ]);
  });

    // -------------------------------------------------------------------------
    // Tests für ungültige Anfragen
    // -------------------------------------------------------------------------

    test('Ungültiger Prozess', async () => {
        // given
        const url = `?processId=${UNGÜLTIGER_PROZESS}&userId=${USER1}`;

        // when
        const { status, headers, data }: AxiosResponse<RolePayload> = await client.get(url);

        // then
        expect(status).toBe(HttpStatus.NOT_FOUND);
        expect(headers['content-type']).toMatch(/json/iu);

        expect(data).toEqual({
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Not Found',
            message: `Keine Rollen für diesen Prozess gefunden. ${UNGÜLTIGER_PROZESS}`,
        });
    });

    test('Ungültiger User', async () => {
        // given
        const url = `?processId=${DIENSTREISEANTRAG}&userId=${UNGÜLTIGER_USER}`;

        // when
        const { status, headers, data }: AxiosResponse<RolePayload> = await client.get(url);

        // then
        expect(status).toBe(HttpStatus.NOT_FOUND);
        expect(headers['content-type']).toMatch(/json/iu);

        expect(data).toEqual({
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Not Found',
            message: `Keinen Benutzer gefunden mit der userId: ${UNGÜLTIGER_USER}`,
        });
    });
});
