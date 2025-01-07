[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/payload/role-payload.type](../README.md) / RoleResult

# Type Alias: RoleResult

> **RoleResult**: `object`

Defined in: [src/role-mapper/model/payload/role-payload.type.ts:13](https://github.com/FlowCraft-AG/RoleMapper/blob/2b9cb86a69a058eebb4388dc6380ab3f35004bd1/backend/src/role-mapper/model/payload/role-payload.type.ts#L13)

Interface für die Rückgabe einzelner Rollen und deren Benutzer.

## Type declaration

### roleName

> **roleName**: `string`

Dynamischer Rollenname (z.B. "Antragssteller").

### users

> **users**: [`UserWithFunction`](UserWithFunction.md)[]

Benutzer, die dieser Rolle zugeordnet sind.
