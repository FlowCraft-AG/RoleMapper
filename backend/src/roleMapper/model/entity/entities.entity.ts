import { Function, FunctionSchema } from './function.entity.js';
import { OrgUnit, OrgUnitSchema } from './org-unit.entity.js';
import { Process, ProcessSchema } from './process.entity.js';
import { Role, RoleSchema } from './roles.entity.js';
import { User, UserSchema } from './user.entity.js';

/**
 * Liste aller Mongoose-Entitäten und deren Schemas.
 * Wird für die Registrierung im Modul verwendet.
 */
export const entities = [
  { name: User.name, schema: UserSchema },
  { name: Function.name, schema: FunctionSchema },
  { name: OrgUnit.name, schema: OrgUnitSchema },
  { name: Process.name, schema: ProcessSchema },
  { name: Role.name, schema: RoleSchema }
];
