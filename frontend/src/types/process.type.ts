// Typen für Aufgaben
// interface Task {
//   id: string; // Eindeutige ID der Aufgabe
//   name: string; // Name der Aufgabe
//   assignee: string | null; // Benutzer, der die Aufgabe zugewiesen bekommen hat (oder null)
// }

// Typen für Variablen
// interface Variable {
//   value: string; // Wert der Variablen
// }

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

// // Typen für Prozessinstanzen
// export interface ProcessInstance {
//   id: string; // Eindeutige ID der Prozessinstanz
//   definitionId: string; // ID der zugehörigen Prozessdefinition
//   businessKey: string; // Geschäftsschlüssel der Instanz
//   tasks: Task[]; // Liste der Aufgaben in dieser Instanz
//   variables: Record<string, Variable>; // Variablen der Instanz (als Schlüssel-Wert-Paare)
//   processDefinitionKey: string; // Schlüssel der Prozessdefinition
// }

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
