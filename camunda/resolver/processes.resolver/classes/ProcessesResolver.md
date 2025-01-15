[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/resolver/processes.resolver](../README.md) / ProcessesResolver

# Class: ProcessesResolver

Defined in: [src/camunda/resolver/processes.resolver.ts:7](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/camunda/resolver/processes.resolver.ts#L7)

## Constructors

### new ProcessesResolver()

> **new ProcessesResolver**(`zeebeService`): [`ProcessesResolver`](ProcessesResolver.md)

Defined in: [src/camunda/resolver/processes.resolver.ts:11](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/camunda/resolver/processes.resolver.ts#L11)

#### Parameters

##### zeebeService

[`ZeebeService`](../../../../ZeebeService/classes/ZeebeService.md)

#### Returns

[`ProcessesResolver`](ProcessesResolver.md)

## Methods

### cancelProcessInstance()

> **cancelProcessInstance**(`processInstanceKey`): `Promise`\<`string`\>

Defined in: [src/camunda/resolver/processes.resolver.ts:42](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/camunda/resolver/processes.resolver.ts#L42)

#### Parameters

##### processInstanceKey

`string`

#### Returns

`Promise`\<`string`\>

***

### startProcess()

> **startProcess**(`processKey`, `userId`): `Promise`\<`string`\>

Defined in: [src/camunda/resolver/processes.resolver.ts:17](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/camunda/resolver/processes.resolver.ts#L17)

#### Parameters

##### processKey

`string`

##### userId

`string`

#### Returns

`Promise`\<`string`\>
