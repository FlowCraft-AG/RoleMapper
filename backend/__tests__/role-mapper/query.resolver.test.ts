/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { GraphQLRequest } from '@apollo/server';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { type GraphQLFormattedError } from 'graphql';
import { type RolePayload } from '../../src/role-mapper/controller/read.controller.js';
import type { User } from '../../src/role-mapper/model/entity/user.entity.js';
import {
    ENDPOINTS,
    EXPECTED_RESULTS,
    INVALID_TEST_DATA,
    PROCESS,
    ROLES,
    TEST_EMPLOYEE_1,
    TEST_EMPLOYEE_2,
} from '../test-data.js';
import { host, httpsAgent, port, shutdownServer, startServer } from '../testserver.js';

export type GraphQLResponseBody = {
    data?: Record<string, any> | null;
    errors?: readonly [GraphQLFormattedError];
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

    test('[GRAPHQL] Rollen zum Dienstreiseantragprozess zum user 1', async () => {
        const employee = TEST_EMPLOYEE_1;
        // given
        const body: GraphQLRequest = {
            query: `
      {
              getProcessRoles(processId: "${PROCESS.PROCESS_1}", userId: "${employee.userId}") {
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
        const antragSteller = roles[0];
        const vorgesetzter = roles[1];

        expect(roles).toHaveLength(2);
        expect(antragSteller?.roleName).toMatch(ROLES.ROLE_1);
        expect(antragSteller?.users.length).toBe(1);
        expect(antragSteller?.users[0]?.userId).toMatch(employee.userId);
        expect(antragSteller?.users[0]?.functionName).toMatch(employee.functionName);

        expect(vorgesetzter?.roleName).toMatch(ROLES.ROLE_2);
        expect(vorgesetzter?.users.length).toBe(1);
        expect(vorgesetzter?.users[0]?.userId).toMatch(employee.leiter);
        expect(vorgesetzter?.users[0]?.functionName).toMatch(employee.functionNameLeiter);
    });

    test('[GRAPHQL] Rollen zum Reisekostenprozess zum user 1', async () => {
        const employee = TEST_EMPLOYEE_1;
        // given
        const body: GraphQLRequest = {
            query: `
      {
              getProcessRoles(processId: "${PROCESS.PROCESS_2}", userId: "${employee.userId}") {
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

        const { getProcessRoles } = data.data!;
        const result: RolePayload = getProcessRoles;
        const roles = result.roles;
        const rechnungsPrüfer = roles[0];
        const finanzAbteilung = roles[1];

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data).toBeDefined();
        expect(roles).toBeDefined();
        expect(roles).toHaveLength(2);
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

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();
    });

    test('[GRAPHQL] Rollen zum Dienstreiseantragprozess zum user 2', async () => {
        const employee = TEST_EMPLOYEE_2;
        // given
        const body: GraphQLRequest = {
            query: `
      {
              getProcessRoles(processId: "${PROCESS.PROCESS_1}", userId: "${employee.userId}") {
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
        const antragSteller = roles[0];
        const vorgesetzter = roles[1];

        expect(roles).toHaveLength(2);
        expect(antragSteller?.roleName).toMatch(ROLES.ROLE_1);
        expect(antragSteller?.users.length).toBe(1);
        expect(antragSteller?.users[0]?.userId).toMatch(employee.userId);
        expect(antragSteller?.users[0]?.functionName).toMatch(employee.functionName);

        expect(vorgesetzter?.roleName).toMatch(ROLES.ROLE_2);
        expect(vorgesetzter?.users.length).toBe(1);
        expect(vorgesetzter?.users[0]?.userId).toMatch(employee.leiter);
        expect(vorgesetzter?.users[0]?.functionName).toMatch(employee.functionNameLeiter);
    });
    // -----------------------------------------------------------------------------
    // Additional Tests for QueryResolver
    // -----------------------------------------------------------------------------

    test('[GRAPHQL] Dynamische Abfrage für USERS mit Filtern', async () => {
        const employee = TEST_EMPLOYEE_1;
        // given
        const body: GraphQLRequest = {
            query: `
        {
          getData(entity: ${ENDPOINTS.USERS}, filters: { field: userId, operator: EQ, value: "${employee.userId}" })
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
        expect(user!.userId).toMatch(employee.userId);
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

    test('[GRAPHQL] getProcessRoles with invalid processId', async () => {
        const employee = TEST_EMPLOYEE_1;
        // given
        const body: GraphQLRequest = {
            query: `
    {
            getProcessRoles(processId: ${INVALID_TEST_DATA.PROCESS}, userId: "${employee.userId}") {
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
        expect(status).toBe(HttpStatus.BAD_REQUEST);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeDefined();
        expect(data.data).toBeUndefined();
    });

    test('[GRAPHQL] getData with invalid filters', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
    {
        getData(entity: ${ENDPOINTS.USERS}, filters: { field: "invalidField", operator: EQ, value: "invalidValue" })
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

    test('[GRAPHQL] getData without filters', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
    {
        getData(entity: ${ENDPOINTS.ORG_UNITS})
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
        expect((getData as any[]).length).toBeGreaterThan(0);
        expect((getData as { orgUnitName: string }[])[0]).toHaveProperty('name');
    });
});
