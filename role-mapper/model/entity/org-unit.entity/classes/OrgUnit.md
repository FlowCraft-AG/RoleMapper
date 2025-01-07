[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/entity/org-unit.entity](../README.md) / OrgUnit

# Class: OrgUnit

Defined in: [src/role-mapper/model/entity/org-unit.entity.ts:15](https://github.com/FlowCraft-AG/RoleMapper/blob/3eb36c970c08048b7af3096cccc727e0fc5a22b5/backend/src/role-mapper/model/entity/org-unit.entity.ts#L15)

Repräsentiert eine Organisationseinheit innerhalb des Systems.

## Schema

OrgUnit

## Collection

OrgUnits

## Extends

- `Document`

## Constructors

### new OrgUnit()

> **new OrgUnit**(`doc`?): [`OrgUnit`](OrgUnit.md)

Defined in: node\_modules/mongoose/types/document.d.ts:22

#### Parameters

##### doc?

`any`

#### Returns

[`OrgUnit`](OrgUnit.md)

#### Inherited from

`Document.constructor`

## Properties

### alias?

> `optional` **alias**: `string`

Defined in: [src/role-mapper/model/entity/org-unit.entity.ts:44](https://github.com/FlowCraft-AG/RoleMapper/blob/3eb36c970c08048b7af3096cccc727e0fc5a22b5/backend/src/role-mapper/model/entity/org-unit.entity.ts#L44)

***

### kostenstelleNr?

> `optional` **kostenstelleNr**: `string`

Defined in: [src/role-mapper/model/entity/org-unit.entity.ts:45](https://github.com/FlowCraft-AG/RoleMapper/blob/3eb36c970c08048b7af3096cccc727e0fc5a22b5/backend/src/role-mapper/model/entity/org-unit.entity.ts#L45)

***

### name

> **name**: `string`

Defined in: [src/role-mapper/model/entity/org-unit.entity.ts:26](https://github.com/FlowCraft-AG/RoleMapper/blob/3eb36c970c08048b7af3096cccc727e0fc5a22b5/backend/src/role-mapper/model/entity/org-unit.entity.ts#L26)

Der Name der Organisationseinheit.

***

### parentId?

> `optional` **parentId**: `ObjectId`

Defined in: [src/role-mapper/model/entity/org-unit.entity.ts:34](https://github.com/FlowCraft-AG/RoleMapper/blob/3eb36c970c08048b7af3096cccc727e0fc5a22b5/backend/src/role-mapper/model/entity/org-unit.entity.ts#L34)

Die ID der übergeordneten Organisationseinheit.

***

### supervisor?

> `optional` **supervisor**: `ObjectId`

Defined in: [src/role-mapper/model/entity/org-unit.entity.ts:42](https://github.com/FlowCraft-AG/RoleMapper/blob/3eb36c970c08048b7af3096cccc727e0fc5a22b5/backend/src/role-mapper/model/entity/org-unit.entity.ts#L42)

Der Vorgesetzte der Organisationseinheit.

***

### type?

> `optional` **type**: `string`

Defined in: [src/role-mapper/model/entity/org-unit.entity.ts:46](https://github.com/FlowCraft-AG/RoleMapper/blob/3eb36c970c08048b7af3096cccc727e0fc5a22b5/backend/src/role-mapper/model/entity/org-unit.entity.ts#L46)
