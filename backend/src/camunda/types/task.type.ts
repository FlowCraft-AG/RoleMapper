/**
 * Typ für eine Aufgabe in Camunda.
 * Beschreibt eine Benutzeraufgabe, einschließlich Status, zugewiesenem Benutzer und weiteren Metadaten.
 */
export type Task = {
    /**
     * Eindeutige ID der Aufgabe.
     */
    id: string;

    /**
     * Name der Aufgabe.
     * Beispiel: `"Genehmigung prüfen"` oder `"Dokument freigeben"`.
     */
    name: string;

    /**
     * ID der Aufgaben-Definition aus dem BPMN-Modell.
     */
    taskDefinitionId: string;

    /**
     * Name des zugehörigen Prozesses.
     * Beispiel: `"Bestellprozess"` oder `"Reisekostenprozess"`.
     */
    processName: string;

    /**
     * ISO-Datum/Zeit der Erstellung der Aufgabe.
     * Beispiel: `"2025-01-01T12:00:00Z"`.
     */
    creationDate: string;

    /**
     * ISO-Datum/Zeit des Abschlusses der Aufgabe.
     * Null, wenn die Aufgabe noch nicht abgeschlossen ist.
     */
    completionDate: string | undefined;

    /**
     * Benutzername oder ID des Benutzers, dem die Aufgabe zugewiesen wurde.
     * Null, wenn die Aufgabe nicht zugewiesen ist.
     */
    assignee: string | undefined;

    /**
     * Zustand der Aufgabe.
     * Mögliche Werte:
     * - `CREATED`: Die Aufgabe wurde erstellt.
     * - `COMPLETED`: Die Aufgabe wurde abgeschlossen.
     * - `CANCELED`: Die Aufgabe wurde abgebrochen.
     * - `FAILED`: Die Aufgabe ist fehlgeschlagen.
     */
    taskState: 'CREATED' | 'COMPLETED' | 'CANCELED' | 'FAILED';

    /**
     * Schlüssel des Formulars, das der Aufgabe zugeordnet ist.
     * Null, wenn kein Formular vorhanden ist.
     */
    formKey: string | undefined;

    /**
     * ID des Formulars, das mit der Aufgabe verknüpft ist.
     * Null, wenn kein Formular vorhanden ist.
     */
    formId: string | undefined;

    /**
     * Version des Formulars, das mit der Aufgabe verknüpft ist.
     * Null, wenn kein Formular vorhanden ist.
     */
    formVersion: number | undefined;

    /**
     * Gibt an, ob das Formular für die Aufgabe eingebettet ist.
     */
    isFormEmbedded: boolean;

    /**
     * Schlüssel der zugehörigen Prozessdefinition.
     */
    processDefinitionKey: string;

    /**
     * Schlüssel der zugehörigen Prozessinstanz.
     */
    processInstanceKey: string;

    /**
     * Tenant-ID der Aufgabe.
     * Kann leer sein, wenn keine Multi-Tenancy verwendet wird.
     */
    tenantId: string;

    /**
     * Fälligkeitsdatum der Aufgabe (ISO-Format).
     * Null, wenn kein Fälligkeitsdatum festgelegt wurde.
     */
    dueDate: string | undefined;

    /**
     * Datum für Nachverfolgung der Aufgabe (ISO-Format).
     * Null, wenn kein Datum festgelegt wurde.
     */
    followUpDate: string | undefined;

    /**
     * Liste der Kandidatengruppen, die für die Aufgabe zuständig sind.
     * Null, wenn keine Kandidatengruppen festgelegt sind.
     */
    candidateGroups: string[] | undefined;

    /**
     * Liste der Kandidatenbenutzer, die für die Aufgabe zuständig sind.
     * Null, wenn keine Kandidatenbenutzer festgelegt sind.
     */
    candidateUsers: string[] | undefined;

    /**
     * Implementierungstyp der Aufgabe.
     * Mögliche Werte:
     * - `JOB_WORKER`
     * - `ZEEBE_USER_TASK`
     */
    implementation?: 'JOB_WORKER' | 'ZEEBE_USER_TASK';

    /**
     * Priorität der Aufgabe.
     * Höhere Werte bedeuten eine höhere Priorität.
     * Beispiel: `100` für höchste Priorität.
     */
    priority: number;
};
