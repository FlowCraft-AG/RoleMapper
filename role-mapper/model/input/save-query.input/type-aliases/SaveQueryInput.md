[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/save-query.input](../README.md) / SaveQueryInput

# Type Alias: SaveQueryInput

> **SaveQueryInput**: `object`

Defined in: [src/role-mapper/model/input/save-query.input.ts:7](https://github.com/FlowCraft-AG/RoleMapper/blob/c1dd70009b43cf6900b6bde6d6bd8b801c1074ab/backend/src/role-mapper/model/input/save-query.input.ts#L7)

Eingabetyp für das Speichern einer Abfrage.

## Type declaration

### functionName

> **functionName**: `string`

Der Name der Funktion, für die die Abfrage gespeichert werden soll.

#### Example

```ts
"Manager"
```

### input

> **input**: [`DataInput`](../../data.input/type-aliases/DataInput.md)

Die Abfrageparameter, einschließlich Entität, Filter- und Sortierkriterien.

#### Example

```ts
{
     *   entity: 'USERS',
     *   filter: { field: 'status', operator: 'EQ', value: 'active' },
     *   sort: { field: 'name', direction: 'ASC' },
     * }
```

### orgUnitId

> **orgUnitId**: `Types.ObjectId`

Die ID der Organisationseinheit, die mit der Abfrage verbunden ist.

#### Example

```ts
new Types.ObjectId('64b1f768d9a8e900001b1b2f')
```
