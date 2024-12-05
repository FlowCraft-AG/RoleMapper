
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { type Request } from 'express';
import { ReadController } from '../src/role-mapper/controller/read.controller.js';
import { ReadService } from '../src/role-mapper/service/read.service.js';

// Mock für ReadService
jest.mock('../service/read.service');
jest.mock('../../logger/logger');
jest.mock('../utils/uri-helper');

describe('ReadController', () => {
    let controller: ReadController;
    let service: ReadService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReadController],
            providers: [ReadService],
        }).compile();

        controller = module.get<ReadController>(ReadController);
        service = module.get<ReadService>(ReadService);
    });

    describe('getProcessRoles', () => {
        it('sollte die Rollen eines Prozesses zurückgeben', async () => {
            const processId = 'DA0001';
            const userId = 'rost0001';
            const mockResponse = {
                roles: [
                    {
                        roleName: 'Antragssteller',
                        users: [
                            {
                                functionName: 'Mitarbeiter Rechenzentrum',
                                _id: '673ede38e1746bf8e6aa1b2c',
                                userId: 'rost0001',
                                userType: 'employee',
                                userRole: 'adminTechnicalStaff',
                                orgUnit: 'A0012',
                                active: true,
                                validFrom: '2019-11-01T00:00:00.000Z',
                                validUntil: '2100-12-31T23:59:59.000Z',
                                employee: {
                                    costCenter: 'A0012',
                                    department: 'Rechenzentrum',
                                },
                            },
                        ],
                    },
                    {
                        roleName: 'Vorgesetzter',
                        users: [
                            {
                                functionName: 'Leitung Rechenzentrum',
                                _id: '673ede38e1746bf8e6aa1b26',
                                userId: 'scgu0003',
                                userType: 'employee',
                                userRole: 'academicStaff',
                                orgUnit: 'A0012',
                                active: true,
                                validFrom: '2012-01-01T00:00:00.000Z',
                                validUntil: '2100-12-31T23:59:59.000Z',
                                employee: {
                                    costCenter: 'A0012',
                                    department: 'Rechenzentrum',
                                },
                            },
                        ],
                    },
                ],
                _links: {
                    self: {
                        href: 'https://localhost:3000/roleMapper/process-roles?processId=DA0001&userId=rost0001',
                    },
                    antragssteller: {
                        rost0001: {
                            href: 'https://localhost:3000/roleMapper/USERS/data?field=userId&operator=EQ&value=rost0001',
                        },
                    },
                    vorgesetzter: {
                        scgu0003: {
                            href: 'https://localhost:3000/roleMapper/USERS/data?field=userId&operator=EQ&value=scgu0003',
                        },
                    },
                },
            };

            // Mocking der findProcessRoles Methode
            jest.spyOn(service, 'findProcessRoles').mockResolvedValue(mockResponse);

            const result = await controller.getProcessRoles(processId, userId, {} as Request);

            expect(result).toEqual(mockResponse);
            expect(() => service.findProcessRoles).toHaveBeenCalledWith(processId, userId);
        });

        it('sollte eine BadRequestException werfen, wenn die Parameter ungültig sind', async () => {
            const processId = 'DA0001';
            const userId = ''; // Ungültiger UserId

            await expect(
                controller.getProcessRoles(processId, userId, {} as Request)
            ).rejects.toThrow(BadRequestException);
        });
        });
    });

    describe('getData', () => {
        let service: ReadService;

        beforeEach(() => {
            service = new ReadService(
                module.get('InjectModel(User.name)'),
                module.get('InjectModel(Role.name)'),
                module.get('InjectModel(Process.name)'),
                module.get('InjectModel(Function.name)'),
                module.get('InjectModel(OrgUnit.name)')
            );
        });

        it('sollte gefilterte Daten zurückgeben', async () => {
            const collection = 'USERS';
            const filter = { userId: 'DA0001' };
            const mockData = [
                {
                    _id: '6740a584f3e876cdd20d8654',
                    functionName: 'Dekan IWI',
                    type: 'dekan',
                    orgUnit: '6745da29a586857aa17d76d0',
                    users: ['nefr0002'],
                },
            ];

            // Mocking der findData Methode
            jest.spyOn(service, 'findData').mockResolvedValue(mockData);

            const result = await controller.getData(collection, filter);

            expect(result).toEqual(mockData);
            expect(service.findData).toHaveBeenCalledWith(collection, filter);
        });

        it('sollte eine BadRequestException werfen, wenn die Entität nicht unterstützt wird', async () => {
            const collection = 'INVALID_COLLECTION';
            const filter = {};

            await expect(controller.getData(collection, filter)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('validateEntity', () => {
        it('sollte eine BadRequestException werfen, wenn die Entität nicht unterstützt wird', () => {
            const collection = 'INVALID_COLLECTION';

            expect(() => controller.validateEntity(collection)).toThrow(BadRequestException);
        });

        it('sollte keine Exception werfen, wenn die Entität unterstützt wird', () => {
            const collection = 'USERS';

            expect(() => controller.validateEntity(collection)).not.toThrow();
        });
    });

    describe('#createHateoasLinks', () => {
        it('sollte die richtigen HATEOAS-Links für ein RolePayload erstellen', () => {
            const baseUri = 'http://localhost:3000';
            const processId = 'DA0001';
            const userId = 'muud0001';
            const rolePayload = {
                roles: [
                    {
                        roleName: 'Antragssteller',
                        users: [{ userId: 'DA0001', name: 'Max Mustermann' }],
                    },
                ],
            };

            const result = controller['#createHateoasLinks'](
                baseUri,
                rolePayload,
                processId,
                userId,
            );

            expect(result).toHaveProperty(
                'self.href',
                `${baseUri}/process-roles?processId=DA0001&userId=muud0001`,
            );
            expect(result.antragssteller).toHaveProperty(
                'DA0001.href',
                `${baseUri}/USERS/data?field=userId&operator=EQ&value=DA0001`,
            );
        });
    });
});
