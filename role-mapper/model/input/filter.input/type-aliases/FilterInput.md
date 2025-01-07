[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/filter.input](../README.md) / FilterInput

# Type Alias: FilterInput

> **FilterInput**: `object`

Defined in: [src/role-mapper/model/input/filter.input.ts:6](https://github.com/FlowCraft-AG/RoleMapper/blob/3cef41945a7433078df8de15ae023cbf018d74ba/backend/src/role-mapper/model/input/filter.input.ts#L6)

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
