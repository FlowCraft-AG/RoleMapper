[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/types/incident.type](../README.md) / Incident

# Type Alias: Incident

> **Incident**: `object`

Defined in: [src/camunda/types/incident.type.ts:56](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/camunda/types/incident.type.ts#L56)

Beschreibt die Struktur eines Incident-Objekts.

## Type declaration

### creationTime

> **creationTime**: `string`

### jobKey

> **jobKey**: `number`

### key

> **key**: `number`

### message

> **message**: `string`

### processDefinitionKey

> **processDefinitionKey**: `number`

### processInstanceKey

> **processInstanceKey**: `number`

### state

> **state**: [`IncidentType`](IncidentType.md)

### tenantId?

> `optional` **tenantId**: `string`

### type

> **type**: [`IncidentType`](IncidentType.md)