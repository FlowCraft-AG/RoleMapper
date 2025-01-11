/**
 * @file task-filter.ts
 * @description Definiert spezifische Filtertypen für Aufgaben, die über die Camunda Tasklist API abgefragt werden können.
 */
import type { BaseFilter } from './base-filter.js';

/**
 * Erweiterter Filter für die Suche nach Aufgaben in der Camunda Tasklist API.
 */
export type TaskFilter = BaseFilter & {
    /**
     * Status der Aufgabe.
     * Mögliche Werte: `CREATED`, `COMPLETED`, `CANCELED`, `FAILED`.
     */
    state?: 'CREATED' | 'COMPLETED' | 'CANCELED' | 'FAILED';

    /**
     * Gibt an, ob die Aufgabe einer Person zugewiesen ist.
     * - `true`: Nur zugewiesene Aufgaben
     * - `false`: Nur unzugewiesene Aufgaben
     */
    assigned?: boolean;

    /**
     * Benutzername oder ID des Benutzers, dem die Aufgabe zugewiesen ist.
     */
    assignee?: string;

    /**
     * Liste möglicher Benutzer, denen die Aufgabe zugewiesen sein könnte.
     */
    assignees?: string[];

    /**
     * Kandidatengruppe, die für die Aufgabe zuständig ist.
     */
    candidateGroup?: string;

    /**
     * Liste von Kandidatengruppen, die für die Aufgabe zuständig sein könnten.
     */
    candidateGroups?: string[];

    /**
     * Kandidatenbenutzer, der für die Aufgabe zuständig ist.
     */
    candidateUser?: string;

    /**
     * Liste von Kandidatenbenutzern, die für die Aufgabe zuständig sein könnten.
     */
    candidateUsers?: string[];

    /**
     * Schlüssel der zugehörigen Prozessdefinition.
     */
    processDefinitionKey?: string;

    /**
     * Schlüssel der zugehörigen Prozessinstanz.
     */
    processInstanceKey?: string;

    /**
     * Zeitraum für das Nachverfolgungsdatum (Follow-Up-Date).
     */
    followUpDate?: DateRange;

    /**
     * Zeitraum für das Fälligkeitsdatum (Due-Date).
     */
    dueDate?: DateRange;

    /**
     * Variablen, die bei der Aufgabenfilterung berücksichtigt werden sollen.
     */
    taskVariables?: VariableFilter[];

    /**
     * Variablen, die in den Ergebnissen enthalten sein sollen.
     */
    includeVariables?: IncludeVariable[];
};

/**
 * Definiert einen Zeitraum mit Start- und Enddatum.
 */
type DateRange = {
    /**
     * Startdatum im ISO-Format.
     * Beispiel: "2025-01-01T00:00:00Z".
     */
    from?: string;

    /**
     * Enddatum im ISO-Format.
     * Beispiel: "2025-12-31T23:59:59Z".
     */
    to?: string;
};

/**
 * Filterkriterien für Aufgabenvariablen.
 */
type VariableFilter = {
    /**
     * Name der Variable.
     */
    name: string;

    /**
     * Wert der Variable.
     */
    value: string;

    /**
     * Vergleichsoperator.
     * - `eq`: Gleich
     * - `neq`: Ungleich
     * - `gt`: Größer als
     * - `gte`: Größer oder gleich
     * - `lt`: Kleiner als
     * - `lte`: Kleiner oder gleich
     */
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte';
};

/**
 * Definiert Variablen, die in den Ergebnissen enthalten sein sollen.
 */
type IncludeVariable = {
    /**
     * Name der Variable.
     */
    name: string;

    /**
     * Gibt an, ob der vollständige Wert der Variable zurückgegeben werden soll.
     */
    alwaysReturnFullValue: boolean;
};
