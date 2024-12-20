import type { EntityCategoryType } from '../entity/entities.entity.js';
import type { FilterInput } from './filter.input.ts';
import type { PaginationParameters } from './pagination-parameters.ts';
import type { SortInput } from './sort.input.js';

export type DataInput = {
    entity: EntityCategoryType;
    filter?: FilterInput;
    pagination?: PaginationParameters;
    sort: SortInput; // Eine Liste von Sortierkriterien
};
