/**
 * @file flownode.type.ts
 * @description Typdefinitionen für FlowNode-Instanzen, deren Typen und Zustände in einer Prozess-Engine.
 */

/**
 * Beschreibt die möglichen Zustände einer FlowNode innerhalb einer Prozessinstanz.
 *
 * @typedef {'ACTIVE' | 'COMPLETED' | 'TERMINATED'} FlowNodeState
 *
 * @property {'ACTIVE'} ACTIVE - Die FlowNode wird derzeit ausgeführt.
 * @property {'COMPLETED'} COMPLETED - Die FlowNode wurde erfolgreich abgeschlossen.
 * @property {'TERMINATED'} TERMINATED - Die Ausführung der FlowNode wurde abgebrochen.
 */
export type FlowNodeState =
    | 'ACTIVE' // Die FlowNode wird derzeit ausgeführt.
    | 'COMPLETED' // Die FlowNode wurde erfolgreich abgeschlossen.
    | 'TERMINATED'; // Die Ausführung der FlowNode wurde abgebrochen.

/**
 * Definiert die möglichen Typen von FlowNodes in einer Prozess-Engine.
 *
 * @typedef {'UNSPECIFIED' | 'PROCESS' | 'SUB_PROCESS' | 'EVENT_SUB_PROCESS' | 'START_EVENT' |
 * 'INTERMEDIATE_CATCH_EVENT' | 'INTERMEDIATE_THROW_EVENT' | 'BOUNDARY_EVENT' | 'END_EVENT' |
 * 'SERVICE_TASK' | 'RECEIVE_TASK' | 'USER_TASK' | 'MANUAL_TASK' | 'TASK' | 'EXCLUSIVE_GATEWAY' |
 * 'INCLUSIVE_GATEWAY' | 'PARALLEL_GATEWAY' | 'EVENT_BASED_GATEWAY' | 'SEQUENCE_FLOW' |
 * 'MULTI_INSTANCE_BODY' | 'CALL_ACTIVITY' | 'BUSINESS_RULE_TASK' | 'SCRIPT_TASK' |
 * 'SEND_TASK' | 'UNKNOWN'} FlowNodeType
 *
 * @property {'UNSPECIFIED'} UNSPECIFIED - Typ ist nicht definiert.
 * @property {'PROCESS'} PROCESS - Repräsentiert einen gesamten Prozess.
 * @property {'SUB_PROCESS'} SUB_PROCESS - Ein Subprozess, der Teil eines Hauptprozesses ist.
 * @property {'EVENT_SUB_PROCESS'} EVENT_SUB_PROCESS - Ein Subprozess, der durch ein Ereignis gestartet wird.
 * @property {'START_EVENT'} START_EVENT - Start-Ereignis einer FlowNode oder eines Prozesses.
 * @property {'INTERMEDIATE_CATCH_EVENT'} INTERMEDIATE_CATCH_EVENT - Zwischen-Ereignis, das auf eine Bedingung wartet.
 * @property {'INTERMEDIATE_THROW_EVENT'} INTERMEDIATE_THROW_EVENT - Zwischen-Ereignis, das ein Ereignis auslöst.
 * @property {'BOUNDARY_EVENT'} BOUNDARY_EVENT - Ereignis, das an eine Aktivität gebunden ist.
 * @property {'END_EVENT'} END_EVENT - End-Ereignis, das einen Prozess abschließt.
 * @property {'SERVICE_TASK'} SERVICE_TASK - Automatische Task, die Dienste aufruft.
 * @property {'RECEIVE_TASK'} RECEIVE_TASK - Task, die auf eine Nachricht wartet.
 * @property {'USER_TASK'} USER_TASK - Task, die von einem Benutzer ausgeführt wird.
 * @property {'MANUAL_TASK'} MANUAL_TASK - Manuelle Task, die außerhalb des Systems erfolgt.
 * @property {'TASK'} TASK - Generische Task ohne spezielle Definition.
 * @property {'EXCLUSIVE_GATEWAY'} EXCLUSIVE_GATEWAY - Exklusives Gateway für Flow-Kontrolle.
 * @property {'INCLUSIVE_GATEWAY'} INCLUSIVE_GATEWAY - Inklusives Gateway für Flow-Kontrolle.
 * @property {'PARALLEL_GATEWAY'} PARALLEL_GATEWAY - Paralleles Gateway für gleichzeitige Flows.
 * @property {'EVENT_BASED_GATEWAY'} EVENT_BASED_GATEWAY - Gateway, das auf ein Ereignis reagiert.
 * @property {'SEQUENCE_FLOW'} SEQUENCE_FLOW - Verbindung zwischen zwei FlowNodes.
 * @property {'MULTI_INSTANCE_BODY'} MULTI_INSTANCE_BODY - Multinstanz-Körper für parallele Ausführungen.
 * @property {'CALL_ACTIVITY'} CALL_ACTIVITY - Aufruf eines anderen Prozesses oder einer Aktivität.
 * @property {'BUSINESS_RULE_TASK'} BUSINESS_RULE_TASK - Task für Geschäftsregeln.
 * @property {'SCRIPT_TASK'} SCRIPT_TASK - Task, die ein Skript ausführt.
 * @property {'SEND_TASK'} SEND_TASK - Task, die eine Nachricht sendet.
 * @property {'UNKNOWN'} UNKNOWN - Der Typ der FlowNode ist nicht bekannt.
 */
export type FlowNodeType =
    | 'UNSPECIFIED' // Typ ist nicht definiert.
    | 'PROCESS' // Repräsentiert einen gesamten Prozess.
    | 'SUB_PROCESS' // Ein Subprozess, der Teil eines Hauptprozesses ist.
    | 'EVENT_SUB_PROCESS' // Ein Subprozess, der durch ein Ereignis gestartet wird.
    | 'START_EVENT' // Start-Ereignis einer FlowNode oder eines Prozesses.
    | 'INTERMEDIATE_CATCH_EVENT' // Zwischen-Ereignis, das auf eine Bedingung wartet.
    | 'INTERMEDIATE_THROW_EVENT' // Zwischen-Ereignis, das ein Ereignis auslöst.
    | 'BOUNDARY_EVENT' // Ereignis, das an eine Aktivität gebunden ist.
    | 'END_EVENT' // End-Ereignis, das einen Prozess abschließt.
    | 'SERVICE_TASK' // Automatische Task, die Dienste aufruft.
    | 'RECEIVE_TASK' // Task, die auf eine Nachricht wartet.
    | 'USER_TASK' // Task, die von einem Benutzer ausgeführt wird.
    | 'MANUAL_TASK' // Manuelle Task, die außerhalb des Systems erfolgt.
    | 'TASK' // Generische Task ohne spezielle Definition.
    | 'EXCLUSIVE_GATEWAY' // Exklusives Gateway für Flow-Kontrolle.
    | 'INCLUSIVE_GATEWAY' // Inklusives Gateway für Flow-Kontrolle.
    | 'PARALLEL_GATEWAY' // Paralleles Gateway für gleichzeitige Flows.
    | 'EVENT_BASED_GATEWAY' // Gateway, das auf ein Ereignis reagiert.
    | 'SEQUENCE_FLOW' // Verbindung zwischen zwei FlowNodes.
    | 'MULTI_INSTANCE_BODY' // Multinstanz-Körper für parallele Ausführungen.
    | 'CALL_ACTIVITY' // Aufruf eines anderen Prozesses oder einer Aktivität.
    | 'BUSINESS_RULE_TASK' // Task für Geschäftsregeln.
    | 'SCRIPT_TASK' // Task, die ein Skript ausführt.
    | 'SEND_TASK' // Task, die eine Nachricht sendet.
    | 'UNKNOWN'; // Der Typ der FlowNode ist nicht bekannt.

/**
 * @file flownode.type.ts
 * @description Typdefinitionen für FlowNode-Instanzen und deren Attribute in einer Prozess-Engine.
 */

/**
 * Beschreibt die Struktur einer FlowNode-Instanz innerhalb einer Prozessinstanz.
 *
 * @typedef {Object} FlowNode
 * @property {number} key - Eindeutige ID der FlowNode-Instanz.
 * @property {number} processInstanceKey - Der Schlüssel der zugehörigen Prozessinstanz.
 * @property {number} processDefinitionKey - Der Schlüssel der Prozessdefinition.
 * @property {string} startDate - Startzeitpunkt der FlowNode im ISO-Format. Beispiel: "2025-01-01T12:00:00Z".
 * @property {string} endDate - Endzeitpunkt der FlowNode im ISO-Format. Beispiel: "2025-01-01T12:10:00Z".
 * @property {string} flowNodeId - Eindeutige ID der FlowNode.
 * @property {string} flowNodeName - Name der FlowNode.
 * @property {number} [incidentKey] - Schlüssel des zugehörigen Incidents, falls vorhanden.
 * @property {FlowNodeType} type - Typ der FlowNode, z. B. "User Task" oder "Service Task".
 * @property {FlowNodeState} state - Zustand der FlowNode, z. B. "ACTIVE" oder "COMPLETED".
 * @property {boolean} [incident] - Gibt an, ob ein Incident mit dieser FlowNode verknüpft ist.
 *  - `true`: Es existiert ein Incident.
 *  - `false`: Kein Incident vorhanden.
 * @property {string} [tenantId] - Mandanten-ID, falls die FlowNode mandantenabhängig ist.
 */
export type FlowNode = {
    /**
     * Eindeutige ID der FlowNode-Instanz.
     */
    key: number;

    /**
     * Der Schlüssel der zugehörigen Prozessinstanz.
     */
    processInstanceKey: number;

    /**
     * Der Schlüssel der Prozessdefinition.
     */
    processDefinitionKey: number;

    /**
     * Startzeitpunkt der FlowNode im ISO-Format.
     * Beispiel: "2025-01-01T12:00:00Z".
     */
    startDate: string;

    /**
     * Endzeitpunkt der FlowNode im ISO-Format.
     * Beispiel: "2025-01-01T12:10:00Z".
     */
    endDate: string;

    /**
     * Eindeutige ID der FlowNode.
     */
    flowNodeId: string;

    /**
     * Name der FlowNode.
     */
    flowNodeName: string;

    /**
     * Schlüssel des zugehörigen Incidents, falls vorhanden.
     */
    incidentKey?: number;

    /**
     * Typ der FlowNode, z. B. "User Task" oder "Service Task".
     */
    type: FlowNodeType;

    /**
     * Zustand der FlowNode, z. B. "ACTIVE" oder "COMPLETED".
     */
    state: FlowNodeState;

    /**
     * Gibt an, ob ein Incident mit dieser FlowNode verknüpft ist.
     * - `true`: Es existiert ein Incident.
     * - `false`: Kein Incident vorhanden.
     */
    incident?: boolean;

    /**
     * Mandanten-ID, falls die FlowNode mandantenabhängig ist.
     */
    tenantId?: string;
};
