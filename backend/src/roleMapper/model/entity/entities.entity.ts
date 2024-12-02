import { Function, FunctionSchema } from './function.entity.js';
import { OrgUnit, OrgUnitSchema } from './orgUnit.entity.js';
import { Process, ProcessSchema } from './process.entity.js';
import { Role, RoleSchema } from './roles.entity.js';
import { User, UserSchema } from './user.entity.js';

/**
 * Definiert eine Mongoose-Entität und deren Schema.
 */
interface EntitySchema {
    name: string;
    schema: any;
}

/**
 * Liste aller Mongoose-Entitäten und deren Schemas.
 * Wird für die Registrierung im Modul verwendet.
 */
const entitySchemas: EntitySchema[] = [
    { name: User.name, schema: UserSchema },
    { name: Function.name, schema: FunctionSchema },
    { name: OrgUnit.name, schema: OrgUnitSchema },
    { name: Process.name, schema: ProcessSchema },
    { name: Role.name, schema: RoleSchema },
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
