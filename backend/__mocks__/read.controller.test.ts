/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/dot-notation */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import type { Request } from 'express';
import { ReadController } from '../src/role-mapper/controller/read.controller.js';
import type { FilterInputDTO } from '../src/role-mapper/model/dto/filter.dto.js';
import type { User } from '../src/role-mapper/model/entity/user.entity.js';
import { ReadService } from '../src/role-mapper/service/read.service.js';

describe('ReadController', () => {
    let controller: ReadController;
    let service: ReadService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReadController],
            providers: [
                {
                    provide: ReadService,
                    useValue: {
                        findProcessRoles: jest.fn(),
                        findData: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ReadController>(ReadController);
        service = module.get<ReadService>(ReadService);
    });

    describe('getProcessRoles', () => {
        it('should return role payload with HATEOAS links', async () => {
            const processId = 'DA0001';
            const userId = 'muud0001';
            const request = {
                protocol: 'https',
                hostname: 'localhost',
                url: '/roleMapper',
            } as unknown as Request;
            const rolePayload = {
                roles: [
                    {
                        roleName: 'Antragssteller',
                        users: [
                            {
                                functionName: 'Professor',
                                _id: '673ede38e1746bf8e6aa1adf',
                                userId: 'muud0001',
                                userType: 'employee',
                                userRole: 'professor',
                                orgUnit: 'A0004',
                                active: true,
                                validFrom: new Date('1998-04-01T00:00:00.000Z'),
                                validUntil: new Date('2100-12-31T00:00:00.000Z'),
                                employee: {
                                    costCenter: 'A0004',
                                    department: 'Fakultät für Informatik und Wirtschaftsinformatik',
                                },
                            } as User & { functionName: string },
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
                            } as unknown as User & { functionName: string },
                        ],
                    },
                ],
                _links: {
                    self: {
                        href: 'https://localhost:3000/roleMapper/process-roles?processId=DA0001&userId=muud0001',
                    },
                    antragssteller: {
                        muud0001: {
                            href: 'https://localhost:3000/roleMapper/USERS/data?field=userId&operator=EQ&value=muud0001',
                        },
                    },
                    vorgesetzter: {
                        nefr0002: {
                            href: 'https://localhost:3000/roleMapper/USERS/data?field=userId&operator=EQ&value=nefr0002',
                        },
                    },
                },
            };
            jest.spyOn(service, 'findProcessRoles').mockResolvedValue(rolePayload);

            const result = await controller.getProcessRoles(processId, userId, request);

            expect(result).toEqual({
                ...rolePayload,
                _links: {
                    self: {
                        href: 'https://localhost:3000/roleMapper/process-roles?processId=DA0001&userId=muud0001',
                    },
                    antragssteller: {
                        muud0001: {
                            href: 'https://localhost:3000/roleMapper/USERS/data?field=userId&operator=EQ&value=muud0001',
                        },
                    },
                    vorgesetzter: {
                        nefr0002: {
                            href: 'https://localhost:3000/roleMapper/USERS/data?field=userId&operator=EQ&value=nefr0002',
                        },
                    },
                },
            });
        });
    });

    describe('getData', () => {
        it('should return filtered data', async () => {
            const collection = 'USERS';
            const filter: FilterInputDTO = { field: 'name', operator: 'EQ', value: 'Max' };
            const data = [{ _id: '1', name: 'Max' }];
            jest.spyOn(service, 'findData').mockResolvedValue(data);

            const result = await controller.getData(collection, filter);

            expect(result).toEqual(data);
        });

        it('should throw BadRequestException for unsupported entity', async () => {
            const collection = 'UNSUPPORTED';
            const filter: FilterInputDTO = { field: 'name', operator: 'EQ', value: 'Max' };

            await expect(controller.getData(collection, filter)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('validateEntity', () => {
        it('should throw BadRequestException for unsupported entity', () => {
            expect(() => controller['validateEntity']('UNSUPPORTED')).toThrow(BadRequestException);
        });

        it('should not throw for supported entity', () => {
            expect(() => controller['validateEntity']('USERS')).not.toThrow();
        });
    });
});
