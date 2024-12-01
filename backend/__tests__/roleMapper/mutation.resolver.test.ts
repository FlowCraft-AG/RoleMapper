import { type GraphQLRequest } from '@apollo/server';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { type GraphQLFormattedError } from 'graphql';
import { type Bankkonto } from '../../src/bankkonto/model/entity/bankkonto.entity.js';
import {
  host,
  httpsAgent,
  port,
  shutdownServer,
  startServer,
} from '../testserver.js';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';


export type GraphQLResponseBody = {
  data?: Record<string, any> | null;
  errors?: readonly [GraphQLFormattedError];
};


// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const bankkontoIdVorhanden = '1';

const emailVorhanden = 'max@example.com';
const teilEmailVorhanden = 'a';
const teilEmailNichtVorhanden = 'ZZZ';


// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
describe('GraphQL Queries', () => {
  let client: AxiosInstance;
  const graphqlPath = 'graphql';

  // Testserver starten und dabei mit der DB verbinden
  beforeAll(async () => {
    await startServer();
    const baseURL = `https://${host}:${port}/`;
    client = axios.create({
      baseURL,
      httpsAgent,
      // auch Statuscode 400 als gueltigen Request akzeptieren, wenn z.B.
      // ein Enum mit einem falschen String getestest wird
      validateStatus: () => true,
    });
  });

  afterAll(async () => {
    await shutdownServer();
  });

  test('Bankkonto zu vorhandener ID', async () => {
    // given
    const body: GraphQLRequest = {
      query: `
                {
                    bankkonto(bankkontoId: "${bankkontoIdVorhanden}") {
                    version
                    saldo
                    transaktionLimit
                    waehrungen
                    erstelltAm
                    aktualisiertAm
                    kunde {
                        kundeId
                        name
                        vorname
                        email
                        }
                    }
                }
            `,
    };

    // when
    const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
      await client.post(graphqlPath, body);

    // then
    expect(status).toBe(HttpStatus.OK);
    expect(headers['content-type']).toMatch(/json/iu); // eslint-disable-line sonarjs/no-duplicate-string
    expect(data.errors).toBeUndefined();
    expect(data.data).toBeDefined();

    const { bankkonto } = data.data!;
    const result: BankkontoDTO = bankkonto;

    expect(result.kunde?.name).toMatch(/^\w/u);
    expect(result.version).toBeGreaterThan(-1);
    expect(result.bankkontoId).toBeUndefined();
  });
});


describe('MutationResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new entity', async () => {
    const createMutation = `
      mutation {
        executeMutation(input: {
          entity: "USERS",
          operation: "CREATE",
          data: { userId: "testuser", userType: "admin", userRole: "admin", orgUnit: "IT", active: true, validFrom: "2023-01-01", validUntil: "2023-12-31" }
        }) {
          success
          message
          result {
            userId
            userType
            userRole
            orgUnit
            active
            validFrom
            validUntil
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createMutation });

    expect(response.body.data.executeMutation.success).toBe(true);
    expect(response.body.data.executeMutation.result.userId).toBe('testuser');
  });

  it('should update an existing entity', async () => {
    const updateMutation = `
      mutation {
        executeMutation(input: {
          entity: "USERS",
          operation: "UPDATE",
          filter: { field: "userId", operator: "=", value: "testuser" },
          data: { userRole: "superadmin" }
        }) {
          success
          message
          result {
            userId
            userRole
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: updateMutation });

    expect(response.body.data.executeMutation.success).toBe(true);
    expect(response.body.data.executeMutation.result.userRole).toBe('superadmin');
  });

  it('should delete an existing entity', async () => {
    const deleteMutation = `
      mutation {
        executeMutation(input: {
          entity: "USERS",
          operation: "DELETE",
          filter: { field: "userId", operator: "=", value: "testuser" }
        }) {
          success
          message
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: deleteMutation });

    expect(response.body.data.executeMutation.success).toBe(true);
  });
});
