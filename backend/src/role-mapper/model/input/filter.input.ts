import type { FilterField, FilterOperator } from '../types/filter.type.ts';

export type FilterInput = {
    field: FilterField;
    operator: FilterOperator;
    value: string;
    and?: FilterInput[];
    or?: FilterInput[];
    not?: FilterInput;
};
