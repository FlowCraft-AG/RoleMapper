/**
 * @file incident.type.ts
 * @description Typdefinitionen für die Filterung von FlowNode-Instanzen und deren Eigenschaften in einer Prozess-Engine.
 */

import type { FlowNodeState, FlowNodeType } from '../flownode.type.js';
import type { BaseFilter } from './base-filter.js';

/**
 * @typedef FlowNodeFilter
 * @description Definiert die möglichen Filteroptionen für die Suche nach FlowNode-Instanzen in einer Prozess-Engine.
 *
 * @extends {BaseFilter}
 *
 * @property {number} [processInstanceKey] - Der Schlüssel der zugehörigen Prozessinstanz.
 * @property {number} [processDefinitionKey] - Der Schlüssel der Prozessdefinition.
 * @property {string} [startDate] - Das Startdatum für die Suche (im ISO-Format).
 * @property {string} [endDate] - Das Enddatum für die Suche (im ISO-Format).
 * @property {string} [flowNodeId] - Die eindeutige ID der FlowNode.
 * @property {string} [flowNodeName] - Der Name der FlowNode.
 * @property {number} [incidentKey] - Der Schlüssel des zugehörigen Incidents.
 * @property {FlowNodeType} [type] - Der Typ der FlowNode (z. B. "User Task", "Service Task").
 * @property {FlowNodeState} [state] - Der Zustand der FlowNode (z. B. "ACTIVE", "COMPLETED").
 * @property {boolean} [incident] - Gibt an, ob ein Incident für diese FlowNode existiert.
 */
export type FlowNodeFilter = BaseFilter & {
    /**
     * Der Schlüssel der zugehörigen Prozessinstanz.
     * Wird verwendet, um FlowNodes einer bestimmten Instanz zu filtern.
     */
    processInstanceKey?: number;

    /**
     * Der Schlüssel der Prozessdefinition.
     * Filtert FlowNodes basierend auf ihrer Definition.
     */
    processDefinitionKey?: number;

    /**
     * Das Startdatum für die Suche (im ISO-Format, z. B. "2025-01-01T00:00:00Z").
     * Nur FlowNodes, die nach diesem Datum gestartet wurden, werden berücksichtigt.
     */
    startDate?: string;

    /**
     * Das Enddatum für die Suche (im ISO-Format, z. B. "2025-01-31T23:59:59Z").
     * Nur FlowNodes, die vor diesem Datum beendet wurden, werden berücksichtigt.
     */
    endDate?: string;

    /**
     * Die eindeutige ID der FlowNode.
     * Wird verwendet, um nach einer spezifischen FlowNode zu suchen.
     */
    flowNodeId?: string;

    /**
     * Der Name der FlowNode.
     * Ermöglicht die Filterung nach FlowNodes mit einem bestimmten Namen.
     */
    flowNodeName?: string;

    /**
     * Der Schlüssel des zugehörigen Incidents.
     * Filtert FlowNodes basierend auf Incidents, die ihnen zugeordnet sind.
     */
    incidentKey?: number;

    /**
     * Der Typ der FlowNode.
     * Z. B. "User Task", "Service Task", "Gateway".
     */
    type?: FlowNodeType;

    /**
     * Der Zustand der FlowNode.
     * Mögliche Zustände sind z. B. "ACTIVE", "COMPLETED", "CANCELED".
     */
    state?: FlowNodeState;

    /**
     * Gibt an, ob ein Incident für diese FlowNode existiert.
     * - `true`: Nur FlowNodes mit Incidents.
     * - `false`: Nur FlowNodes ohne Incidents.
     */
    incident?: boolean;
};
