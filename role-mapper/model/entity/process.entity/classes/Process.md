[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/entity/process.entity](../README.md) / Process

# Class: Process

Defined in: [src/role-mapper/model/entity/process.entity.ts:32](https://github.com/FlowCraft-AG/RoleMapper/blob/dfa0426eb5b55e53274c22382030e399befc29aa/backend/src/role-mapper/model/entity/process.entity.ts#L32)

Repräsentiert einen Prozess in der Datenbank.

## Schema

Processes - Die Sammlung, in der die Prozesse gespeichert werden.

## Extends

- `Document`

## Constructors

### new Process()

> **new Process**(`doc`?): [`Process`](Process.md)

Defined in: node\_modules/mongoose/types/document.d.ts:22

#### Parameters

##### doc?

`any`

#### Returns

[`Process`](Process.md)

#### Inherited from

`Document.constructor`

## Properties

### name

> **name**: `string`

Defined in: [src/role-mapper/model/entity/process.entity.ts:41](https://github.com/FlowCraft-AG/RoleMapper/blob/dfa0426eb5b55e53274c22382030e399befc29aa/backend/src/role-mapper/model/entity/process.entity.ts#L41)

Der Name des Prozesses.
(z. B. "Reisegenehmigung")

#### Required

***

### parentId

> **parentId**: `string`

Defined in: [src/role-mapper/model/entity/process.entity.ts:44](https://github.com/FlowCraft-AG/RoleMapper/blob/dfa0426eb5b55e53274c22382030e399befc29aa/backend/src/role-mapper/model/entity/process.entity.ts#L44)

***

### processId

> **processId**: `string`

Defined in: [src/role-mapper/model/entity/process.entity.ts:53](https://github.com/FlowCraft-AG/RoleMapper/blob/dfa0426eb5b55e53274c22382030e399befc29aa/backend/src/role-mapper/model/entity/process.entity.ts#L53)

Die eindeutige ID des Prozesses.

#### Required

***

### roles

> **roles**: [`ShortRole`](ShortRole.md)[]

Defined in: [src/role-mapper/model/entity/process.entity.ts:63](https://github.com/FlowCraft-AG/RoleMapper/blob/dfa0426eb5b55e53274c22382030e399befc29aa/backend/src/role-mapper/model/entity/process.entity.ts#L63)

Die Rollen, die dem Prozess zugeordnet sind.
Liste der Rollen, die dem Prozess zugeordnet sind.

#### Required
