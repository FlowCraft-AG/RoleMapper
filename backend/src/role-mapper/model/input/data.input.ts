import type { EntityCategoryType } from '../entity/entities.entity.js';
import type { FilterInput } from './filter.input.ts';
import type { PaginationParameters } from './pagination-parameters.ts';
import type { SortInput } from './sort.input.js';

/**
 * Eingabeparameter für die dynamische Abfrage von Entitätsdaten.
 *
 * @property {EntityCategoryType} entity - Der Typ der Entität, die abgefragt werden soll (z. B. 'User', 'Process').
 * @property {FilterInput} [filter] - Optional: Die Filterkriterien für die Abfrage.
 * @property {PaginationParameters} [pagination] - Optional: Die Paginierungsoptionen zur Begrenzung der Abfrageergebnisse.
 * @property {SortInput} [sort] - Optional: Die Sortierkriterien, um die Reihenfolge der Ergebnisse zu bestimmen.
 */
export type DataInput = {
    entity: EntityCategoryType;
    filter?: FilterInput;
    pagination?: PaginationParameters;
    sort?: SortInput; // Eine Liste von Sortierkriterien
};

export type MandateInput = {
    entity: EntityCategoryType;
    filter?: FilterInput;
    pagination?: PaginationParameters;
    sort: SortInput; // Eine Liste von Sortierkriterien
};
