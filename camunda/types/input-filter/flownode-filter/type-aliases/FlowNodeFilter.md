[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [camunda/types/input-filter/flownode-filter](../README.md) / FlowNodeFilter

# Type Alias: FlowNodeFilter

> **FlowNodeFilter**: [`BaseFilter`](../../base-filter/type-aliases/BaseFilter.md) & `object`

Defined in: [src/camunda/types/input-filter/flownode-filter.ts:26](https://github.com/FlowCraft-AG/RoleMapper/blob/da8087f9c63e7aa49e7a655f3f13ecbe5687d6eb/backend/src/camunda/types/input-filter/flownode-filter.ts#L26)

## Type declaration

### endDate?

> `optional` **endDate**: `string`

Das Enddatum für die Suche (im ISO-Format, z. B. "2025-01-31T23:59:59Z").
Nur FlowNodes, die vor diesem Datum beendet wurden, werden berücksichtigt.

### flowNodeId?

> `optional` **flowNodeId**: `string`

Die eindeutige ID der FlowNode.
Wird verwendet, um nach einer spezifischen FlowNode zu suchen.

### flowNodeName?

> `optional` **flowNodeName**: `string`

Der Name der FlowNode.
Ermöglicht die Filterung nach FlowNodes mit einem bestimmten Namen.

### incident?

> `optional` **incident**: `boolean`

Gibt an, ob ein Incident für diese FlowNode existiert.
- `true`: Nur FlowNodes mit Incidents.
- `false`: Nur FlowNodes ohne Incidents.

### incidentKey?

> `optional` **incidentKey**: `number`

Der Schlüssel des zugehörigen Incidents.
Filtert FlowNodes basierend auf Incidents, die ihnen zugeordnet sind.

### processDefinitionKey?

> `optional` **processDefinitionKey**: `number`

Der Schlüssel der Prozessdefinition.
Filtert FlowNodes basierend auf ihrer Definition.

### processInstanceKey?

> `optional` **processInstanceKey**: `number`

Der Schlüssel der zugehörigen Prozessinstanz.
Wird verwendet, um FlowNodes einer bestimmten Instanz zu filtern.

### startDate?

> `optional` **startDate**: `string`

Das Startdatum für die Suche (im ISO-Format, z. B. "2025-01-01T00:00:00Z").
Nur FlowNodes, die nach diesem Datum gestartet wurden, werden berücksichtigt.

### state?

> `optional` **state**: [`FlowNodeState`](../../../flownode.type/type-aliases/FlowNodeState.md)

Der Zustand der FlowNode.
Mögliche Zustände sind z. B. "ACTIVE", "COMPLETED", "CANCELED".

### type?

> `optional` **type**: [`FlowNodeType`](../../../flownode.type/type-aliases/FlowNodeType.md)

Der Typ der FlowNode.
Z. B. "User Task", "Service Task", "Gateway".

## Description

Definiert die möglichen Filteroptionen für die Suche nach FlowNode-Instanzen in einer Prozess-Engine.
