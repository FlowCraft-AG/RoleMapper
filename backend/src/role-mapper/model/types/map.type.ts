// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import type { FilterOperator } from './filter.type.ts';

// Mapping von FilterOperatoren zu MongoDB-Operatoren
export const operatorMap: Record<FilterOperator, string> = {
    EQ: '$eq',
    IN: '$in',
    GTE: '$gte',
    LTE: '$lte',
    LIKE: '$regex',
};
