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
