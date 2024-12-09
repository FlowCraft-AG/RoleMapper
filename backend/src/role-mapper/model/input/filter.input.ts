import type { FilterField, FilterOperator } from '../types/filter.type.ts';

export type FilterInput = {
    field: FilterField;
    operator: FilterOperator;
    value: string | number | boolean;
    and?: FilterInput[];
    or?: FilterInput[];
    not?: FilterInput;
};

// /**
//  * Typ für direkte Filterkriterien.
//  */
// export type DirectFilterInput = {
//     field: FilterField;
//     operator: FilterOperator;
//     value: string | number | boolean; // Unterstützung für mehrere Typen.
// };

// /**
//  * Typ für kombinierte Filter mit logischen Operatoren.
//  */
// export type LogicalFilterInput = {
//     and?: FilterInput[]; // Liste von UND-Verknüpften Bedingungen.
//     or?: FilterInput[]; // Liste von ODER-Verknüpften Bedingungen.
//     not?: FilterInput; // Negation eines Filters.
// };

// /**
//  * Typ für Filtereingaben (rekursiv).
//  * Kann direkte oder kombinierte Filter darstellen.
//  */
// export type FilterInput = DirectFilterInput & LogicalFilterInput;
