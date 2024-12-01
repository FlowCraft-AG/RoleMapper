import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

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
