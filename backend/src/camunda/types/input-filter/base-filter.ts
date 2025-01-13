/**
 * @file base-filter.ts
 * @description Definiert Basistypen für Filter, die in mehreren Camunda-APIs verwendet werden können.
 * Diese Basistypen enthalten gemeinsame Eigenschaften wie Sortierung, Größe und Tenant-IDs.
 */

/**
 * Basistyp für Filteroptionen, die in mehreren APIs verwendet werden.
 */
export type BaseFilter = {
    /**
     * Eindeutiger Schlüssel des zu filternden Objekts.
     * Beispiel: Prozessinstanz-, Prozessdefinition-, FlowNode-Instanz-, Incident- oder Variablenschlüssel.
     */
    key?: string;

    /**
     * Tenant-ID für Multi-Tenancy-Filter.
     * Wenn Multi-Tenancy aktiviert ist, werden nur Objekte des angegebenen Tenants zurückgegeben.
     */
    tenantId?: string;

    /**
     * Maximale Anzahl von Ergebnissen, die zurückgegeben werden sollen.
     * Standardwert kann von der jeweiligen API festgelegt werden.
     */
    size?: number;

    /**
     * Sortieroptionen für die Ergebnisse.
     * Ermöglicht die Sortierung nach bestimmten Feldern in aufsteigender oder absteigender Reihenfolge.
     */
    sort?: SortOption[];
};

/**
 * Definiert die Optionen zur Sortierung der Filterergebnisse.
 */
export type SortOption = {
    /**
     * Feldname, nach dem die Ergebnisse sortiert werden sollen.
     * Beispiel: "creationDate" oder "priority".
     */
    field: string;

    /**
     * Sortierreihenfolge.
     * - `ASC`: Aufsteigend
     * - `DESC`: Absteigend
     */
    order: 'ASC' | 'DESC';
};
