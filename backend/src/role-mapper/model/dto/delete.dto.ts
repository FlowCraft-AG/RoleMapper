import type { EntityCategoryType } from '../entity/entities.entity.js';
import type { FilterInput } from '../input/filter.input.js';

/**
 * Eingabetyp für das Löschen einer Entität.
 *
 * Dieser Typ definiert die Struktur der Eingabedaten, die erforderlich sind, um eine bestimmte
 * Entität aus der Datenbank zu löschen.
 */
export type DeleteEntityInput = {
    /**
     * Der Typ der Entität, die gelöscht werden soll.
     *
     * @type {EntityCategoryType}
     * @example "USERS", "MANDATES", "PROCESSES", "ROLES", "ORG_UNITS"
     */
    entity: EntityCategoryType;

    /**
     * Die Filterkriterien, um die Zielentität zu identifizieren.
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
};
