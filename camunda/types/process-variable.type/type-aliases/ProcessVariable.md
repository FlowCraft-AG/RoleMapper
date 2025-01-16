[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/types/process-variable.type](../README.md) / ProcessVariable

# Type Alias: ProcessVariable

> **ProcessVariable**: `object`

Defined in: [src/camunda/types/process-variable.type.ts:5](https://github.com/FlowCraft-AG/RoleMapper/blob/c56690d4fd1bda4e01111a8d104f8e1bd628a5f5/backend/src/camunda/types/process-variable.type.ts#L5)

Typ für eine Prozessvariable in Camunda.
Beschreibt eine einzelne Variable, die mit einer Prozessinstanz verknüpft ist.

## Type declaration

### key

> **key**: `number`

Eindeutiger Schlüssel der Variable.

### name

> **name**: `string`

Name der Variable.

### processInstanceKey

> **processInstanceKey**: `number`

Schlüssel der zugehörigen Prozessinstanz, in der die Variable definiert ist.

### scopeKey

> **scopeKey**: `number`

Schlüssel des Geltungsbereichs, in dem die Variable definiert ist.

### tenantId

> **tenantId**: `string`

Tenant-ID der Variable.
Kann leer sein, wenn Multi-Tenancy nicht aktiviert ist.

### truncated

> **truncated**: `boolean`

Gibt an, ob der Wert der Variable abgeschnitten wurde.
Beispiel: `true` für abgeschnittene Werte.

### value

> **value**: `string`

Wert der Variable.
