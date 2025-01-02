// export type SortInputs = Record<string, 'ASC' | 'DESC'>;

import type { FilterField } from '../types/filter.type.js';

export type SortInput = {
    field: FilterField;
    direction: DirectionType;
};

export type DirectionType = 'ASC' | 'DESC';
