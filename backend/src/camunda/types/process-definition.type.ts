export type ProcessDefinition = {
    key: string;

    name: string;

    bpmnProcessId: string;

    version: string;

    versionTag: string;

    /**
     * Tenant-ID für Multi-Tenancy-Unterstützung.
     * Kann leer sein, wenn keine Multi-Tenancy verwendet wird.
     */
    tenantId: string;
};
