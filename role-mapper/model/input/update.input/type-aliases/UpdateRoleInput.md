[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/update.input](../README.md) / UpdateRoleInput

# Type Alias: UpdateRoleInput

> **UpdateRoleInput**: `object`

Defined in: [src/role-mapper/model/input/update.input.ts:213](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/role-mapper/model/input/update.input.ts#L213)

Eingabetyp für die Aktualisierung von Rollen.

## Type declaration

### name?

> `optional` **name**: `string`

Der Name der Rolle.

### query?

> `optional` **query**: [`QueryStageInput`](../../query-stage.input/type-aliases/QueryStageInput.md)[]

Die gespeicherte Abfrage für die Rolle.

### roleId

> **roleId**: `string`

Die ID der Rolle.
