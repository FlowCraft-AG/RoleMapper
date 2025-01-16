[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/payload/role-payload.type](../README.md) / RoleResult

# Type Alias: RoleResult

> **RoleResult**: `object`

Defined in: [src/role-mapper/model/payload/role-payload.type.ts:25](https://github.com/FlowCraft-AG/RoleMapper/blob/c56690d4fd1bda4e01111a8d104f8e1bd628a5f5/backend/src/role-mapper/model/payload/role-payload.type.ts#L25)

Interface für die Rückgabe einzelner Rollen und deren zugeordneter Benutzer.

## Type declaration

### roleName

> **roleName**: `string`

Dynamischer Rollenname (z. B. "Antragssteller").

### users

> **users**: [`UserWithFunction`](UserWithFunction.md)[]

Benutzer, die dieser Rolle zugeordnet sind.
