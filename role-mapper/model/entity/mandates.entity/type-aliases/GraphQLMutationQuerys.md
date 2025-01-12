[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/entity/mandates.entity](../README.md) / GraphQLMutationQuerys

# Type Alias: GraphQLMutationQuerys

> **GraphQLMutationQuerys**: `object`

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:20](https://github.com/FlowCraft-AG/RoleMapper/blob/06e4dcac36a95931bf2da64d0f18219d502c1d38/backend/src/role-mapper/model/entity/mandates.entity.ts#L20)

Typ für GraphQL-Mutationsabfragen.

Dieser Typ definiert die Struktur für Abfrageparameter, die in GraphQL-Mutations
verwendet werden, einschließlich der Zielentität, Filterkriterien, Paginierungs-
und Sortieroptionen.

## Type declaration

### entity

> **entity**: [`EntityCategoryType`](../../entities.entity/type-aliases/EntityCategoryType.md)

Die Zielentität der Abfrage.

#### Example

```ts
'USERS', 'MANDATES', 'PROCESSES', 'ROLES', 'ORG_UNITS'
```

### filter

> **filter**: [`FilterInput`](../../../input/filter.input/type-aliases/FilterInput.md)

Die Filterkriterien, die auf die Abfrage angewendet werden.

#### Example

```ts
{
     *   field: 'name',
     *   operator: 'LIKE',
     *   value: 'John',
     *   AND: [
     *     { field: 'status', operator: 'EQ', value: 'active' }
     *   ]
     * }
```

### pagination?

> `optional` **pagination**: [`PaginationParameters`](../../../input/pagination-parameters/type-aliases/PaginationParameters.md)

Die Paginierungsparameter, um die Abfrageergebnisse zu begrenzen.

#### Optional

#### Default

```ts
undefined
```

#### Example

```ts
{
     *   limit: 10,
     *   offset: 20
     * }
```

### sort?

> `optional` **sort**: [`SortInput`](../../../input/sort.input/type-aliases/SortInput.md)

Die Sortieroptionen, um die Reihenfolge der Ergebnisse zu steuern.

#### Optional

#### Default

```ts
undefined
```

#### Example

```ts
{
     *   field: 'name',
     *   direction: 'ASC'
     * }
```
