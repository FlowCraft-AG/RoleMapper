[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/get-roles.input](../README.md) / GetRolesInput

# Type Alias: GetRolesInput

> **GetRolesInput**: `object`

Defined in: [src/role-mapper/model/input/get-roles.input.ts:18](https://github.com/FlowCraft-AG/RoleMapper/blob/5b9ee56819f4990f54c16dcad37384ac73c1551c/backend/src/role-mapper/model/input/get-roles.input.ts#L18)

Eingabeparameter für die Abfrage `getProcessRoles`.

Diese Eingabeparameter enthalten die Informationen, die benötigt werden, um die Rollen
eines bestimmten Prozesses für einen Benutzer abzurufen.

## Type declaration

### processId

> **processId**: `string`

### userId

> **userId**: `string`

## Example

```typescript
const input: GetRolesInput = {
    processId: '12345',
    userId: 'user678',
};
```
