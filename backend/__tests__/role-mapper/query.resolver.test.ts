/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { GraphQLRequest } from '@apollo/server';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { type GraphQLFormattedError } from 'graphql';
import { type RolePayload } from '../../src/role-mapper/controller/read.controller.js';
import { SUPPORTED_ENTITIES } from '../../src/role-mapper/model/entity/entities.entity.js';
import type { User } from '../../src/role-mapper/model/entity/user.entity.js';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';

export type GraphQLResponseBody = {
    data?: Record<string, any> | null;
    errors?: readonly [GraphQLFormattedError];
};

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------

const DIENSTREISEANTRAG = 'DA0001';
const REISEKOSTENANTRAG = 'RA0001';
const USER1 = 'muud0001';
const VORGESETZTER1 = 'nefr0002';
const USER2 = 'rost0001';
const VORGESETZTER2 = 'scgu0003';
// const UNGÜLTIGER_PROZESS = 'DA0000';
// const UNGÜLTIGER_USER = 'muud0000';

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

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
describe('get Process Roles GraphQL', () => {
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

    // -------------------------------------------------------------------------
    // Tests für gültige Anfragen
    // -------------------------------------------------------------------------

    test('[GRAPHQL] Rollen zum Dienstreiseantragprozess zum user muud0001', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
      {
              getProcessRoles(processId: "${DIENSTREISEANTRAG}", userId: "${USER1}") {
                    roles {
                        roleName
                        users {
                            userId
                            functionName
                        }
                    }
                }
    }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
        );

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu); // eslint-disable-line sonarjs/no-duplicate-string
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { getProcessRoles } = data.data!;
        const result: RolePayload = getProcessRoles;
        const roles = result.roles;
        const antragSteller = roles[0]?.users[0] as User & { functionName: string };
        const vorgesetzter = roles[1]?.users[0] as User & { functionName: string };

        expect(result.roles[0]?.roleName).toMatch('Antragssteller');
        expect(result.roles[0]?.users[0]?.userId).toMatch(USER1);
        expect(antragSteller.functionName).toMatch('Professor');
        expect(result.roles[1]?.roleName).toMatch('Vorgesetzter');
        expect(result.roles[1]?.users[0]?.userId).toMatch(VORGESETZTER1);
        expect(vorgesetzter.functionName).toMatch('Dekan IWI');
        expect(roles).toHaveLength(2);
    });

    test('[GRAPHQL] Rollen zum Dienstreiseantragprozess zum user rost0001', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
      {
              getProcessRoles(processId: "${DIENSTREISEANTRAG}", userId: "${USER2}") {
                    roles {
                        roleName
                        users {
                            userId
                            functionName
                        }
                    }
                }
    }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
        );

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { getProcessRoles } = data.data!;
        const result: RolePayload = getProcessRoles;
        const roles = result.roles;
        const antragSteller = roles[0]?.users[0] as User & { functionName: string };
        const vorgesetzter = roles[1]?.users[0] as User & { functionName: string };

        expect(result.roles[0]?.roleName).toMatch('Antragssteller');
        expect(result.roles[0]?.users[0]?.userId).toMatch(USER2);
        expect(antragSteller.functionName).toMatch('Mitarbeiter Rechenzentrum');
        expect(result.roles[1]?.roleName).toMatch('Vorgesetzter');
        expect(result.roles[1]?.users[0]?.userId).toMatch(VORGESETZTER2);
        expect(vorgesetzter.functionName).toMatch('Leitung Rechenzentrum');
        expect(roles).toHaveLength(2);
    });

    test('[GRAPHQL] Rollen zum Reisekostenprozess zum user rost0001', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
      {
              getProcessRoles(processId: "${REISEKOSTENANTRAG}", userId: "${USER2}") {
                    roles {
                        roleName
                        users {
                            userId
                            functionName
                        }
                    }
                }
    }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
        );

        // then

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { getProcessRoles } = data.data!;
        const result: RolePayload = getProcessRoles;
        const roles = result.roles;

        expect(roles[0]?.roleName).toMatch('Rechnungsprüfung');
        expect(roles[1]?.roleName).toMatch('Finanzabteilung');
        expect(roles).toHaveLength(2);
        expect(roles[1]?.users).toHaveLength(4);
    });
    // -----------------------------------------------------------------------------
    // Additional Tests for QueryResolver
    // -----------------------------------------------------------------------------

    test('[GRAPHQL] Dynamische Abfrage für USERS mit Filtern', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
        {
          getData(entity: ${ENDPOINTS.USERS}, filters: { field: userId, operator: EQ, value: "${TEST_DATA.USER_ID}" })
        }
        `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
        );

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { getData } = data.data!;
        const user: User | undefined = (getData as User[])[0];

        expect(getData).toBeInstanceOf(Array);
        expect((getData as User[]).length).toBe(1);
        expect((getData as User[])[0]).toHaveProperty('userId');
        expect(user).toBeDefined();
        expect(user!.userId).toMatch(TEST_DATA.USER_ID);
    });

    test('[GRAPHQL] Dynamische Abfrage für FUNCTIONS ohne Filter', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
        {
          getData(entity: ${ENDPOINTS.FUNCTIONS})
        }
        `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
        );

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { getData } = data.data!;

        expect(getData).toBeInstanceOf(Array);
        expect((getData as any[]).length).toBeGreaterThan(5);
        expect((getData as { functionName: string }[])[0]).toHaveProperty('functionName');
    });

    // -------------------------------------------------------------------------
    // Tests für ungültige Anfragen
    // -------------------------------------------------------------------------

    test('[GRAPHQL] Fehlerhafte Abfrage für nicht unterstützte Entität', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
        {
          getData(entity: INVALID_ENTITY) {
            key
            value
          }
        }
        `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> = await client.post(
            graphqlPath,
            body,
        );

        // then
        expect(status).toBe(HttpStatus.BAD_REQUEST);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeDefined();
        expect(data.data).toBeUndefined();
    });
});
