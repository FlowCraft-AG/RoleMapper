import type { EntityCategoryType } from '../entity/entities.entity.js';
import type { FilterInput } from '../input/filter.input.js';
import type {
    UpdateDataInput,
    UpdateFunctionInput,
    UpdateOrgUnitInput,
    UpdateProcessInput,
    UpdateRoleInput,
    UpdateUserInput,
} from '../input/update.input.js';

/**
 * Eingabetyp für das Aktualisieren von Entitäten.
 *
 * Dieser Typ definiert die Struktur der Eingabedaten, die für das Aktualisieren von
 * Entitäten in REST- und GraphQL-Anwendungen verwendet werden.
 */
export type UpdateEntityInput = {
    /**
     * Der Typ der Entität, die aktualisiert werden soll.
     *
     * @type {EntityCategoryType}
     * @example "USERS", "MANDATES", "PROCESSES", "ROLES", "ORG_UNITS"
     */
    entity: EntityCategoryType;

    /**
     * Die Filterkriterien, um die Zielentität(en) für die Aktualisierung zu identifizieren.
     *
     * @type {FilterInput}
     * @example
     * {
     *   field: "name",
     *   operator: "EQ",
     *   value: "IT-Abteilung"
     * }
     */
    filter: FilterInput;

    /**
     * Die allgemeinen Aktualisierungsdaten, die für REST-Anwendungen verwendet werden.
     *
     * @type {UpdateDataInput}
     * @example
     * {
     *   field: "name",
     *   value: "Updated Name"
     * }
     */
    data: UpdateDataInput;

    /**
     * Die spezifischen Aktualisierungsdaten für Benutzer (GraphQL).
     *
     * @type {UpdateUserInput | undefined}
     * @example
     * {
     *   firstName: "John",
     *   lastName: "Doe"
     * }
     */
    userData?: UpdateUserInput;

    /**
     * Die spezifischen Aktualisierungsdaten für Funktionen (GraphQL).
     *
     * @type {UpdateFunctionInput | undefined}
     * @example
     * {
     *   functionName: "Updated Function"
     * }
     */
    functionData?: UpdateFunctionInput;

    /**
     * Die spezifischen Aktualisierungsdaten für Prozesse (GraphQL).
     *
     * @type {UpdateProcessInput | undefined}
     * @example
     * {
     *   processName: "Updated Process"
     * }
     */
    processData?: UpdateProcessInput;

    /**
     * Die spezifischen Aktualisierungsdaten für Organisationseinheiten (GraphQL).
     *
     * @type {UpdateOrgUnitInput | undefined}
     * @example
     * {
     *   orgUnitName: "Updated Org Unit"
     * }
     */
    orgUnitData?: UpdateOrgUnitInput;

    /**
     * Die spezifischen Aktualisierungsdaten für Rollen (GraphQL).
     *
     * @type {UpdateRoleInput | undefined}
     * @example
     * {
     *   roleName: "Updated Role"
     * }
     */
    roleData?: UpdateRoleInput;
};
