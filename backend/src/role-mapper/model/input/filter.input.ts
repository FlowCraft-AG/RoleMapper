// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import type { Types } from 'mongoose';
import type { FilterField, FilterOperator } from '../types/filter.type.ts';

export type FilterInput = {
    field?: FilterField;
    operator?: FilterOperator;
    value?: string | number | boolean | Types.ObjectId;
    AND?: FilterInput[];
    OR?: FilterInput[];
    NOR?: FilterInput[];
};
