[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [camunda/types/input-filter/base-filter](../README.md) / BaseFilter

# Type Alias: BaseFilter

> **BaseFilter**: `object`

Defined in: [src/camunda/types/input-filter/base-filter.ts:10](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/camunda/types/input-filter/base-filter.ts#L10)

Basistyp für Filteroptionen, die in mehreren APIs verwendet werden.

## Type declaration

### key?

> `optional` **key**: `string`

Eindeutiger Schlüssel des zu filternden Objekts.
Beispiel: Prozessinstanz-, Prozessdefinition-, FlowNode-Instanz-, Incident- oder Variablenschlüssel.

### size?

> `optional` **size**: `number`

Maximale Anzahl von Ergebnissen, die zurückgegeben werden sollen.
Standardwert kann von der jeweiligen API festgelegt werden.

### sort?

> `optional` **sort**: [`SortOption`](SortOption.md)[]

Sortieroptionen für die Ergebnisse.
Ermöglicht die Sortierung nach bestimmten Feldern in aufsteigender oder absteigender Reihenfolge.

### tenantId?

> `optional` **tenantId**: `string`

Tenant-ID für Multi-Tenancy-Filter.
Wenn Multi-Tenancy aktiviert ist, werden nur Objekte des angegebenen Tenants zurückgegeben.
