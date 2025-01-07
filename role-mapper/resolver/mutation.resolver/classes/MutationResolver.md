[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/resolver/mutation.resolver](../README.md) / MutationResolver

# Class: MutationResolver

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:23](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/resolver/mutation.resolver.ts#L23)

## Constructors

### new MutationResolver()

> **new MutationResolver**(`service`): [`MutationResolver`](MutationResolver.md)

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:26](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/resolver/mutation.resolver.ts#L26)

#### Parameters

##### service

[`WriteService`](../../../service/write.service/classes/WriteService.md)

#### Returns

[`MutationResolver`](MutationResolver.md)

## Methods

### addUserToRole()

> **addUserToRole**(`functionId`, `userId`): `Promise`\<`Document`\<`unknown`, \{\}, [`EntityType`](../../../model/entity/entities.entity/type-aliases/EntityType.md)\> & [`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md) & `Required`\<\{\}\> & `object` \| [`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md) & `Required`\<\{\}\> & `object` \| [`Process`](../../../model/entity/process.entity/classes/Process.md) & `Required`\<\{\}\> & `object` \| [`Role`](../../../model/entity/roles.entity/classes/Role.md) & `Required`\<\{\}\> & `object` \| [`User`](../../../model/entity/user.entity/classes/User.md) & `Required`\<\{\}\> & `object`\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:187](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/resolver/mutation.resolver.ts#L187)

#### Parameters

##### functionId

`string`

##### userId

`string`

#### Returns

`Promise`\<`Document`\<`unknown`, \{\}, [`EntityType`](../../../model/entity/entities.entity/type-aliases/EntityType.md)\> & [`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md) & `Required`\<\{\}\> & `object` \| [`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md) & `Required`\<\{\}\> & `object` \| [`Process`](../../../model/entity/process.entity/classes/Process.md) & `Required`\<\{\}\> & `object` \| [`Role`](../../../model/entity/roles.entity/classes/Role.md) & `Required`\<\{\}\> & `object` \| [`User`](../../../model/entity/user.entity/classes/User.md) & `Required`\<\{\}\> & `object`\>

***

### createEntity()

> **createEntity**(`input`): `Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:40](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/resolver/mutation.resolver.ts#L40)

Erstellt eine neue Entität in der Datenbank.

#### Parameters

##### input

[`CreateEntityInput`](../../../model/dto/create.dto/type-aliases/CreateEntityInput.md)

#### Returns

`Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

***

### deleteEntity()

> **deleteEntity**(`input`): `Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:165](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/resolver/mutation.resolver.ts#L165)

Löscht eine bestehende Entität aus der Datenbank.

#### Parameters

##### input

[`DeleteEntityInput`](../../../model/dto/delete.dto/type-aliases/DeleteEntityInput.md)

#### Returns

`Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

***

### removeUserFromRole()

> **removeUserFromRole**(`functionId`, `userId`): `Promise`\<`Document`\<`unknown`, \{\}, [`EntityType`](../../../model/entity/entities.entity/type-aliases/EntityType.md)\> & [`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md) & `Required`\<\{\}\> & `object` \| [`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md) & `Required`\<\{\}\> & `object` \| [`Process`](../../../model/entity/process.entity/classes/Process.md) & `Required`\<\{\}\> & `object` \| [`Role`](../../../model/entity/roles.entity/classes/Role.md) & `Required`\<\{\}\> & `object` \| [`User`](../../../model/entity/user.entity/classes/User.md) & `Required`\<\{\}\> & `object`\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:200](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/resolver/mutation.resolver.ts#L200)

#### Parameters

##### functionId

`string`

##### userId

`string`

#### Returns

`Promise`\<`Document`\<`unknown`, \{\}, [`EntityType`](../../../model/entity/entities.entity/type-aliases/EntityType.md)\> & [`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md) & `Required`\<\{\}\> & `object` \| [`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md) & `Required`\<\{\}\> & `object` \| [`Process`](../../../model/entity/process.entity/classes/Process.md) & `Required`\<\{\}\> & `object` \| [`Role`](../../../model/entity/roles.entity/classes/Role.md) & `Required`\<\{\}\> & `object` \| [`User`](../../../model/entity/user.entity/classes/User.md) & `Required`\<\{\}\> & `object`\>

***

### saveQuery()

> **saveQuery**(`functionName`, `orgUnitId`, `input`): `Promise`\<\{ `message`: `string`; `result`: `Document`\<`unknown`, \{\}, [`EntityType`](../../../model/entity/entities.entity/type-aliases/EntityType.md)\> & [`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md) & `Required`\<\{\}\> & `object` \| [`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md) & `Required`\<\{\}\> & `object` \| [`Process`](../../../model/entity/process.entity/classes/Process.md) & `Required`\<\{\}\> & `object` \| [`Role`](../../../model/entity/roles.entity/classes/Role.md) & `Required`\<\{\}\> & `object` \| [`User`](../../../model/entity/user.entity/classes/User.md) & `Required`\<\{\}\> & `object`; `success`: `boolean`; \}\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:218](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/resolver/mutation.resolver.ts#L218)

#### Parameters

##### functionName

`string`

##### orgUnitId

`ObjectId`

##### input

[`DataInput`](../../../model/input/data.input/type-aliases/DataInput.md)

#### Returns

`Promise`\<\{ `message`: `string`; `result`: `Document`\<`unknown`, \{\}, [`EntityType`](../../../model/entity/entities.entity/type-aliases/EntityType.md)\> & [`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md) & `Required`\<\{\}\> & `object` \| [`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md) & `Required`\<\{\}\> & `object` \| [`Process`](../../../model/entity/process.entity/classes/Process.md) & `Required`\<\{\}\> & `object` \| [`Role`](../../../model/entity/roles.entity/classes/Role.md) & `Required`\<\{\}\> & `object` \| [`User`](../../../model/entity/user.entity/classes/User.md) & `Required`\<\{\}\> & `object`; `success`: `boolean`; \}\>

***

### updateEntity()

> **updateEntity**(`input`): `Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:126](https://github.com/FlowCraft-AG/RoleMapper/blob/bf5085d9e7de1fbc4b709bcc4add48f0b20f2b21/backend/src/role-mapper/resolver/mutation.resolver.ts#L126)

Aktualisiert eine bestehende Entität in der Datenbank.

#### Parameters

##### input

[`UpdateEntityInput`](../../../model/dto/update.dto/type-aliases/UpdateEntityInput.md)

#### Returns

`Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>
