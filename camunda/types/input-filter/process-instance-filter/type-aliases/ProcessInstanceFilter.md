[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [camunda/types/input-filter/process-instance-filter](../README.md) / ProcessInstanceFilter

# Type Alias: ProcessInstanceFilter

> **ProcessInstanceFilter**: [`BaseFilter`](../../base-filter/type-aliases/BaseFilter.md) & `object`

Defined in: [src/camunda/types/input-filter/process-instance-filter.ts:10](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/camunda/types/input-filter/process-instance-filter.ts#L10)

Erweiterter Filter für die Suche nach Prozessinstanzen.

## Type declaration

### bpmnProcessId?

> `optional` **bpmnProcessId**: `string`

BPMN-Prozess-ID, die mit der Instanz verknüpft ist.

### endDate?

> `optional` **endDate**: `string`

Enddatum der Prozessinstanz.

### incident?

> `optional` **incident**: `boolean`

Gibt an, ob ein Incident mit der Prozessinstanz verknüpft ist.

### parentKey?

> `optional` **parentKey**: `number`

Schlüssel der übergeordneten Prozessinstanz.

### processVersion?

> `optional` **processVersion**: `number`

Version der Prozessinstanz.

### processVersionTag?

> `optional` **processVersionTag**: `string`

Versionstag der Prozessinstanz.

### startDate?

> `optional` **startDate**: `string`

Startdatum der Prozessinstanz.

### state?

> `optional` **state**: `"ACTIVE"` \| `"COMPLETED"` \| `"CANCELED"`

Status der Prozessinstanz.
Mögliche Werte: `ACTIVE`, `COMPLETED`, `CANCELED`.
