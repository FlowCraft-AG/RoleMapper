[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/resolver/processes.resolver](../README.md) / ProcessesResolver

# Class: ProcessesResolver

Defined in: [src/camunda/resolver/processes.resolver.ts:8](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/resolver/processes.resolver.ts#L8)

## Constructors

### new ProcessesResolver()

> **new ProcessesResolver**(`zeebeService`): [`ProcessesResolver`](ProcessesResolver.md)

Defined in: [src/camunda/resolver/processes.resolver.ts:12](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/resolver/processes.resolver.ts#L12)

#### Parameters

##### zeebeService

[`ZeebeService`](../../../../ZeebeService/classes/ZeebeService.md)

#### Returns

[`ProcessesResolver`](ProcessesResolver.md)

## Methods

### cancelProcessInstance()

> **cancelProcessInstance**(`processInstanceKey`): `Promise`\<`string`\>

Defined in: [src/camunda/resolver/processes.resolver.ts:48](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/resolver/processes.resolver.ts#L48)

#### Parameters

##### processInstanceKey

`string`

#### Returns

`Promise`\<`string`\>

***

### startProcess()

> **startProcess**(`processKey`, `userId`): `Promise`\<[`CreateProcessInstancePayload`](../../../types/payload/create-process-instance.payload/type-aliases/CreateProcessInstancePayload.md)\>

Defined in: [src/camunda/resolver/processes.resolver.ts:18](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/resolver/processes.resolver.ts#L18)

#### Parameters

##### processKey

`string`

##### userId

`string`

#### Returns

`Promise`\<[`CreateProcessInstancePayload`](../../../types/payload/create-process-instance.payload/type-aliases/CreateProcessInstancePayload.md)\>
