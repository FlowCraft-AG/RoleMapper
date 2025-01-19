/**
 * Typ für eine Camunda-Prozessinstanz.
 * Repräsentiert eine einzelne Instanz eines Prozesses, einschließlich Status, Startdatum und zugehöriger Metadaten.
 */
export type ProcessInstance = {
    /**
     * Eindeutiger Schlüssel der Prozessinstanz.
     * Wird verwendet, um die Instanz eindeutig zu identifizieren.
     */
    key: string;

    name?: string;

    /**
     * Version des zugehörigen Prozesses.
     * Beispiel: `1` oder `42` (abhängig von der Prozessdefinition).
     */
    processVersion: number;

    /**
     * BPMN-Prozess-ID, wie in der Prozessdefinition angegeben.
     */
    bpmnProcessId: string;

    /**
     * ISO-Datum/Zeit des Starts der Prozessinstanz.
     * Beispiel: `"2025-01-01T12:00:00Z"`.
     */
    startDate: string;

    /**
     * Zustand der Prozessinstanz.
     * Mögliche Werte: `ACTIVE`, `COMPLETED`, `CANCELED`, etc.
     */
    state: string;

    /**
     * Gibt an, ob ein Incident (Vorfall) in der Instanz aufgetreten ist.
     */
    incident: false;

    /**
     * Schlüssel der zugehörigen Prozessdefinition.
     */
    processDefinitionKey: string;

    /**
     * Tenant-ID für Multi-Tenancy-Unterstützung.
     * Kann leer sein, wenn keine Multi-Tenancy verwendet wird.
     */
    tenantId: string;
};
