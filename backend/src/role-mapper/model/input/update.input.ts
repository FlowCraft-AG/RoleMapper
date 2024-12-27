import type { Types } from 'mongoose';
import { type ProcessRoleInput } from './create.input.js';
import { type QueryStageInput } from './query-stage.input.js';

export type UpdateUserInput = {
    userId: string;
    userType?: string;
    userRole?: string;
    orgUnit?: string;
    active?: boolean;
    validFrom?: string;
    validUntil?: string;
    student?: UpdateStudentInput;
    employee?: UpdateEmployeeInput;
};

export type UpdateStudentInput = {
    courseOfStudy?: string;
    level?: string;
    examRegulation?: string;
};

export type UpdateEmployeeInput = {
    costCenter?: string;
    department?: string;
};

export type UpdateFunctionInput = {
    functionName: string;
    orgUnit?: Types.ObjectId | string;
    type?: string;
    users?: string[];
};

export type UpdateProcessInput = {
    processId: string;
    name?: string;
    roles?: ProcessRoleInput[];
};

export type UpdateOrgUnitInput = {
    orgUnitId: string;
    name?: string;
    parentId?: Types.ObjectId | string;
    supervisor?: Types.ObjectId | string;
};

export type UpdateRoleInput = {
    roleId: string;
    name?: string;
    query?: QueryStageInput[];
};

export type UpdateDataInput =
    | UpdateUserInput
    | UpdateFunctionInput
    | UpdateProcessInput
    | UpdateOrgUnitInput
    | UpdateRoleInput;
