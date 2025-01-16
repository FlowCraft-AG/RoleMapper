[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/entity/org-unit.entity](../README.md) / OrgUnit

# Class: OrgUnit

Defined in: [src/role-mapper/model/entity/org-unit.entity.ts:11](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/role-mapper/model/entity/org-unit.entity.ts#L11)

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

Defined in: [src/role-mapper/model/entity/org-unit.entity.ts:46](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/role-mapper/model/entity/org-unit.entity.ts#L46)

Der Alias der Organisationseinheit.

***

### kostenstelleNr?

> `optional` **kostenstelleNr**: `string`

Defined in: [src/role-mapper/model/entity/org-unit.entity.ts:53](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/role-mapper/model/entity/org-unit.entity.ts#L53)

Die Kostenstellennummer der Organisationseinheit.

***

### name

> **name**: `string`

Defined in: [src/role-mapper/model/entity/org-unit.entity.ts:22](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/role-mapper/model/entity/org-unit.entity.ts#L22)

Der Name der Organisationseinheit.

***

### parentId?

> `optional` **parentId**: `ObjectId`

Defined in: [src/role-mapper/model/entity/org-unit.entity.ts:30](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/role-mapper/model/entity/org-unit.entity.ts#L30)

Die ID der übergeordneten Organisationseinheit.

***

### supervisor?

> `optional` **supervisor**: `ObjectId`

Defined in: [src/role-mapper/model/entity/org-unit.entity.ts:38](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/role-mapper/model/entity/org-unit.entity.ts#L38)

Der Vorgesetzte der Organisationseinheit.

***

### type?

> `optional` **type**: `string`

Defined in: [src/role-mapper/model/entity/org-unit.entity.ts:59](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/role-mapper/model/entity/org-unit.entity.ts#L59)

Der Typ der Organisationseinheit.
