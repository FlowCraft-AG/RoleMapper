/**
 * Paginierungsparameter für Abfragen.
 *
 * @property {number} [limit=10] - Die maximale Anzahl von Ergebnissen (Standard: 10).
 * @property {number} [offset=0] - Die Anzahl der Ergebnisse, die übersprungen werden sollen (Standard: 0).
 */
export type PaginationParameters = {
    limit?: number; // Default: 10
    offset?: number; // Default: 0
};
