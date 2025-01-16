[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/types/process-instance.type](../README.md) / ProcessInstance

# Type Alias: ProcessInstance

> **ProcessInstance**: `object`

Defined in: [src/camunda/types/process-instance.type.ts:5](https://github.com/FlowCraft-AG/RoleMapper/blob/5b9ee56819f4990f54c16dcad37384ac73c1551c/backend/src/camunda/types/process-instance.type.ts#L5)

Typ für eine Camunda-Prozessinstanz.
Repräsentiert eine einzelne Instanz eines Prozesses, einschließlich Status, Startdatum und zugehöriger Metadaten.

## Type declaration

### bpmnProcessId

> **bpmnProcessId**: `string`

BPMN-Prozess-ID, wie in der Prozessdefinition angegeben.

### incident

> **incident**: `false`

Gibt an, ob ein Incident (Vorfall) in der Instanz aufgetreten ist.

### key

> **key**: `string`

Eindeutiger Schlüssel der Prozessinstanz.
Wird verwendet, um die Instanz eindeutig zu identifizieren.

### processDefinitionKey

> **processDefinitionKey**: `string`

Schlüssel der zugehörigen Prozessdefinition.

### processVersion

> **processVersion**: `number`

Version des zugehörigen Prozesses.
Beispiel: `1` oder `42` (abhängig von der Prozessdefinition).

### startDate

> **startDate**: `string`

ISO-Datum/Zeit des Starts der Prozessinstanz.
Beispiel: `"2025-01-01T12:00:00Z"`.

### state

> **state**: `string`

Zustand der Prozessinstanz.
Mögliche Werte: `ACTIVE`, `COMPLETED`, `CANCELED`, etc.

### tenantId

> **tenantId**: `string`

Tenant-ID für Multi-Tenancy-Unterstützung.
Kann leer sein, wenn keine Multi-Tenancy verwendet wird.
