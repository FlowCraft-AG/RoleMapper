[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/service/zeebe.service](../README.md) / ZeebeService

# Class: ZeebeService

Defined in: [src/camunda/service/zeebe.service.ts:14](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/camunda/service/zeebe.service.ts#L14)

## Implements

- `OnModuleInit`
- `OnModuleDestroy`

## Constructors

### new ZeebeService()

> **new ZeebeService**(`service`): [`ZeebeService`](ZeebeService.md)

Defined in: [src/camunda/service/zeebe.service.ts:22](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/camunda/service/zeebe.service.ts#L22)

#### Parameters

##### service

[`ReadService`](../../../../role-mapper/service/read.service/classes/ReadService.md)

#### Returns

[`ZeebeService`](ZeebeService.md)

## Methods

### onModuleDestroy()

> **onModuleDestroy**(): `Promise`\<`void`\>

Defined in: [src/camunda/service/zeebe.service.ts:40](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/camunda/service/zeebe.service.ts#L40)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

***

### onModuleInit()

> **onModuleInit**(): `void`

Defined in: [src/camunda/service/zeebe.service.ts:28](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/camunda/service/zeebe.service.ts#L28)

#### Returns

`void`

#### Implementation of

`OnModuleInit.onModuleInit`

***

### startProcess()

> **startProcess**(`processKey`, `variables`): `Promise`\<`CreateProcessInstanceResponse`\>

Defined in: [src/camunda/service/zeebe.service.ts:54](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/camunda/service/zeebe.service.ts#L54)

#### Parameters

##### processKey

`string`

##### variables

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<`CreateProcessInstanceResponse`\>
