[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/payload/get-users.payload](../README.md) / GetUsersByFunctionResult

# Type Alias: GetUsersByFunctionResult

> **GetUsersByFunctionResult**: `object`

Defined in: [src/role-mapper/model/payload/get-users.payload.ts:12](https://github.com/FlowCraft-AG/RoleMapper/blob/55ba436164ff7e5a7c4d8ad55ac7ddffe5029190/backend/src/role-mapper/model/payload/get-users.payload.ts#L12)

Ergebnisstruktur für die Rückgabe von Benutzerdaten basierend auf einer Funktion.

## Type declaration

### functionName

> **functionName**: `string`

### isImpliciteFunction

> **isImpliciteFunction**: `boolean`

### orgUnit?

> `optional` **orgUnit**: `Types.ObjectId`

### users

> **users**: [`User`](../../../entity/user.entity/classes/User.md)[]
