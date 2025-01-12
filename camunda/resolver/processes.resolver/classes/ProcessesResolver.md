[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/resolver/processes.resolver](../README.md) / ProcessesResolver

# Class: ProcessesResolver

Defined in: [src/camunda/resolver/processes.resolver.ts:7](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/camunda/resolver/processes.resolver.ts#L7)

## Constructors

### new ProcessesResolver()

> **new ProcessesResolver**(`zeebeService`): [`ProcessesResolver`](ProcessesResolver.md)

Defined in: [src/camunda/resolver/processes.resolver.ts:11](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/camunda/resolver/processes.resolver.ts#L11)

#### Parameters

##### zeebeService

[`ZeebeService`](../../../service/zeebe.service/classes/ZeebeService.md)

#### Returns

[`ProcessesResolver`](ProcessesResolver.md)

## Methods

### startProcess()

> **startProcess**(`processKey`, `variables`): `Promise`\<`string`\>

Defined in: [src/camunda/resolver/processes.resolver.ts:17](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/camunda/resolver/processes.resolver.ts#L17)

#### Parameters

##### processKey

`string`

##### variables

`string`

#### Returns

`Promise`\<`string`\>
