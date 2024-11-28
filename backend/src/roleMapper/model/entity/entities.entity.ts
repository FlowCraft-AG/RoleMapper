import { Employee, EmployeeSchema } from './employee.entity.js';
import { Student, StudentSchema } from './student.entity.js';
import { User, UserSchema } from './user.entity.js';

/**
 * Liste aller Mongoose-Entitäten und deren Schemas.
 * Wird für die Registrierung im Modul verwendet.
 */
export const entities = [
  { name: User.name, schema: UserSchema },
  { name: Student.name, schema: StudentSchema },
  { name: Employee.name, schema: EmployeeSchema },
];
