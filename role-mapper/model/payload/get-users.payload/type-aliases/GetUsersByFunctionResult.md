[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/payload/get-users.payload](../README.md) / GetUsersByFunctionResult

# Type Alias: GetUsersByFunctionResult

> **GetUsersByFunctionResult**: `object`

Defined in: [src/role-mapper/model/payload/get-users.payload.ts:12](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/role-mapper/model/payload/get-users.payload.ts#L12)

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
