[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/dto/create.dto](../README.md) / CreateEntityInput

# Type Alias: CreateEntityInput

> **CreateEntityInput**: `object`

Defined in: [src/role-mapper/model/dto/create.dto.ts:17](https://github.com/FlowCraft-AG/RoleMapper/blob/c9acdd00838c66d920e7b437b70c88dfa20c9c4e/backend/src/role-mapper/model/dto/create.dto.ts#L17)

Eingabetyp für die Erstellung von Entitäten.

Dieser Typ definiert die Struktur der Eingabedaten, die für die Erstellung von Entitäten
in einem System erforderlich sind, wie z. B. Benutzer, Funktionen, Prozesse,
Organisationseinheiten und Rollen.

## Type declaration

### entity

> **entity**: [`EntityCategoryType`](../../../entity/entities.entity/type-aliases/EntityCategoryType.md)

Der Typ der Entität, die erstellt werden soll.

#### Example

```ts
"USERS", "MANDATES", "PROCESSES", "ROLES", "ORG_UNITS"
```

### functionData?

> `optional` **functionData**: [`CreateFunctionInput`](../../../input/create.input/type-aliases/CreateFunctionInput.md)

Die spezifischen Eingabedaten für die Erstellung einer Funktion.

#### Example

```ts
{
     *   functionName: "Manager",
     *   orgUnit: "64b1f768d9a8e900001b1b2f",
     *   users: ["12345"]
     * }
```

### orgUnitData?

> `optional` **orgUnitData**: [`CreateOrgUnitInput`](../../../input/create.input/type-aliases/CreateOrgUnitInput.md)

Die spezifischen Eingabedaten für die Erstellung einer Organisationseinheit.

#### Example

```ts
{
     *   orgUnitId: "org123",
     *   name: "IT Department",
     *   parentId: "org456",
     *   supervisor: "12345"
     * }
```

### processData?

> `optional` **processData**: [`CreateProcessInput`](../../../input/create.input/type-aliases/CreateProcessInput.md)

Die spezifischen Eingabedaten für die Erstellung eines Prozesses.

#### Example

```ts
{
     *   processId: "process123",
     *   name: "Approval Process",
     *   roles: [{ roleId: "role123", roleName: "Approver" }]
     * }
```

### roleData?

> `optional` **roleData**: [`CreateRoleInput`](../../../input/create.input/type-aliases/CreateRoleInput.md)

Die spezifischen Eingabedaten für die Erstellung einer Rolle.

#### Example

```ts
{
     *   roleId: "role123",
     *   name: "Administrator",
     *   query: [{ stage: "filter", filter: { field: "status", operator: "EQ", value: "active" } }]
     * }
```

### userData?

> `optional` **userData**: [`CreateUserInput`](../../../input/create.input/type-aliases/CreateUserInput.md)

Die spezifischen Eingabedaten für die Erstellung eines Benutzers.

#### Example

```ts
{
     *   userId: "12345",
     *   userType: "STUDENT",
     *   active: true
     * }
```
