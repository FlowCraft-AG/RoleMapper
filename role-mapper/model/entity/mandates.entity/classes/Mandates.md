[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/entity/mandates.entity](../README.md) / Mandates

# Class: Mandates

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:31](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/model/entity/mandates.entity.ts#L31)

Repräsentiert eine Function-Entität in der Datenbank.
Hebt hervor, dass die Funktion eine bestimmte Autorität oder Aufgabe beinhaltet.

## Schema

Functions

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

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:50](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/model/entity/mandates.entity.ts#L50)

Der Name der Funktion (z. B. "Professor").

***

### isImpliciteFunction

> **isImpliciteFunction**: `boolean`

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:61](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/model/entity/mandates.entity.ts#L61)

***

### isSingleUser

> **isSingleUser**: `boolean`

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:58](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/model/entity/mandates.entity.ts#L58)

Kennzeichnet, ob der Mandant ein Einzelbenutzer-Mandant ist.

***

### orgUnit

> **orgUnit**: `ObjectId`

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:54](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/model/entity/mandates.entity.ts#L54)

Organisationseinheit, der die Funktion zugeordnet ist.

***

### query?

> `optional` **query**: `GraphQLMutationQuerys`

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:84](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/model/entity/mandates.entity.ts#L84)

Die gespeicherte GraphQL-Abfrage

***

### users?

> `optional` **users**: `string`[]

Defined in: [src/role-mapper/model/entity/mandates.entity.ts:77](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/model/entity/mandates.entity.ts#L77)

Benutzer, die mit dieser Funktion verknüpft sind.
