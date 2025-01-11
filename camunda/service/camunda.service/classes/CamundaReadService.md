[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/service/camunda.service](../README.md) / CamundaReadService

# Class: CamundaReadService

Defined in: [src/camunda/service/camunda.service.ts:17](https://github.com/FlowCraft-AG/RoleMapper/blob/0866b6f41cea733d4aaa92f0b3af0d2c56ad4eea/backend/src/camunda/service/camunda.service.ts#L17)

## Constructors

### new CamundaReadService()

> **new CamundaReadService**(`httpService`): [`CamundaReadService`](CamundaReadService.md)

Defined in: [src/camunda/service/camunda.service.ts:21](https://github.com/FlowCraft-AG/RoleMapper/blob/0866b6f41cea733d4aaa92f0b3af0d2c56ad4eea/backend/src/camunda/service/camunda.service.ts#L21)

#### Parameters

##### httpService

`HttpService`

#### Returns

[`CamundaReadService`](CamundaReadService.md)

## Methods

### fetchProcessDefinitionXml()

> **fetchProcessDefinitionXml**(`key`, `token`): `Promise`\<`string`\>

Defined in: [src/camunda/service/camunda.service.ts:90](https://github.com/FlowCraft-AG/RoleMapper/blob/0866b6f41cea733d4aaa92f0b3af0d2c56ad4eea/backend/src/camunda/service/camunda.service.ts#L90)

Ruft die XML-Definition einer Prozessdefinition basierend auf ihrem Schlüssel ab.

#### Parameters

##### key

`string`

Der Prozessschlüssel.

##### token

`string`

Der Bearer-Token für die Authentifizierung.

#### Returns

`Promise`\<`string`\>

Die Prozessdefinition als XML-String.

***

### fetchProcessInstances()

> **fetchProcessInstances**(`filter`, `token`): `Promise`\<[`ProcessInstance`](../../../types/process-instance.type/type-aliases/ProcessInstance.md)[]\>

Defined in: [src/camunda/service/camunda.service.ts:31](https://github.com/FlowCraft-AG/RoleMapper/blob/0866b6f41cea733d4aaa92f0b3af0d2c56ad4eea/backend/src/camunda/service/camunda.service.ts#L31)

Sucht Prozessinstanzen anhand eines Filters.

#### Parameters

##### filter

[`ProcessInstanceFilter`](../../../types/input-filter/process-instance-filter/type-aliases/ProcessInstanceFilter.md)

Der Filter für die Suche.

##### token

`string`

Der Bearer-Token für die Authentifizierung.

#### Returns

`Promise`\<[`ProcessInstance`](../../../types/process-instance.type/type-aliases/ProcessInstance.md)[]\>

Eine Liste von Prozessinstanzen.

***

### fetchProcessTasks()

> **fetchProcessTasks**(`filter`, `token`): `Promise`\<[`Task`](../../../types/task.type/type-aliases/Task.md)[]\>

Defined in: [src/camunda/service/camunda.service.ts:55](https://github.com/FlowCraft-AG/RoleMapper/blob/0866b6f41cea733d4aaa92f0b3af0d2c56ad4eea/backend/src/camunda/service/camunda.service.ts#L55)

Sucht Aufgaben basierend auf einem Filter.

#### Parameters

##### filter

[`TaskFilter`](../../../types/input-filter/task-filter/type-aliases/TaskFilter.md)

Der Filter für die Suche.

##### token

`string`

Der Bearer-Token für die Authentifizierung.

#### Returns

`Promise`\<[`Task`](../../../types/task.type/type-aliases/Task.md)[]\>

Eine Liste von Aufgaben.

***

### fetchProcessVariables()

> **fetchProcessVariables**(`filter`, `token`): `Promise`\<[`ProcessVariable`](../../../types/process-variable.type/type-aliases/ProcessVariable.md)[]\>

Defined in: [src/camunda/service/camunda.service.ts:69](https://github.com/FlowCraft-AG/RoleMapper/blob/0866b6f41cea733d4aaa92f0b3af0d2c56ad4eea/backend/src/camunda/service/camunda.service.ts#L69)

Sucht Variablen basierend auf einem Filter.

#### Parameters

##### filter

[`VariableFilter`](../../../types/input-filter/variable-filter/type-aliases/VariableFilter.md)

Der Filter für die Suche.

##### token

`string`

Der Bearer-Token für die Authentifizierung.

#### Returns

`Promise`\<[`ProcessVariable`](../../../types/process-variable.type/type-aliases/ProcessVariable.md)[]\>

Eine Liste von Variablen.
