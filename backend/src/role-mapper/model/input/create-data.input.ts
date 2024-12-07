import { EntityCategory } from '../entity/entities.entity';

export interface EntityCreationInput {
    entity: EntityCategory;
    data: Record<string, any>; // Dynamischer Typ für flexible Eingabe
}
