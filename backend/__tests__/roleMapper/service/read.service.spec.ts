import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ReadService } from '../../../src/roleMapper/service/read.service';

describe('ReadService', () => {
    let service: ReadService;

    // Mock-Datenbanken
    const userModelMock = { aggregate: jest.fn() };
    const processModelMock = { findOne: jest.fn().mockReturnValue({ exec: jest.fn() }) };
    const functionModelMock = { aggregate: jest.fn() };
    const orgUnitModelMock = {};
    const roleModelMock = { find: jest.fn().mockReturnValue({ exec: jest.fn() }) };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReadService,
                { provide: getModelToken('User'), useValue: userModelMock },
                { provide: getModelToken('Process'), useValue: processModelMock },
                { provide: getModelToken('Function'), useValue: functionModelMock },
                { provide: getModelToken('OrgUnit'), useValue: orgUnitModelMock },
                { provide: getModelToken('Role'), useValue: roleModelMock },
            ],
        }).compile();

        service = module.get<ReadService>(ReadService);

        // Standard-Mock-Setups
        processModelMock.findOne.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        });

        roleModelMock.find.mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
        });

        functionModelMock.aggregate.mockResolvedValue([]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('soll eine NotFoundException werfen, wenn der Prozess nicht existiert', async () => {
        processModelMock.findOne.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        });

        await expect(service.findProcessRoles('DA0001', 'muud0001')).rejects.toThrow(
            NotFoundException,
        );

        expect(processModelMock.findOne).toHaveBeenCalledWith({ processId: 'DA0001' });
    });

    it('soll eine NotFoundException werfen, wenn der Prozess keine Rollen hat', async () => {
        processModelMock.findOne.mockReturnValue({
            exec: jest.fn().mockResolvedValue({ roles: null }),
        });

        await expect(service.findProcessRoles('DA0001', 'muud0001')).rejects.toThrow(
            NotFoundException,
        );
    });

    it('soll Rollen und Benutzer zurückgeben, wenn gültige Rollen und Abfragen existieren', async () => {
        // Mock für findOne: Prozess mit Rollen
        processModelMock.findOne.mockReturnValue({
            exec: jest.fn().mockResolvedValue({
                roles: [{ Antragssteller: 'AS0001' }, { Vorgesetzter: 'VG0001' }],
            }),
        });

        // Mock für find: Rollen mit Abfragebedingungen
        roleModelMock.find.mockReturnValue({
            exec: jest.fn().mockResolvedValue([
                {
                    roleId: 'AS0001',
                    query: [
                        {
                            $lookup: {
                                from: 'HKA_Users',
                                let: { userId: '$$userId' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $and: [{ $eq: ['$userId', '$$userId'] }] },
                                        },
                                    },
                                ],
                                as: 'userDetails',
                            },
                        },
                        {
                            $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true },
                        },
                        {
                            $match: { $expr: { $in: ['$userDetails.userId', '$users'] } },
                        },
                        {
                            $project: {
                                functionName: 1,
                                _id: '$userDetails._id',
                                userId: '$userDetails.userId',
                                userType: '$userDetails.userType',
                                userRole: '$userDetails.userRole',
                                orgUnit: '$userDetails.orgUnit',
                                active: '$userDetails.active',
                                validFrom: '$userDetails.validFrom',
                                validUntil: '$userDetails.validUntil',
                                employee: '$userDetails.employee',
                            },
                        },
                    ],
                },
                {
                    roleId: 'VG0001',
                    query: [
                        {
                            $match: { $expr: { $in: ['$$userId', '$users'] } },
                        },
                        {
                            $lookup: {
                                from: 'OrgUnits',
                                let: { orgUnit: '$orgUnit' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$_id', { $toObjectId: '$$orgUnit' }] },
                                        },
                                    },
                                ],
                                as: 'orgUnitDetails',
                            },
                        },
                        {
                            $unwind: { path: '$orgUnitDetails', preserveNullAndEmptyArrays: true },
                        },
                        {
                            $lookup: {
                                from: 'Functions',
                                let: { supervisor: '$orgUnitDetails.supervisor' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ['$_id', { $toObjectId: '$$supervisor' }],
                                            },
                                        },
                                    },
                                ],
                                as: 'supervisorDetails',
                            },
                        },
                        {
                            $unwind: {
                                path: '$supervisorDetails',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: 'HKA_Users',
                                let: {
                                    supervisorUserId: {
                                        $arrayElemAt: ['$supervisorDetails.users', 0],
                                    },
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$userId', '$$supervisorUserId'] },
                                        },
                                    },
                                ],
                                as: 'userDetails',
                            },
                        },
                        {
                            $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true },
                        },
                        {
                            $project: {
                                functionName: '$supervisorDetails.functionName',
                                _id: '$userDetails._id',
                                userId: '$userDetails.userId',
                                userType: '$userDetails.userType',
                                userRole: '$userDetails.userRole',
                                orgUnit: '$userDetails.orgUnit',
                                active: '$userDetails.active',
                                validFrom: '$userDetails.validFrom',
                                validUntil: '$userDetails.validUntil',
                                employee: '$userDetails.employee',
                            },
                        },
                    ],
                },
            ]),
        });

        // Mock für aggregate: Benutzer für jede Rolle
        functionModelMock.aggregate
            .mockResolvedValueOnce([
                {
                    functionName: 'Professor',
                    _id: '673ede38e1746bf8e6aa1adf',
                    userId: 'muud0001',
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
            ])
            .mockResolvedValueOnce([
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
            ]);

        // Aufruf der Methode
        const result = await service.findProcessRoles('DA0001', 'muud0001');

        // Ausgabe des Ergebnisses
        console.log('Ergebnis:', JSON.stringify(result, null, 2));

        // Erwartetes Ergebnis
        expect(result.roles).toEqual([
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
        ]);
    });
});
