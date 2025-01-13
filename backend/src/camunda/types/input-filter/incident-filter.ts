/**
 * @file incident-filter.ts
 * @description Filtertypen zur Suche nach Incidents in Camunda APIs.
 */

import type { BaseFilter } from './base-filter.js';

/**
 * Erweiterter Filter für die Suche nach Incidents in Camunda.
 *
 * @extends BaseFilter
 * @property {string} [processInstanceKey] - Schlüssel der zugehörigen Prozessinstanz.
 * @property {string} [processDefinitionKey] - Schlüssel der zugehörigen Prozessdefinition.
 * @property {IncidentState} [state] - Zustand des Incidents (z. B. "ACTIVE" oder "RESOLVED").
 * @property {string} [jobKey] - Schlüssel des zugehörigen Jobs.
 */
export type IncidentFilter = BaseFilter & {
    /**
     * Schlüssel der zugehörigen Prozessinstanz.
     */
    processInstanceKey?: string;

    /**
     * Schlüssel der zugehörigen Prozessdefinition.
     */
    processDefinitionKey?: string;

    /**
     * Zustand des Incidents.
     */
    state?: IncidentState;

    /**
     * Schlüssel des zugehörigen Jobs.
     */
    jobKey?: string;
};

/**
 * Mögliche Zustände eines Incidents in Camunda.
 *
 * @enum
 * @property {'ACTIVE'} ACTIVE - Incident ist aktiv.
 * @property {'MIGRATED'} MIGRATED - Incident wurde migriert.
 * @property {'RESOLVED'} RESOLVED - Incident wurde gelöst.
 * @property {'PENDING'} PENDING - Incident steht aus und wird bearbeitet.
 */
export type IncidentState = 'ACTIVE' | 'MIGRATED' | 'RESOLVED' | 'PENDING';
