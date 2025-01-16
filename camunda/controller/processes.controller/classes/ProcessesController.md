[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/controller/processes.controller](../README.md) / ProcessesController

# Class: ProcessesController

Defined in: [src/camunda/controller/processes.controller.ts:7](https://github.com/FlowCraft-AG/RoleMapper/blob/5b9ee56819f4990f54c16dcad37384ac73c1551c/backend/src/camunda/controller/processes.controller.ts#L7)

## Constructors

### new ProcessesController()

> **new ProcessesController**(`zeebeService`): [`ProcessesController`](ProcessesController.md)

Defined in: [src/camunda/controller/processes.controller.ts:11](https://github.com/FlowCraft-AG/RoleMapper/blob/5b9ee56819f4990f54c16dcad37384ac73c1551c/backend/src/camunda/controller/processes.controller.ts#L11)

#### Parameters

##### zeebeService

[`ZeebeService`](../../../../ZeebeService/classes/ZeebeService.md)

#### Returns

[`ProcessesController`](ProcessesController.md)

## Methods

### startProcess()

> **startProcess**(`body`): `Promise`\<`CreateProcessInstanceResponse`\>

Defined in: [src/camunda/controller/processes.controller.ts:17](https://github.com/FlowCraft-AG/RoleMapper/blob/5b9ee56819f4990f54c16dcad37384ac73c1551c/backend/src/camunda/controller/processes.controller.ts#L17)

#### Parameters

##### body

###### processKey

`string`

###### variables

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<`CreateProcessInstanceResponse`\>
