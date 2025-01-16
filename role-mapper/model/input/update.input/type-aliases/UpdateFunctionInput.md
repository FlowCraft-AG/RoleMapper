[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/update.input](../README.md) / UpdateFunctionInput

# Type Alias: UpdateFunctionInput

> **UpdateFunctionInput**: `object`

Defined in: [src/role-mapper/model/input/update.input.ts:121](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/role-mapper/model/input/update.input.ts#L121)

Eingabetyp für die Aktualisierung von Funktionen.

## Type declaration

### functionName

> **functionName**: `string`

Der Name der Funktion.

### orgUnit?

> `optional` **orgUnit**: `Types.ObjectId` \| `string`

Die Organisationseinheit der Funktion.

### type?

> `optional` **type**: `string`

Der Typ der Funktion.

### users?

> `optional` **users**: `string`[]

Die Benutzer, die der Funktion zugeordnet sind.
