[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [camunda/types/input-filter/process-definition-filter](../README.md) / ProcessDefinitionFilter

# Type Alias: ProcessDefinitionFilter

> **ProcessDefinitionFilter**: [`BaseFilter`](../../base-filter/type-aliases/BaseFilter.md) & `object`

Defined in: [src/camunda/types/input-filter/process-definition-filter.ts:10](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/camunda/types/input-filter/process-definition-filter.ts#L10)

Erweiterter Filter für die Suche nach Prozessdefinitionen.

## Type declaration

### bpmnProcessId?

> `optional` **bpmnProcessId**: `string`

BPMN-Prozess-ID, die der Prozessdefinition zugeordnet ist.
Beispiel: "order_process".

### name?

> `optional` **name**: `string`

Name der Prozessdefinition.
Beispiel: "Bestellprozess".

### tenantId?

> `optional` **tenantId**: `string`

Tenant-ID für Multi-Tenancy-Filter.
Wird verwendet, um nur Prozessdefinitionen eines bestimmten Tenants zu durchsuchen.

### version?

> `optional` **version**: `number`

Version der Prozessdefinition.

### versionTag?

> `optional` **versionTag**: `string`

Versionstag der Prozessdefinition.
Beispiel: "v1.0" oder "Release-2025".