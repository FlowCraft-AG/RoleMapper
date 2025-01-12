[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/entity/mandates.entity](../README.md) / Mandates

# Class: Mandates

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:84](https://github.com/FlowCraft-AG/RoleMapper/blob/06e4dcac36a95931bf2da64d0f18219d502c1d38/backend/src/role-mapper/model/entity/mandates.entity.ts#L84)

Repräsentiert eine Funktion (Mandate) in der Datenbank.

Funktionen beschreiben organisatorische Rollen oder Autoritäten, die Benutzern
und Organisationseinheiten zugeordnet sind.

## Schema

Mandates

## Extends

- `Document`

## Constructors

### new Mandates()

> **new Mandates**(`doc`?): [`Mandates`](Mandates.md)

Defined in: node\_modules/mongoose/types/document.d.ts:22

#### Parameters

##### doc?

`any`

#### Returns

[`Mandates`](Mandates.md)

#### Inherited from

`Document.constructor`

## Properties

### functionName

> **functionName**: `string`

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:107](https://github.com/FlowCraft-AG/RoleMapper/blob/06e4dcac36a95931bf2da64d0f18219d502c1d38/backend/src/role-mapper/model/entity/mandates.entity.ts#L107)

Der Name der Funktion (z. B. "Professor").

***

### isImpliciteFunction

> **isImpliciteFunction**: `boolean`

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:131](https://github.com/FlowCraft-AG/RoleMapper/blob/06e4dcac36a95931bf2da64d0f18219d502c1d38/backend/src/role-mapper/model/entity/mandates.entity.ts#L131)

Gibt an, ob es sich um eine implizite Funktion handelt.

***

### isSingleUser

> **isSingleUser**: `boolean`

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:123](https://github.com/FlowCraft-AG/RoleMapper/blob/06e4dcac36a95931bf2da64d0f18219d502c1d38/backend/src/role-mapper/model/entity/mandates.entity.ts#L123)

Gibt an, ob die Funktion nur für einen Benutzer gilt.

***

### orgUnit

> **orgUnit**: `ObjectId`

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:115](https://github.com/FlowCraft-AG/RoleMapper/blob/06e4dcac36a95931bf2da64d0f18219d502c1d38/backend/src/role-mapper/model/entity/mandates.entity.ts#L115)

Die Organisationseinheit, der die Funktion zugeordnet ist.

***

### query?

> `optional` **query**: [`GraphQLMutationQuerys`](../type-aliases/GraphQLMutationQuerys.md)

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:162](https://github.com/FlowCraft-AG/RoleMapper/blob/06e4dcac36a95931bf2da64d0f18219d502c1d38/backend/src/role-mapper/model/entity/mandates.entity.ts#L162)

Die gespeicherte GraphQL-Abfrage.

***

### users?

> `optional` **users**: `string`[]

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:151](https://github.com/FlowCraft-AG/RoleMapper/blob/06e4dcac36a95931bf2da64d0f18219d502c1d38/backend/src/role-mapper/model/entity/mandates.entity.ts#L151)

Die Benutzer, die dieser Funktion zugeordnet sind.
