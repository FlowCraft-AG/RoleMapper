[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/update.input](../README.md) / UpdateProcessInput

# Type Alias: UpdateProcessInput

> **UpdateProcessInput**: `object`

Defined in: [src/role-mapper/model/input/update.input.ts:154](https://github.com/FlowCraft-AG/RoleMapper/blob/2e49de298fb7aea6638be4e21aef4b51c0753b47/backend/src/role-mapper/model/input/update.input.ts#L154)

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
