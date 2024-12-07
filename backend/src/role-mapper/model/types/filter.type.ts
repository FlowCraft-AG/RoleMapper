import { type EntityCategory } from './entity-category.type';

export type FilterOperator = 'EQ' | 'IN' | 'GTE' | 'LTE' | 'LIKE';
export type AllowedFields =
    | 'userId'
    | 'userType'
    | 'userRole'
    | 'orgUnit'
    | 'active'
    | 'functionName'
    | 'name'
    | 'roleId'
    | 'processId'
    | 'parentId'
    | 'supervisor';

// Set von erlaubten Feldern
export const ALLOWED_FIELDS = new Set<AllowedFields>([
    'userId',
    'userType',
    'userRole',
    'orgUnit',
    'active',
    'functionName',
    'name',
    'roleId',
    'processId',
    'parentId',
    'supervisor',
]);
export const OPERATOR_KEYS = ['EQ', 'IN', 'GTE', 'LTE', 'LIKE'];
export const OPERATOR_VALUES = ['$eq', '$in', '$gte', '$lte', '$regex'];

export type FilterField<T extends EntityCategory> = T extends 'USERS'
    ? 'userId' | 'userType' | 'userRole' | 'orgUnit' | 'active' | 'functionName'
    : T extends 'FUNCTIONS'
      ? 'functionName' | 'orgUnit'
      : T extends 'ORG_UNITS'
        ? 'name' | 'parentId' | 'supervisor'
        : T extends 'PROCESSES'
          ? 'processId' | 'name'
          : T extends 'ROLES'
            ? 'roleId' | 'name'
            : never;
