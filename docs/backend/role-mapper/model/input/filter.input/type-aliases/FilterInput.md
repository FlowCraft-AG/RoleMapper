[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/filter.input](../README.md) / FilterInput

# Type Alias: FilterInput

> **FilterInput**: `object`

Defined in: [src/role-mapper/model/input/filter.input.ts:6](https://github.com/FlowCraft-AG/RoleMapper/blob/cdd9e5010cc7adeee46f58ea0abd91d186332c1d/backend/src/role-mapper/model/input/filter.input.ts#L6)

## Type declaration

### AND?

> `optional` **AND**: [`FilterInput`](FilterInput.md)[]

### field?

> `optional` **field**: [`FilterField`](../../../types/filter.type/type-aliases/FilterField.md)

### NOR?

> `optional` **NOR**: [`FilterInput`](FilterInput.md)[]

### operator?

> `optional` **operator**: [`FilterOperator`](../../../types/filter.type/type-aliases/FilterOperator.md)

### OR?

> `optional` **OR**: [`FilterInput`](FilterInput.md)[]

### value?

> `optional` **value**: `string` \| `number` \| `boolean` \| `Types.ObjectId`
