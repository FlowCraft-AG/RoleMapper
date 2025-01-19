import type { Types } from 'mongoose';
import type { RoleType } from '../entity/process.entity.js';
import { type QueryStageInput } from './query-stage.input.js';

export type CreateUserInput = {
    userId: string;
    userType: string;
    userRole: string;
    orgUnit?: string;
    active?: boolean;
    student?: CreateStudentInput;
    employee?: CreateEmployeeInput;
};

export type CreateStudentInput = {
    courseOfStudy: string;
    courseOfStudyUnique: string;
    level: string;
    examRegulation: string;
};

export type CreateEmployeeInput = {
    costCenter: string;
    department: string;
};

export type CreateFunctionInput = {
    functionName: string;
    orgUnit: Types.ObjectId;
    type?: string;
    users: string[];
    isSingleUser?: boolean;
    isImpliciteFunction?: boolean;
};

export type CreateProcessInput = {
    parentId: Types.ObjectId;
    name: string;
    roles: ProcessRoleInput[];
};

export type ProcessRoleInput = {
    roleId: Types.ObjectId;
    roleName: string;
    roleType: RoleType;
};

export type CreateOrgUnitInput = {
    name: string;
    parentId?: Types.ObjectId;
    supervisor?: Types.ObjectId;
};

export type CreateRoleInput = {
    roleId: string;
    name: string;
    query: QueryStageInput[];
};

export type CreateDataInput =
    | CreateUserInput
    | CreateFunctionInput
    | CreateProcessInput
    | CreateOrgUnitInput
    | CreateRoleInput;
