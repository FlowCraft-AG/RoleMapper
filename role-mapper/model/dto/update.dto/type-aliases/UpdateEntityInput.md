[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/dto/update.dto](../README.md) / UpdateEntityInput

# Type Alias: UpdateEntityInput

> **UpdateEntityInput**: `object`

Defined in: [src/role-mapper/model/dto/update.dto.ts:18](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/role-mapper/model/dto/update.dto.ts#L18)

Eingabetyp für das Aktualisieren von Entitäten.

Dieser Typ definiert die Struktur der Eingabedaten, die für das Aktualisieren von
Entitäten in REST- und GraphQL-Anwendungen verwendet werden.

## Type declaration

### data

> **data**: [`UpdateDataInput`](../../../input/update.input/type-aliases/UpdateDataInput.md)

Die allgemeinen Aktualisierungsdaten, die für REST-Anwendungen verwendet werden.

#### Example

```ts
{
     *   field: "name",
     *   value: "Updated Name"
     * }
```

### entity

> **entity**: [`EntityCategoryType`](../../../entity/entities.entity/type-aliases/EntityCategoryType.md)

Der Typ der Entität, die aktualisiert werden soll.

#### Example

```ts
"USERS", "MANDATES", "PROCESSES", "ROLES", "ORG_UNITS"
```

### filter

> **filter**: [`FilterInput`](../../../input/filter.input/type-aliases/FilterInput.md)

Die Filterkriterien, um die Zielentität(en) für die Aktualisierung zu identifizieren.

#### Example

```ts
{
     *   field: "name",
     *   operator: "EQ",
     *   value: "IT-Abteilung"
     * }
```

### functionData?

> `optional` **functionData**: [`UpdateFunctionInput`](../../../input/update.input/type-aliases/UpdateFunctionInput.md)

Die spezifischen Aktualisierungsdaten für Funktionen (GraphQL).

#### Example

```ts
{
     *   functionName: "Updated Function"
     * }
```

### orgUnitData?

> `optional` **orgUnitData**: [`UpdateOrgUnitInput`](../../../input/update.input/type-aliases/UpdateOrgUnitInput.md)

Die spezifischen Aktualisierungsdaten für Organisationseinheiten (GraphQL).

#### Example

```ts
{
     *   orgUnitName: "Updated Org Unit"
     * }
```

### processData?

> `optional` **processData**: [`UpdateProcessInput`](../../../input/update.input/type-aliases/UpdateProcessInput.md)

Die spezifischen Aktualisierungsdaten für Prozesse (GraphQL).

#### Example

```ts
{
     *   processName: "Updated Process"
     * }
```

### roleData?

> `optional` **roleData**: [`UpdateRoleInput`](../../../input/update.input/type-aliases/UpdateRoleInput.md)

Die spezifischen Aktualisierungsdaten für Rollen (GraphQL).

#### Example

```ts
{
     *   roleName: "Updated Role"
     * }
```

### userData?

> `optional` **userData**: [`UpdateUserInput`](../../../input/update.input/type-aliases/UpdateUserInput.md)

Die spezifischen Aktualisierungsdaten für Benutzer (GraphQL).

#### Example

```ts
{
     *   firstName: "John",
     *   lastName: "Doe"
     * }
```
