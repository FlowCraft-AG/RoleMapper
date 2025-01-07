[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/update.input](../README.md) / UpdateUserInput

# Type Alias: UpdateUserInput

> **UpdateUserInput**: `object`

Defined in: [src/role-mapper/model/input/update.input.ts:5](https://github.com/FlowCraft-AG/RoleMapper/blob/1b2b6c233762d0bcac1cf2d3fd5c5f2ed014cf3e/backend/src/role-mapper/model/input/update.input.ts#L5)

## Type declaration

### active?

> `optional` **active**: `boolean`

### employee?

> `optional` **employee**: [`UpdateEmployeeInput`](UpdateEmployeeInput.md)

### orgUnit?

> `optional` **orgUnit**: `string`

### student?

> `optional` **student**: [`UpdateStudentInput`](UpdateStudentInput.md)

### userId

> **userId**: `string`

### userRole?

> `optional` **userRole**: `string`

### userType?

> `optional` **userType**: `string`

### validFrom?

> `optional` **validFrom**: `string`

### validUntil?

> `optional` **validUntil**: `string`
