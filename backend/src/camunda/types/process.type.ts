/*******************************************************************************************************************************************************
 * T Y P E N    F Ü R    C A M U N D A - P R O Z E S S E    U N D    A U F G A B E N
 ****************************************************************************************************************************************************/
// Typen für Prozessdetails
export type ProcessInstance = {
    key: string; // Eindeutiger Schlüssel der Prozessinstanz
    processVersion: number; // Version des Prozesses
    bpmnProcessId: string; // BPMN-Prozess-ID
    startDate: string; // Startdatum der Instanz
    state: string; // Zustand der Prozessinstanz (z. B. "ACTIVE")
    incident: false; // Gibt an, ob ein Vorfall vorliegt
    processDefinitionKey: string; // Schlüssel der Prozessdefinition
    tenantId: string; // Mandanten-ID (kann leer sein)
};

// Typen für Prozessvariablen
export type ProcessVariable = {
    key: number; // Schlüssel der Variablen
    processInstanceKey: number; // Schlüssel der zugehörigen Prozessinstanz
    scopeKey: number; // Schlüssel des Geltungsbereichs
    name: string; // Name der Variablen
    value: string; // Wert der Variablen
    truncated: boolean; // Gibt an, ob der Wert abgeschnitten wurde
    tenantId: string; // Mandanten-ID (kann leer sein)
};

export type Task = {
    id: string; // Eindeutige ID der Aufgabe
    name: string; // Name der Aufgabe
    taskDefinitionId: string; // ID der Aufgaben-Definition
    processName: string; // Name des zugehörigen Prozesses
    creationDate: string; // Erstellungsdatum der Aufgabe
    completionDate: string | null; // Abschlussdatum (null, wenn noch offen)
    assignee: string | null; // Benutzer, der die Aufgabe zugewiesen bekommen hat
    taskState: 'CREATED' | 'COMPLETED' | 'CANCELED' | 'FAILED'; // Zustand der Aufgabe
    formKey: string | null; // Schlüssel des Formulars (wenn zugewiesen)
    formId: string | null; // ID des zugehörigen Formulars
    formVersion: number | null; // Version des Formulars
    isFormEmbedded: boolean; // Gibt an, ob das Formular eingebettet ist
    processDefinitionKey: string; // Schlüssel der Prozessdefinition
    processInstanceKey: string; // Schlüssel der Prozessinstanz
    tenantId: string; // Mandanten-ID (kann leer sein)
    dueDate: string | null; // Fälligkeitsdatum der Aufgabe (null, wenn nicht festgelegt)
    followUpDate: string | null; // Datum für Nachverfolgung (null, wenn nicht festgelegt)
    candidateGroups: string[] | null; // Kandidatengruppen für die Aufgabe
    candidateUsers: string[] | null; // Kandidatenbenutzer für die Aufgabe
    variables?: TaskVariable[]; // Variablen der Aufgabe
    implementation?: 'JOB_WORKER' | 'ZEEBE_USER_TASK'; // Typ der Implementierung
    priority: number; // Priorität der Aufgabe
};

type TaskVariable = {
    name: string; // Name der Variablen
    value: string | number | boolean | null; // Wert der Variablen
    type: 'String' | 'Integer' | 'Boolean' | 'Double' | 'Object'; // Typ der Variablen
};
