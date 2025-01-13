/**
 * @file process-instance-filter.ts
 * @description Filtertypen für Prozessinstanzen in Camunda APIs.
 */
import type { BaseFilter } from './base-filter.js';

/**
 * Erweiterter Filter für die Suche nach Prozessinstanzen.
 */
export type ProcessInstanceFilter = BaseFilter & {
    /**
     * Version der Prozessinstanz.
     */
    processVersion?: number;

    /**
     * Versionstag der Prozessinstanz.
     */
    processVersionTag?: string;

    /**
     * BPMN-Prozess-ID, die mit der Instanz verknüpft ist.
     */
    bpmnProcessId?: string;

    /**
     * Schlüssel der übergeordneten Prozessinstanz.
     */
    parentKey?: number;

    /**
     * Startdatum der Prozessinstanz.
     */
    startDate?: string;

    /**
     * Enddatum der Prozessinstanz.
     */
    endDate?: string;

    /**
     * Status der Prozessinstanz.
     * Mögliche Werte: `ACTIVE`, `COMPLETED`, `CANCELED`.
     */
    state?: 'ACTIVE' | 'COMPLETED' | 'CANCELED';

    /**
     * Gibt an, ob ein Incident mit der Prozessinstanz verknüpft ist.
     */
    incident?: boolean;
};
