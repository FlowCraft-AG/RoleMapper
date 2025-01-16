[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/service/camunda-write.service](../README.md) / CamundaWriteService

# Class: CamundaWriteService

Defined in: [src/camunda/service/camunda-write.service.ts:13](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/service/camunda-write.service.ts#L13)

## Constructors

### new CamundaWriteService()

> **new CamundaWriteService**(`httpService`): [`CamundaWriteService`](CamundaWriteService.md)

Defined in: [src/camunda/service/camunda-write.service.ts:17](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/service/camunda-write.service.ts#L17)

#### Parameters

##### httpService

`HttpService`

#### Returns

[`CamundaWriteService`](CamundaWriteService.md)

## Methods

### completeUserTask()

> **completeUserTask**(`taskId`, `token`, `variables`?): `Promise`\<[`Task`](../../../types/task.type/type-aliases/Task.md)\>

Defined in: [src/camunda/service/camunda-write.service.ts:38](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/service/camunda-write.service.ts#L38)

#### Parameters

##### taskId

`string`

##### token

`string`

##### variables?

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<[`Task`](../../../types/task.type/type-aliases/Task.md)\>

***

### deleteProcessInstance()

> **deleteProcessInstance**(`key`, `token`): `Promise`\<`string`\>

Defined in: [src/camunda/service/camunda-write.service.ts:27](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/service/camunda-write.service.ts#L27)

Sucht Prozessinstanzen anhand eines Filters.

#### Parameters

##### key

`string`

##### token

`string`

Der Bearer-Token für die Authentifizierung.

#### Returns

`Promise`\<`string`\>

Eine Liste von Prozessinstanzen.
