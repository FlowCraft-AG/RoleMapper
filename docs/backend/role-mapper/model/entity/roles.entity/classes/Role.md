[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/entity/roles.entity](../README.md) / Role

# Class: Role

Defined in: [src/role-mapper/model/entity/roles.entity.ts:8](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/model/entity/roles.entity.ts#L8)

Definiert das Schema für die Role-Entität.

## Extends

- `Document`

## Constructors

### new Role()

> **new Role**(`doc`?): [`Role`](Role.md)

Defined in: node\_modules/mongoose/types/document.d.ts:22

#### Parameters

##### doc?

`any`

#### Returns

[`Role`](Role.md)

#### Inherited from

`Document.constructor`

## Properties

### name

> **name**: `string`

Defined in: [src/role-mapper/model/entity/roles.entity.ts:17](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/model/entity/roles.entity.ts#L17)

Der Name der Rolle.

#### Memberof

Role

#### Required

***

### query?

> `optional` **query**: `PipelineStage`[]

Defined in: [src/role-mapper/model/entity/roles.entity.ts:33](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/model/entity/roles.entity.ts#L33)

Die Abfrage-Pipeline-Stufen, die mit der Rolle verbunden sind.

***

### roleId?

> `optional` **roleId**: `string`

Defined in: [src/role-mapper/model/entity/roles.entity.ts:27](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/model/entity/roles.entity.ts#L27)

Die eindeutige Kennung für die Rolle.

#### Memberof

Role

#### Optional
