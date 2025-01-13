/**
 * @file process-definition-filter.ts
 * @description Filtertypen für Prozessdefinitionen in Camunda APIs.
 */
import type { BaseFilter } from './base-filter.js';

/**
 * Erweiterter Filter für die Suche nach Prozessdefinitionen.
 */
export type ProcessDefinitionFilter = BaseFilter & {
    /**
     * Name der Prozessdefinition.
     * Beispiel: "Bestellprozess".
     */
    name?: string;

    /**
     * Version der Prozessdefinition.
     */
    version?: number;

    /**
     * Versionstag der Prozessdefinition.
     * Beispiel: "v1.0" oder "Release-2025".
     */
    versionTag?: string;

    /**
     * BPMN-Prozess-ID, die der Prozessdefinition zugeordnet ist.
     * Beispiel: "order_process".
     */
    bpmnProcessId?: string;

    /**
     * Tenant-ID für Multi-Tenancy-Filter.
     * Wird verwendet, um nur Prozessdefinitionen eines bestimmten Tenants zu durchsuchen.
     */
    tenantId?: string;
};
