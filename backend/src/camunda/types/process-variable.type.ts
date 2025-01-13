/**
 * Typ für eine Prozessvariable in Camunda.
 * Beschreibt eine einzelne Variable, die mit einer Prozessinstanz verknüpft ist.
 */
export type ProcessVariable = {
    /**
     * Eindeutiger Schlüssel der Variable.
     */
    key: number;

    /**
     * Schlüssel der zugehörigen Prozessinstanz, in der die Variable definiert ist.
     */
    processInstanceKey: number;

    /**
     * Schlüssel des Geltungsbereichs, in dem die Variable definiert ist.
     */
    scopeKey: number;

    /**
     * Name der Variable.
     */
    name: string;

    /**
     * Wert der Variable.
     */
    value: string;

    /**
     * Gibt an, ob der Wert der Variable abgeschnitten wurde.
     * Beispiel: `true` für abgeschnittene Werte.
     */
    truncated: boolean;

    /**
     * Tenant-ID der Variable.
     * Kann leer sein, wenn Multi-Tenancy nicht aktiviert ist.
     */
    tenantId: string;
};
