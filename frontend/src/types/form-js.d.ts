declare module '@bpmn-io/form-js' {
  /**
   * Hauptklasse für das Arbeiten mit Formularen.
   */
  export class Form {
    /**
     * Erstellt eine neue Formularinstanz.
     * @param options - Konfigurationsoptionen wie z. B. der Container, in dem das Formular gerendert wird.
     */
    constructor(options: { container: HTMLElement });
    /**
     * Importiert ein Formularschema und rendert das Formular.
     * @param schema - Das JSON-Schema des Formulars.
     * @returns Ein Promise, das abgeschlossen wird, wenn das Schema erfolgreich importiert wurde.
     */
    importSchema(schema: object): Promise<void>;
    /**
     * Registriert einen Event-Listener.
     * @param event - Der Name des Events (z. B. `submit`).
     * @param callback - Die Callback-Funktion, die ausgeführt wird, wenn das Event ausgelöst wird.
     */
    on(event: string, callback: (event: FormSubmitEvent) => void): void;
    /**
     * Zerstört die Formularinstanz und gibt Ressourcen frei.
     */
    destroy(): void;
  }

  /**
   * Eventdaten, die bei der Übermittlung eines Formulars bereitgestellt werden.
   */
  export interface FormSubmitEvent {
    /**
     * Die eingegebenen Formulardaten.
     */
    data: Record<string, unknown>;
    /**
     * Fehler, die während der Formularübermittlung auftreten.
     */
    errors: { message: string; field: string }[];
  }
}
