[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/update.input](../README.md) / UpdateOrgUnitInput

# Type Alias: UpdateOrgUnitInput

> **UpdateOrgUnitInput**: `object`

Defined in: [src/role-mapper/model/input/update.input.ts:180](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/model/input/update.input.ts#L180)

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
