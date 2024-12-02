import { GraphQLRequest } from '@apollo/server';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { type GraphQLFormattedError } from 'graphql';
import { type RolePayload } from '../../src/roleMapper/controller/read.controller.js';
import { User } from '../../src/roleMapper/model/entity/user.entity.js';
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
      validateStatus: (status) => status < 500, // eslint-disable-line @typescript-eslint/no-magic-numbers
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

    // then
    console.log('Response:', status, data);
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

    // then
    console.log('Response:', status, data);
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
    console.log('Response:', status, data);
    expect(status).toBe(HttpStatus.OK);
    expect(headers['content-type']).toMatch(/json/iu); // eslint-disable-line sonarjs/no-duplicate-string
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

  // -------------------------------------------------------------------------
  // Tests für ungültige Anfragen
  // -------------------------------------------------------------------------
});
