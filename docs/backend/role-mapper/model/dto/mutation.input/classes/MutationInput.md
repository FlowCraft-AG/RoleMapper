[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/dto/mutation.input](../README.md) / MutationInput

# Class: MutationInput

Defined in: [src/role-mapper/model/dto/mutation.input.ts:9](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/model/dto/mutation.input.ts#L9)

Definiert die Eingabeparameter für Mutationen in GraphQL.

## Constructors

### new MutationInput()

> **new MutationInput**(): [`MutationInput`](MutationInput.md)

#### Returns

[`MutationInput`](MutationInput.md)

## Properties

### data?

> `optional` **data**: [`DataInputDTO`](../../data.dto/classes/DataInputDTO.md)

Defined in: [src/role-mapper/model/dto/mutation.input.ts:29](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/model/dto/mutation.input.ts#L29)

Die Daten für die Mutation (optional).

***

### entity

> **entity**: `string`

Defined in: [src/role-mapper/model/dto/mutation.input.ts:15](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/model/dto/mutation.input.ts#L15)

Der Name der Entität, auf die die Mutation angewendet wird.

***

### filter?

> `optional` **filter**: [`FilterInput`](../../../input/filter.input/type-aliases/FilterInput.md)

Defined in: [src/role-mapper/model/dto/mutation.input.ts:36](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/model/dto/mutation.input.ts#L36)

Die Filterkriterien für die Mutation (optional).

***

### operation

> **operation**: `"DELETE"` \| `"CREATE"` \| `"UPDATE"`

Defined in: [src/role-mapper/model/dto/mutation.input.ts:22](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/model/dto/mutation.input.ts#L22)

Die Art der Mutation (CREATE, UPDATE, DELETE).
