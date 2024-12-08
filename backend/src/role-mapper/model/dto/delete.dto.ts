import { type EntityCategoryType } from '../entity/entities.entity.js';
import { type FilterInputDTO } from './filter.dto.js';

export type DeleteEntityInput = {
    entity: EntityCategoryType;
    filters: FilterInputDTO[];
};
