[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/types/flownode.type](../README.md) / FlowNode

# Type Alias: FlowNode

> **FlowNode**: `object`

Defined in: [src/camunda/types/flownode.type.ts:107](https://github.com/FlowCraft-AG/RoleMapper/blob/5b9ee56819f4990f54c16dcad37384ac73c1551c/backend/src/camunda/types/flownode.type.ts#L107)

Beschreibt die Struktur einer FlowNode-Instanz innerhalb einer Prozessinstanz.

## Type declaration

### endDate

> **endDate**: `string`

Endzeitpunkt der FlowNode im ISO-Format.
Beispiel: "2025-01-01T12:10:00Z".

### flowNodeId

> **flowNodeId**: `string`

Eindeutige ID der FlowNode.

### flowNodeName

> **flowNodeName**: `string`

Name der FlowNode.

### incident?

> `optional` **incident**: `boolean`

Gibt an, ob ein Incident mit dieser FlowNode verknüpft ist.
- `true`: Es existiert ein Incident.
- `false`: Kein Incident vorhanden.

### incidentKey?

> `optional` **incidentKey**: `number`

Schlüssel des zugehörigen Incidents, falls vorhanden.

### key

> **key**: `number`

Eindeutige ID der FlowNode-Instanz.

### processDefinitionKey

> **processDefinitionKey**: `number`

Der Schlüssel der Prozessdefinition.

### processInstanceKey

> **processInstanceKey**: `number`

Der Schlüssel der zugehörigen Prozessinstanz.

### startDate

> **startDate**: `string`

Startzeitpunkt der FlowNode im ISO-Format.
Beispiel: "2025-01-01T12:00:00Z".

### state

> **state**: [`FlowNodeState`](FlowNodeState.md)

Zustand der FlowNode, z. B. "ACTIVE" oder "COMPLETED".

### tenantId?

> `optional` **tenantId**: `string`

Mandanten-ID, falls die FlowNode mandantenabhängig ist.

### type

> **type**: [`FlowNodeType`](FlowNodeType.md)

Typ der FlowNode, z. B. "User Task" oder "Service Task".
