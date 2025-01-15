[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/service/write.service](../README.md) / WriteService

# Class: WriteService

Defined in: [src/role-mapper/service/write.service.ts:35](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/role-mapper/service/write.service.ts#L35)

## Constructors

### new WriteService()

> **new WriteService**(`userModel`, `processModel`, `functionModel`, `orgUnitModel`, `roleModel`, `readService`): [`WriteService`](WriteService.md)

Defined in: [src/role-mapper/service/write.service.ts:40](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/role-mapper/service/write.service.ts#L40)

#### Parameters

##### userModel

`Model`\<[`UserDocument`](../../../model/entity/user.entity/type-aliases/UserDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`UserDocument`](../../../model/entity/user.entity/type-aliases/UserDocument.md)\> & [`User`](../../../model/entity/user.entity/classes/User.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

##### processModel

`Model`\<[`ProcessDocument`](../../../model/entity/process.entity/type-aliases/ProcessDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`ProcessDocument`](../../../model/entity/process.entity/type-aliases/ProcessDocument.md)\> & [`Process`](../../../model/entity/process.entity/classes/Process.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

##### functionModel

`Model`\<[`MandateDocument`](../../../model/entity/mandates.entity/type-aliases/MandateDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`MandateDocument`](../../../model/entity/mandates.entity/type-aliases/MandateDocument.md)\> & [`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

##### orgUnitModel

`Model`\<[`OrgUnitDocument`](../../../model/entity/org-unit.entity/type-aliases/OrgUnitDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`OrgUnitDocument`](../../../model/entity/org-unit.entity/type-aliases/OrgUnitDocument.md)\> & [`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

##### roleModel

`Model`\<[`RoleDocument`](../../../model/entity/roles.entity/type-aliases/RoleDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`RoleDocument`](../../../model/entity/roles.entity/type-aliases/RoleDocument.md)\> & [`Role`](../../../model/entity/roles.entity/classes/Role.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

##### readService

[`ReadService`](../../read.service/classes/ReadService.md)

#### Returns

[`WriteService`](WriteService.md)

## Methods

### addUserToFunction()

> **addUserToFunction**(`functionName`, `userId`): `Promise`\<[`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md)\>

Defined in: [src/role-mapper/service/write.service.ts:154](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/role-mapper/service/write.service.ts#L154)

#### Parameters

##### functionName

`string`

##### userId

`string`

#### Returns

`Promise`\<[`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md)\>

***

### createEntity()

> **createEntity**(`entity`, `data`): `Promise`\<[`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md) & `Required`\<\{\}\> \| [`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md) & `Required`\<\{\}\> \| [`Process`](../../../model/entity/process.entity/classes/Process.md) & `Required`\<\{\}\> \| [`Role`](../../../model/entity/roles.entity/classes/Role.md) & `Required`\<\{\}\> \| [`User`](../../../model/entity/user.entity/classes/User.md) & `Required`\<\{\}\>\>

Defined in: [src/role-mapper/service/write.service.ts:66](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/role-mapper/service/write.service.ts#L66)

Erstellt eine neue Entität.

#### Parameters

##### entity

[`EntityCategoryType`](../../../model/entity/entities.entity/type-aliases/EntityCategoryType.md)

Der Name der Entität.

##### data

[`CreateDataInput`](../../../model/input/create.input/type-aliases/CreateDataInput.md)

Die Daten für die neue Entität.

#### Returns

`Promise`\<[`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md) & `Required`\<\{\}\> \| [`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md) & `Required`\<\{\}\> \| [`Process`](../../../model/entity/process.entity/classes/Process.md) & `Required`\<\{\}\> \| [`Role`](../../../model/entity/roles.entity/classes/Role.md) & `Required`\<\{\}\> \| [`User`](../../../model/entity/user.entity/classes/User.md) & `Required`\<\{\}\>\>

- Die erstellte Entität.

#### Throws

- Wenn die Entität unbekannt ist.

***

### deleteEntity()

> **deleteEntity**(`entity`, `filters`): `Promise`\<\{ `deletedCount`: `number`; `message`: `string`; `success`: `boolean`; \}\>

Defined in: [src/role-mapper/service/write.service.ts:139](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/role-mapper/service/write.service.ts#L139)

Löscht eine oder mehrere Entitäten.

#### Parameters

##### entity

[`EntityCategoryType`](../../../model/entity/entities.entity/type-aliases/EntityCategoryType.md)

Der Name der Entität.

##### filters

[`FilterInput`](../../../model/input/filter.input/type-aliases/FilterInput.md)

#### Returns

`Promise`\<\{ `deletedCount`: `number`; `message`: `string`; `success`: `boolean`; \}\>

- Das Ergebnis der Löschung.

#### Throws

- Wenn die Entität unbekannt ist.

***

### removeUserFromFunction()

> **removeUserFromFunction**(`functionName`, `userId`, `newUserId`?): `Promise`\<[`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md)\>

Defined in: [src/role-mapper/service/write.service.ts:201](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/role-mapper/service/write.service.ts#L201)

#### Parameters

##### functionName

`string`

##### userId

`string`

##### newUserId?

`string`

#### Returns

`Promise`\<[`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md)\>

***

### saveQuery()

> **saveQuery**(`functionName`, `orgUnitId`, `entity`, `filter`?, `sort`?): `Promise`\<\{ `result`: [`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md); `success`: `boolean`; \}\>

Defined in: [src/role-mapper/service/write.service.ts:287](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/role-mapper/service/write.service.ts#L287)

#### Parameters

##### functionName

`string`

##### orgUnitId

`ObjectId`

##### entity

[`EntityCategoryType`](../../../model/entity/entities.entity/type-aliases/EntityCategoryType.md)

##### filter?

[`FilterInput`](../../../model/input/filter.input/type-aliases/FilterInput.md)

##### sort?

[`SortInput`](../../../model/input/sort.input/type-aliases/SortInput.md)

#### Returns

`Promise`\<\{ `result`: [`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md); `success`: `boolean`; \}\>

***

### updateEntity()

> **updateEntity**(`entity`, `filters`, `data`): `Promise`\<\{ `matchedCount`: `number`; `message`: `string`; `modifiedCount`: `number`; `success`: `boolean`; `upsertedCount`: `number`; `upsertedId`: `null` \| `ObjectId`; \}\>

Defined in: [src/role-mapper/service/write.service.ts:94](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/role-mapper/service/write.service.ts#L94)

Aktualisiert eine oder mehrere Entitäten.

#### Parameters

##### entity

[`EntityCategoryType`](../../../model/entity/entities.entity/type-aliases/EntityCategoryType.md)

Der Name der Entität.

##### filters

[`FilterInput`](../../../model/input/filter.input/type-aliases/FilterInput.md)

##### data

[`UpdateDataInput`](../../../model/input/update.input/type-aliases/UpdateDataInput.md)

Die neuen Daten für die Entität.

#### Returns

`Promise`\<\{ `matchedCount`: `number`; `message`: `string`; `modifiedCount`: `number`; `success`: `boolean`; `upsertedCount`: `number`; `upsertedId`: `null` \| `ObjectId`; \}\>

- Das Ergebnis der Aktualisierung.

#### Throws

- Wenn die Entität unbekannt ist.
