[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/update.input](../README.md) / UpdateProcessInput

# Type Alias: UpdateProcessInput

> **UpdateProcessInput**: `object`

Defined in: [src/role-mapper/model/input/update.input.ts:154](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/model/input/update.input.ts#L154)

Eingabetyp für die Aktualisierung von Prozessen.

## Type declaration

### name?

> `optional` **name**: `string`

Der Name des Prozesses.

### processId

> **processId**: `string`

Die ID des Prozesses.

### roles?

> `optional` **roles**: [`ProcessRoleInput`](../../create.input/type-aliases/ProcessRoleInput.md)[]

Die Rollen, die dem Prozess zugeordnet sind.
