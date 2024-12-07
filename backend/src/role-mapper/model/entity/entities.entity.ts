import { MANDATE_SCHEMA, MandateDocument, Mandates } from './mandates.entity.js';
import { ORG_UNIT_SCHEMA, OrgUnit, OrgUnitDocument } from './org-unit.entity.js';
import { Process, PROCESS_SCHEMA, ProcessDocument } from './process.entity.js';
import { Role, ROLE_SCHEMA, RoleDocument } from './roles.entity.js';
import { User, USER_SCHEMA, UserDocument } from './user.entity.js';

/**
 * Definiert eine Mongoose-Entität und deren Schema.
 */
type EntitySchema = {
    name: string;
    schema: CollectionSchema;
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

/**
 * Eine Liste der unterstützten Entitäten für dynamische Abfragen.
 * Diese Entitäten werden für Validierungszwecke und Typensicherheit verwendet.
 *
 * - `USERS`: Repräsentiert Benutzerinformationen.
 * - `FUNCTIONS`: Repräsentiert Funktionen innerhalb der Organisation.
 * - `PROCESSES`: Repräsentiert Prozesse, die dynamisch abgefragt werden können.
 * - `ROLES`: Repräsentiert Rollen, die bestimmten Prozessen zugeordnet sind.
 * - `ORG_UNITS`: Repräsentiert organisatorische Einheiten.
 *
 * **Wartungshinweis:**
 * - Neue Entitäten können einfach zu diesem Array hinzugefügt werden.
 * - Der Typ `SupportedEntities` wird automatisch synchronisiert, um die neuen Werte zu berücksichtigen.
 */
export const SUPPORTED_ENTITIES = [
    'USERS',
    'FUNCTIONS',
    'PROCESSES',
    'ROLES',
    'ORG_UNITS',
] as const;

/**
 * Typdefinition für unterstützte Entitäten.
 * Dieser Typ wird dynamisch aus der Liste `SUPPORTED_ENTITIES` generiert.
 *
 * **Vorteile:**
 * - Bietet strikte Typprüfung für dynamische Abfragen.
 * - Stellt sicher, dass nur gültige Entitäten verwendet werden können.
 *
 * **Beispiel:**
 * ```typescript
 * function validateEntity(entity: SupportedEntities) {
 *
 * }
 * validateEntity('USERS'); // ✅ Gültig
 * validateEntity('INVALID'); // ❌ Fehler bei der Kompilierung
 * ```
 */
export type SupportedEntities = (typeof SUPPORTED_ENTITIES)[number];

export type Collections = User | Mandates | OrgUnit | Process | Role;
export type CollectionSchema =
    | typeof USER_SCHEMA
    | typeof MANDATE_SCHEMA
    | typeof ORG_UNIT_SCHEMA
    | typeof PROCESS_SCHEMA
    | typeof ROLE_SCHEMA;

export type GetData = User[] | Mandates[] | OrgUnit[] | Process[] | Role[];
export type EntityCategory = 'USERS' | 'FUNCTIONS' | 'PROCESSES' | 'ROLES' | 'ORG_UNITS';
export type EntityDocument =
    | UserDocument
    | MandateDocument
    | ProcessDocument
    | RoleDocument
    | OrgUnitDocument;
