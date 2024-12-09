import type { EntityCategoryType } from '../entity/entities.entity.js';
import type { FilterInput } from './filter.input.ts';
import type { PaginationParameters } from './pagination-parameters.ts';

export type DataInput = {
    entity: EntityCategoryType;
    filters?: FilterInput[];
    pagination?: PaginationParameters;
};
