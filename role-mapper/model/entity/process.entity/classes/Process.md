[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/entity/process.entity](../README.md) / Process

# Class: Process

Defined in: [src/role-mapper/model/entity/process.entity.ts:26](https://github.com/FlowCraft-AG/RoleMapper/blob/a27a4625e026a9ad2c24db2d223617539cb70099/backend/src/role-mapper/model/entity/process.entity.ts#L26)

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

Defined in: [src/role-mapper/model/entity/process.entity.ts:35](https://github.com/FlowCraft-AG/RoleMapper/blob/a27a4625e026a9ad2c24db2d223617539cb70099/backend/src/role-mapper/model/entity/process.entity.ts#L35)

Der Name des Prozesses.
(z. B. "Reisegenehmigung")

#### Required

***

### parentId

> **parentId**: `string`

Defined in: [src/role-mapper/model/entity/process.entity.ts:38](https://github.com/FlowCraft-AG/RoleMapper/blob/a27a4625e026a9ad2c24db2d223617539cb70099/backend/src/role-mapper/model/entity/process.entity.ts#L38)

***

### processId

> **processId**: `string`

Defined in: [src/role-mapper/model/entity/process.entity.ts:47](https://github.com/FlowCraft-AG/RoleMapper/blob/a27a4625e026a9ad2c24db2d223617539cb70099/backend/src/role-mapper/model/entity/process.entity.ts#L47)

Die eindeutige ID des Prozesses.

#### Required

***

### roles

> **roles**: [`ShortRole`](ShortRole.md)[]

Defined in: [src/role-mapper/model/entity/process.entity.ts:57](https://github.com/FlowCraft-AG/RoleMapper/blob/a27a4625e026a9ad2c24db2d223617539cb70099/backend/src/role-mapper/model/entity/process.entity.ts#L57)

Die Rollen, die dem Prozess zugeordnet sind.
Liste der Rollen, die dem Prozess zugeordnet sind.

#### Required
