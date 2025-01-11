[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/controller/write.controller](../README.md) / WriteController

# Class: WriteController

Defined in: [src/role-mapper/controller/write.controller.ts:35](https://github.com/FlowCraft-AG/RoleMapper/blob/c1dd70009b43cf6900b6bde6d6bd8b801c1074ab/backend/src/role-mapper/controller/write.controller.ts#L35)

## Constructors

### new WriteController()

> **new WriteController**(`writeService`): [`WriteController`](WriteController.md)

Defined in: [src/role-mapper/controller/write.controller.ts:38](https://github.com/FlowCraft-AG/RoleMapper/blob/c1dd70009b43cf6900b6bde6d6bd8b801c1074ab/backend/src/role-mapper/controller/write.controller.ts#L38)

#### Parameters

##### writeService

[`WriteService`](../../../service/write.service/classes/WriteService.md)

#### Returns

[`WriteController`](WriteController.md)

## Methods

### createEntity()

> **createEntity**(`entityType`, `body`): `Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Defined in: [src/role-mapper/controller/write.controller.ts:71](https://github.com/FlowCraft-AG/RoleMapper/blob/c1dd70009b43cf6900b6bde6d6bd8b801c1074ab/backend/src/role-mapper/controller/write.controller.ts#L71)

Erstellen einer neuen Entität.

#### Parameters

##### entityType

[`EntityCategoryType`](../../../model/entity/entities.entity/type-aliases/EntityCategoryType.md)

Die Zielentität (z.B. USERS, ROLES).

##### body

[`CreateDataInput`](../../../model/input/create.input/type-aliases/CreateDataInput.md)

Die zu erstellenden Daten.

#### Returns

`Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Erfolgs- oder Fehlermeldung.

***

### deleteEntity()

> **deleteEntity**(`entityType`, `body`): `Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Defined in: [src/role-mapper/controller/write.controller.ts:183](https://github.com/FlowCraft-AG/RoleMapper/blob/c1dd70009b43cf6900b6bde6d6bd8b801c1074ab/backend/src/role-mapper/controller/write.controller.ts#L183)

Löschen einer Entität.

#### Parameters

##### entityType

[`EntityCategoryType`](../../../model/entity/entities.entity/type-aliases/EntityCategoryType.md)

Die Zielentität.

##### body

[`FilterInput`](../../../model/input/filter.input/type-aliases/FilterInput.md)

Die Filterkriterien für das Löschen.

#### Returns

`Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Erfolgs- oder Fehlermeldung.

***

### updateEntity()

> **updateEntity**(`entityType`, `body`): `Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Defined in: [src/role-mapper/controller/write.controller.ts:127](https://github.com/FlowCraft-AG/RoleMapper/blob/c1dd70009b43cf6900b6bde6d6bd8b801c1074ab/backend/src/role-mapper/controller/write.controller.ts#L127)

Aktualisieren einer bestehenden Entität.

#### Parameters

##### entityType

[`EntityCategoryType`](../../../model/entity/entities.entity/type-aliases/EntityCategoryType.md)

Die Zielentität.

##### body

[`UpdateEntityInput`](../../../model/dto/update.dto/type-aliases/UpdateEntityInput.md)

Die zu aktualisierenden Daten.

#### Returns

`Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Erfolgs- oder Fehlermeldung.
