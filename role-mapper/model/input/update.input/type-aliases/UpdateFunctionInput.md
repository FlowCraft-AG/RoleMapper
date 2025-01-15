[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/update.input](../README.md) / UpdateFunctionInput

# Type Alias: UpdateFunctionInput

> **UpdateFunctionInput**: `object`

Defined in: [src/role-mapper/model/input/update.input.ts:121](https://github.com/FlowCraft-AG/RoleMapper/blob/dfa0426eb5b55e53274c22382030e399befc29aa/backend/src/role-mapper/model/input/update.input.ts#L121)

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
