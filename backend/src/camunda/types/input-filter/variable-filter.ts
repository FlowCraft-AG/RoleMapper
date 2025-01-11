/**
 * @file variable-filter.ts
 * @description Filtertypen zur Suche nach Variablen in Camunda APIs.
 */
import type { BaseFilter } from './base-filter.js';

/**
 * Erweiterter Filter für die Suche nach Variablen in Camunda.
 */
export type VariableFilter = BaseFilter & {
    /**
     * Schlüssel der zugehörigen Prozessinstanz.
     */
    processInstanceKey?: number;

    /**
     * Schlüssel des Geltungsbereichs der Variable.
     */
    scopeKey?: number;

    /**
     * Name der Variable.
     */
    name?: string;

    /**
     * Wert der Variable.
     */
    value?: string;

    /**
     * Gibt an, ob der Wert der Variable abgeschnitten wurde.
     */
    truncated?: boolean;
};
