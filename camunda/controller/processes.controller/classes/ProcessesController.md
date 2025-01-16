[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/controller/processes.controller](../README.md) / ProcessesController

# Class: ProcessesController

Defined in: [src/camunda/controller/processes.controller.ts:7](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/camunda/controller/processes.controller.ts#L7)

## Constructors

### new ProcessesController()

> **new ProcessesController**(`zeebeService`): [`ProcessesController`](ProcessesController.md)

Defined in: [src/camunda/controller/processes.controller.ts:11](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/camunda/controller/processes.controller.ts#L11)

#### Parameters

##### zeebeService

[`ZeebeService`](../../../../ZeebeService/classes/ZeebeService.md)

#### Returns

[`ProcessesController`](ProcessesController.md)

## Methods

### startProcess()

> **startProcess**(`body`): `Promise`\<`CreateProcessInstanceResponse`\>

Defined in: [src/camunda/controller/processes.controller.ts:17](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/camunda/controller/processes.controller.ts#L17)

#### Parameters

##### body

###### processKey

`string`

###### variables

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<`CreateProcessInstanceResponse`\>
