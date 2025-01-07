[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/payload/role-payload.type](../README.md) / RoleResult

# Type Alias: RoleResult

> **RoleResult**: `object`

Defined in: [src/role-mapper/model/payload/role-payload.type.ts:13](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/model/payload/role-payload.type.ts#L13)

Interface für die Rückgabe einzelner Rollen und deren Benutzer.

## Type declaration

### roleName

> **roleName**: `string`

Dynamischer Rollenname (z.B. "Antragssteller").

### users

> **users**: [`UserWithFunction`](UserWithFunction.md)[]

Benutzer, die dieser Rolle zugeordnet sind.
