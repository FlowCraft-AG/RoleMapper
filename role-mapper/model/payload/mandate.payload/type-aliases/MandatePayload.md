[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/payload/mandate.payload](../README.md) / MandatePayload

# Type Alias: MandatePayload

> **MandatePayload**: `object`

Defined in: [src/role-mapper/model/payload/mandate.payload.ts:15](https://github.com/FlowCraft-AG/RoleMapper/blob/64577d705cc4c579b4cd41d48895a5fa1f3b9249/backend/src/role-mapper/model/payload/mandate.payload.ts#L15)

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
