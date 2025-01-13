// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import type { Types } from 'mongoose';
import type { FilterField, FilterOperator } from '../types/filter.type.ts';

/**
 * Eingabeparameter für Filteroperationen.
 *
 * @property {FilterField} [field] - Das Feld, das gefiltert werden soll.
 * @property {FilterOperator} [operator] - Der Vergleichsoperator, der angewendet werden soll.
 * @property {string | number | boolean | Types.ObjectId} [value] - Der Vergleichswert.
 * @property {FilterInput[]} [AND] - Verschachtelte Filterbedingungen mit UND-Verknüpfung.
 * @property {FilterInput[]} [OR] - Verschachtelte Filterbedingungen mit ODER-Verknüpfung.
 * @property {FilterInput[]} [NOR] - Verschachtelte Filterbedingungen mit NICHT-ODER-Verknüpfung.
 */
export type FilterInput = {
    field?: FilterField;
    operator?: FilterOperator;
    value?: string | number | boolean | Types.ObjectId;
    AND?: FilterInput[];
    OR?: FilterInput[];
    NOR?: FilterInput[];
};
