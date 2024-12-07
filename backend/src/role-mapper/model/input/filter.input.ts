import { FilterOperator } from '../dto/filter.dto';
import { EntityCategory } from '../entity/entities.entity';
import { FilterField } from '../types/filter.type';

export interface FilterCondition<T extends EntityCategory> {
    field: FilterField<T>;
    operator: FilterOperator;
    value: string;
}
