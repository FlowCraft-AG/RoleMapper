/**
 * Mögliche Operatoren für Filterbedingungen.
 */
export type FilterOperator = 'EQ' | 'IN' | 'GTE' | 'LTE' | 'LIKE';
/**
 * Mögliche Filterfelder für alle Entitäten.
 */
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
/**
 * Filterfelder für Benutzer.
 */
type Userfilter =
    | 'userId'
    | 'userType'
    | 'userRole'
    | 'orgUnit'
    | 'active'
    | 'courseOfStudy'
    | 'examRegulation'
    | 'costCenter'
    | 'department'
    | 'courseOfStudyUnique'
    | 'courseOfStudyShort'
    | ' courseOfStudyName'
    | 'alias'
    | 'kostenstelleNr'
    | 'level';
/**
 * Filterfelder für Mandate.
 */
type Mandatefilter =
    | 'functionName'
    | 'orgUnit'
    | 'users'
    | 'isSingleUser'
    | 'isImpliciteFunction'
    | '_id';
/**
 * Filterfelder für Organisationseinheiten.
 */
type OrgUnitfilter = 'name' | 'parentId' | 'supervisor';
/**
 * Filterfelder für Prozesse.
 */
type Processfilter = 'processId' | 'name' | 'roles';
/**
 * Filterfelder für Rollen.
 */
type Rolefilter = 'roleId' | 'name';
/**
 * Zusammengeführte Filterfelder für alle Entitätstypen.
 */
export type FilterField = Userfilter | Mandatefilter | OrgUnitfilter | Processfilter | Rolefilter;
