/**
 * Mögliche Operatoren für Filterbedingungen.
 */
export type FilterOperator = 'EQ' | 'IN' | 'GTE' | 'LTE' | 'LIKE';

export type FilterFields =
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

type Userfilter = 'userId' | 'userType' | 'userRole' | 'orgUnit' | 'active';
type Mandatefilter = 'functionName' | 'orgUnit' | 'users';
type OrgUnitfilter = 'name' | 'parentId' | 'supervisor';
type Processfilter = 'processId' | 'name' | 'roles';
type Rolefilter = 'roleId' | 'name';

export type FilterField = Userfilter | Mandatefilter | OrgUnitfilter | Processfilter | Rolefilter;
