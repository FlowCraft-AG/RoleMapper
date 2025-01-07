// export type SortInputs = Record<string, 'ASC' | 'DESC'>;

import type { FilterField } from '../types/filter.type.js';

/**
 * Eingabeparameter für Sortieroptionen.
 *
 * @property {FilterField} field - Das Feld, nach dem sortiert werden soll.
 * @property {DirectionType} direction - Die Sortierrichtung ('ASC' für aufsteigend, 'DESC' für absteigend).
 */
export type SortInput = {
    field: FilterField;
    direction: DirectionType;
};
/**
 * Sortierrichtungen.
 */
export type DirectionType = 'ASC' | 'DESC';
