[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/update.input](../README.md) / UpdateOrgUnitInput

# Type Alias: UpdateOrgUnitInput

> **UpdateOrgUnitInput**: `object`

Defined in: [src/role-mapper/model/input/update.input.ts:180](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/role-mapper/model/input/update.input.ts#L180)

Eingabetyp für die Aktualisierung von Organisationseinheiten.

## Type declaration

### name?

> `optional` **name**: `string`

Der Name der Organisationseinheit.

### orgUnitId

> **orgUnitId**: `string`

Die ID der Organisationseinheit.

### parentId?

> `optional` **parentId**: `Types.ObjectId` \| `string`

Die ID der übergeordneten Organisationseinheit.

### supervisor?

> `optional` **supervisor**: `Types.ObjectId` \| `string`

Der Vorgesetzte der Organisationseinheit.
