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
    | 'courseOfStudy'
    | 'level'
    | 'isSingleUser'
    | 'supervisor';

type Userfilter =
    | 'userId'
    | 'userType'
    | 'userRole'
    | 'orgUnit'
    | 'active'
    | 'courseOfStudy'
    | 'level';
type Mandatefilter = 'functionName' | 'orgUnit' | 'users' | 'isSingleUser';
type OrgUnitfilter = 'name' | 'parentId' | 'supervisor';
type Processfilter = 'processId' | 'name' | 'roles';
type Rolefilter = 'roleId' | 'name';

export type FilterField = Userfilter | Mandatefilter | OrgUnitfilter | Processfilter | Rolefilter;
