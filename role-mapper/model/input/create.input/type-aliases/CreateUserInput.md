[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/create.input](../README.md) / CreateUserInput

# Type Alias: CreateUserInput

> **CreateUserInput**: `object`

Defined in: [src/role-mapper/model/input/create.input.ts:4](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/role-mapper/model/input/create.input.ts#L4)

## Type declaration

### active?

> `optional` **active**: `boolean`

### employee?

> `optional` **employee**: [`CreateEmployeeInput`](CreateEmployeeInput.md)

### orgUnit?

> `optional` **orgUnit**: `string`

### student?

> `optional` **student**: [`CreateStudentInput`](CreateStudentInput.md)

### userId

> **userId**: `string`

### userRole

> **userRole**: `string`

### userType

> **userType**: `string`