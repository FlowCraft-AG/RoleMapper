import { EntityCategoryType } from '../entity/entities.entity';

export interface EntityCreationInput {
    entity: EntityCategoryType;
    data: Record<string, any>; // Dynamischer Typ für flexible Eingabe
}
