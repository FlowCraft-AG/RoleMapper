import type { EntityCategoryType } from '../entity/entities.entity.js';

export type EntityCreationInput = {
    entity: EntityCategoryType;
    data: Record<string, any>; // Dynamischer Typ für flexible Eingabe
};
