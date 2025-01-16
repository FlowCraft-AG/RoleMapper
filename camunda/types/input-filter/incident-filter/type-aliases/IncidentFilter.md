[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [camunda/types/input-filter/incident-filter](../README.md) / IncidentFilter

# Type Alias: IncidentFilter

> **IncidentFilter**: [`BaseFilter`](../../base-filter/type-aliases/BaseFilter.md) & `object`

Defined in: [src/camunda/types/input-filter/incident-filter.ts:17](https://github.com/FlowCraft-AG/RoleMapper/blob/5b9ee56819f4990f54c16dcad37384ac73c1551c/backend/src/camunda/types/input-filter/incident-filter.ts#L17)

Erweiterter Filter für die Suche nach Incidents in Camunda.

## Type declaration

### jobKey?

> `optional` **jobKey**: `string`

Schlüssel des zugehörigen Jobs.

### processDefinitionKey?

> `optional` **processDefinitionKey**: `string`

Schlüssel der zugehörigen Prozessdefinition.

### processInstanceKey?

> `optional` **processInstanceKey**: `string`

Schlüssel der zugehörigen Prozessinstanz.

### state?

> `optional` **state**: [`IncidentState`](IncidentState.md)

Zustand des Incidents.
