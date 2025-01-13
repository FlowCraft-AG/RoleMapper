import type { EntityCategoryType } from '../entity/entities.entity.js';
import type {
    CreateFunctionInput,
    CreateOrgUnitInput,
    CreateProcessInput,
    CreateRoleInput,
    CreateUserInput,
} from '../input/create.input.js';

/**
 * Eingabetyp für die Erstellung von Entitäten.
 *
 * Dieser Typ definiert die Struktur der Eingabedaten, die für die Erstellung von Entitäten
 * in einem System erforderlich sind, wie z. B. Benutzer, Funktionen, Prozesse,
 * Organisationseinheiten und Rollen.
 */
export type CreateEntityInput = {
    /**
     * Der Typ der Entität, die erstellt werden soll.
     *
     * @type {EntityCategoryType}
     * @example "USERS", "MANDATES", "PROCESSES", "ROLES", "ORG_UNITS"
     */
    entity: EntityCategoryType;

    /**
     * Die spezifischen Eingabedaten für die Erstellung eines Benutzers.
     *
     * @type {CreateUserInput | undefined}
     * @example
     * {
     *   userId: "12345",
     *   userType: "STUDENT",
     *   active: true
     * }
     */
    userData?: CreateUserInput;

    /**
     * Die spezifischen Eingabedaten für die Erstellung einer Funktion.
     *
     * @type {CreateFunctionInput | undefined}
     * @example
     * {
     *   functionName: "Manager",
     *   orgUnit: "64b1f768d9a8e900001b1b2f",
     *   users: ["12345"]
     * }
     */
    functionData?: CreateFunctionInput;

    /**
     * Die spezifischen Eingabedaten für die Erstellung eines Prozesses.
     *
     * @type {CreateProcessInput | undefined}
     * @example
     * {
     *   processId: "process123",
     *   name: "Approval Process",
     *   roles: [{ roleId: "role123", roleName: "Approver" }]
     * }
     */
    processData?: CreateProcessInput;

    /**
     * Die spezifischen Eingabedaten für die Erstellung einer Organisationseinheit.
     *
     * @type {CreateOrgUnitInput | undefined}
     * @example
     * {
     *   orgUnitId: "org123",
     *   name: "IT Department",
     *   parentId: "org456",
     *   supervisor: "12345"
     * }
     */
    orgUnitData?: CreateOrgUnitInput;

    /**
     * Die spezifischen Eingabedaten für die Erstellung einer Rolle.
     *
     * @type {CreateRoleInput | undefined}
     * @example
     * {
     *   roleId: "role123",
     *   name: "Administrator",
     *   query: [{ stage: "filter", filter: { field: "status", operator: "EQ", value: "active" } }]
     * }
     */
    roleData?: CreateRoleInput;
};
