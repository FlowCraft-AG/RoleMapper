[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/payload/mandate.payload](../README.md) / MandatePayload

# Type Alias: MandatePayload

> **MandatePayload**: `object`

Defined in: [src/role-mapper/model/payload/mandate.payload.ts:15](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/role-mapper/model/payload/mandate.payload.ts#L15)

Nutzlast für die Rückgabe von Mandatsdaten.

## Type declaration

### \_id

> **\_id**: `Types.ObjectId`

### functionName

> **functionName**: `string`

### isImpliciteFunction

> **isImpliciteFunction**: `boolean`

### orgUnit

> **orgUnit**: `Types.ObjectId`

### users

> **users**: [`User`](../../../entity/user.entity/classes/User.md)[]
