/**
 * Typdefinition für einen Prozess (Process).
 * Beschreibt die Eigenschaften eines Prozesses im System.
 */
export type Process = {
  _id: string; // Eindeutige ID des Prozesses
  name: string; // Name des Prozesses
  parentId?: string; // Optionale ID des übergeordneten Prozesses
  roles?: Role[]; // Optionale Liste von Rollen, die mit dem Prozess verknüpft sind
  processId?: string; // Optionale Prozesskennung (z. B. für spezielle Prozesse)
  children?: Process[]; // Optionale Liste von untergeordneten Prozessen (rekursiv)
};

/**
 * Typdefinition für eine Rolle (Role), die mit einem Prozess verknüpft ist.
 */
export type Role = {
  roleName: string; // Name der Rolle
  roleId: string; // ID der Rolle
};

/**
 * Typdefinition für einen vereinfachten Prozess (ShortProcess).
 * Wird verwendet, wenn nur grundlegende Informationen eines Prozesses benötigt werden.
 */
export type ShortProcess = {
  _id: string; // Eindeutige ID des Prozesses
  name: string; // Name des Prozesses
  parentId: string | undefined; // ID des übergeordneten Prozesses oder undefined
};

/*******************************************************************************************************************************************************
 * T Y P E N    F Ü R    C A M U N D A - P R O Z E S S E    U N D    A U F G A B E N
 ****************************************************************************************************************************************************/
// Typen für Prozessdetails
export interface ProcessInstance {
  key: string; // Eindeutiger Schlüssel der Prozessinstanz
  processVersion: number; // Version des Prozesses
  bpmnProcessId: string; // BPMN-Prozess-ID
  startDate: string; // Startdatum der Instanz
  state: string; // Zustand der Prozessinstanz (z. B. "ACTIVE")
  incident: false; // Gibt an, ob ein Vorfall vorliegt
  processDefinitionKey: string; // Schlüssel der Prozessdefinition
  tenantId: string; // Mandanten-ID (kann leer sein)
}

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

export type ProcessTask = {
  id: string; // Eindeutige ID der Aufgabe
  name: string; // Name der Aufgabe
  taskDefinitionId: string; // ID der Aufgaben-Definition
  processName: string; // Name des zugehörigen Prozesses
  creationDate: string; // Erstellungsdatum der Aufgabe
  completionDate: string | null; // Abschlussdatum (null, wenn noch offen)
  assignee: string | null; // Benutzer, der die Aufgabe zugewiesen bekommen hat
  taskState: string; // Zustand der Aufgabe (z. B. "CREATED")
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
  implementation: string; // Implementierungstyp (z. B. "userTask")
  priority: number; // Priorität der Aufgabe
};

// Enums für Statuswerte
export enum TaskState {
  CREATED = 'CREATED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
}

// Hilfsfunktion zur Prüfung, ob eine Aufgabe abgeschlossen ist
export const isTaskCompleted = (task: ProcessTask): boolean =>
  task.assignee !== null && task.taskState === TaskState.COMPLETED;
