[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/dto/delete.dto](../README.md) / DeleteEntityInput

# Type Alias: DeleteEntityInput

> **DeleteEntityInput**: `object`

Defined in: [src/role-mapper/model/dto/delete.dto.ts:10](https://github.com/FlowCraft-AG/RoleMapper/blob/c9acdd00838c66d920e7b437b70c88dfa20c9c4e/backend/src/role-mapper/model/dto/delete.dto.ts#L10)

Eingabetyp für das Löschen einer Entität.

Dieser Typ definiert die Struktur der Eingabedaten, die erforderlich sind, um eine bestimmte
Entität aus der Datenbank zu löschen.

## Type declaration

### entity

> **entity**: [`EntityCategoryType`](../../../entity/entities.entity/type-aliases/EntityCategoryType.md)

Der Typ der Entität, die gelöscht werden soll.

#### Example

```ts
"USERS", "MANDATES", "PROCESSES", "ROLES", "ORG_UNITS"
```

### filter

> **filter**: [`FilterInput`](../../../input/filter.input/type-aliases/FilterInput.md)

Die Filterkriterien, um die Zielentität zu identifizieren.

#### Example

```ts
{
     *   field: "name",
     *   operator: "EQ",
     *   value: "IT-Abteilung"
     * }
```
