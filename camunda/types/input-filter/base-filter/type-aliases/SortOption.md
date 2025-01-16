[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [camunda/types/input-filter/base-filter](../README.md) / SortOption

# Type Alias: SortOption

> **SortOption**: `object`

Defined in: [src/camunda/types/input-filter/base-filter.ts:39](https://github.com/FlowCraft-AG/RoleMapper/blob/5b9ee56819f4990f54c16dcad37384ac73c1551c/backend/src/camunda/types/input-filter/base-filter.ts#L39)

Definiert die Optionen zur Sortierung der Filterergebnisse.

## Type declaration

### field

> **field**: `string`

Feldname, nach dem die Ergebnisse sortiert werden sollen.
Beispiel: "creationDate" oder "priority".

### order

> **order**: `"ASC"` \| `"DESC"`

Sortierreihenfolge.
- `ASC`: Aufsteigend
- `DESC`: Absteigend
