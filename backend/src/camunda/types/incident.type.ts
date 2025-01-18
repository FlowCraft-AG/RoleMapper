/**
 * @file incident.type.ts
 * @description Typdefinitionen für Incidents und Incident-Typen in Camunda.
 */

/**
 * Definiert die möglichen Typen von Incidents.
 *
 * @typedef {'UNSPECIFIED' | 'UNKNOWN' | 'IO_MAPPING_ERROR' | 'JOB_NO_RETRIES' | 'EXECUTION_LISTENER_NO_RETRIES' |
 * 'CONDITION_ERROR' | 'EXTRACT_VALUE_ERROR' | 'CALLED_ELEMENT_ERROR' | 'UNHANDLED_ERROR_EVENT' |
 * 'MESSAGE_SIZE_EXCEEDED' | 'CALLED_DECISION_ERROR' | 'DECISION_EVALUATION_ERROR' | 'FORM_NOT_FOUND'} IncidentType
 *
 * @property {'UNSPECIFIED'} UNSPECIFIED - Nicht spezifizierter Incident-Typ.
 * @property {'UNKNOWN'} UNKNOWN - Unbekannter Incident-Typ.
 * @property {'IO_MAPPING_ERROR'} IO_MAPPING_ERROR - Fehler in der IO-Zuordnung.
 * @property {'JOB_NO_RETRIES'} JOB_NO_RETRIES - Job hat keine weiteren Wiederholungen.
 * @property {'EXECUTION_LISTENER_NO_RETRIES'} EXECUTION_LISTENER_NO_RETRIES - Listener hat keine weiteren Wiederholungen.
 * @property {'CONDITION_ERROR'} CONDITION_ERROR - Fehler in einer Bedingung.
 * @property {'EXTRACT_VALUE_ERROR'} EXTRACT_VALUE_ERROR - Fehler beim Extrahieren eines Wertes.
 * @property {'CALLED_ELEMENT_ERROR'} CALLED_ELEMENT_ERROR - Fehler in einem aufgerufenen Element.
 * @property {'UNHANDLED_ERROR_EVENT'} UNHANDLED_ERROR_EVENT - Nicht behandeltes Fehler-Ereignis.
 * @property {'MESSAGE_SIZE_EXCEEDED'} MESSAGE_SIZE_EXCEEDED - Nachrichtengröße überschritten.
 * @property {'CALLED_DECISION_ERROR'} CALLED_DECISION_ERROR - Fehler in einer aufgerufenen Entscheidung.
 * @property {'DECISION_EVALUATION_ERROR'} DECISION_EVALUATION_ERROR - Fehler bei der Entscheidungsauswertung.
 * @property {'FORM_NOT_FOUND'} FORM_NOT_FOUND - Formular nicht gefunden.
 */
export type IncidentType =
    | 'UNSPECIFIED'
    | 'UNKNOWN'
    | 'IO_MAPPING_ERROR'
    | 'JOB_NO_RETRIES'
    | 'EXECUTION_LISTENER_NO_RETRIES'
    | 'CONDITION_ERROR'
    | 'EXTRACT_VALUE_ERROR'
    | 'CALLED_ELEMENT_ERROR'
    | 'UNHANDLED_ERROR_EVENT'
    | 'MESSAGE_SIZE_EXCEEDED'
    | 'CALLED_DECISION_ERROR'
    | 'DECISION_EVALUATION_ERROR'
    | 'FORM_NOT_FOUND';

/**
 * Beschreibt die Struktur eines Incident-Objekts.
 *
 * @typedef {Object} Incident
 * @property {number} key - Eindeutige ID des Incidents.
 * @property {number} processDefinitionKey - Prozessdefinitions-Schlüssel.
 * @property {number} processInstanceKey - Prozessinstanz-Schlüssel.
 * @property {IncidentType} type - Typ des Incidents.
 * @property {string} message - Nachricht des Incidents.
 * @property {string} creationTime - Erstellungszeit des Incidents im ISO-Format.
 * @property {IncidentType} state - Status des Incidents.
 * @property {number} jobKey - Schlüssel des zugehörigen Jobs.
 * @property {string} [tenantId] - Optionale Mandanten-ID.
 */
export type Incident = {
    key: number; // Eindeutige ID des Incidents
    processDefinitionKey: number; // Prozessdefinitions-Schlüssel
    processInstanceKey: number; // Prozessinstanz-Schlüssel
    type: IncidentType; // Typ des Incidents
    message: string; // Nachricht des Incidents
    creationTime: string; // Erstellungszeit des Incidents im ISO-Format
    state: IncidentType; // Status des Incidents
    jobKey: number; // Schlüssel des zugehörigen Jobs
    tenantId?: string; // Optionale Mandanten-ID
};
