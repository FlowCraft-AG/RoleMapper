import { MANDATE_SCHEMA, type MandateDocument, Mandates } from './mandates.entity.js';
import { ORG_UNIT_SCHEMA, OrgUnit, type OrgUnitDocument } from './org-unit.entity.js';
import { Process, PROCESS_SCHEMA, type ProcessDocument } from './process.entity.js';
import { Role, ROLE_SCHEMA, type RoleDocument } from './roles.entity.js';
import { User, USER_SCHEMA, type UserDocument } from './user.entity.js';

/**
 * Definiert eine Mongoose-Entität und deren Schema.
 */
type EntitySchema = {
    name: string;
    schema: EntitySchemaType;
};

/**
 * Liste aller Mongoose-Entitäten und deren Schemas.
 * Wird für die Registrierung im Modul verwendet.
 *
 * Eine Liste von EntitySchemas, die verschiedene Entitäten und ihre zugehörigen Schemata repräsentiert.
 *
 * @type {EntitySchema[]}
 * @property {string} name - Der Name der Entität.
 * @property {object} schema - Das Schema der Entität.
 *
 * Enthaltene Entitäten:
 * - User: Das Schema für Benutzer.
 * - Function: Das Schema für Funktionen.
 * - OrgUnit: Das Schema für Organisationseinheiten.
 * - Process: Das Schema für Prozesse.
 * - Role: Das Schema für Rollen.
 */
const entitySchemas: EntitySchema[] = [
    { name: User.name, schema: USER_SCHEMA },
    { name: Mandates.name, schema: MANDATE_SCHEMA },
    { name: OrgUnit.name, schema: ORG_UNIT_SCHEMA },
    { name: Process.name, schema: PROCESS_SCHEMA },
    { name: Role.name, schema: ROLE_SCHEMA },
];

/**
 * Exportiert die Entitäten in einem Format, das für die Registrierung im Modul verwendet werden kann.
 */
export const entities = entitySchemas.map(({ name, schema }) => ({
    name,
    schema,
}));

export type EntityType = User | Mandates | OrgUnit | Process | Role;
export type EntitySchemaType =
    | typeof USER_SCHEMA
    | typeof MANDATE_SCHEMA
    | typeof ORG_UNIT_SCHEMA
    | typeof PROCESS_SCHEMA
    | typeof ROLE_SCHEMA;

export type EntityCategoryType = 'USERS' | 'MANDATES' | 'PROCESSES' | 'ROLES' | 'ORG_UNITS';
export type EntityDocument =
    | UserDocument
    | MandateDocument
    | ProcessDocument
    | RoleDocument
    | OrgUnitDocument;
