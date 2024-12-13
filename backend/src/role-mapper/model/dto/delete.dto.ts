import type { EntityCategoryType } from '../entity/entities.entity.js';
import type { FilterInput } from '../input/filter.input.js';

export type DeleteEntityInput = {
    entity: EntityCategoryType;
    filter: FilterInput;
};
