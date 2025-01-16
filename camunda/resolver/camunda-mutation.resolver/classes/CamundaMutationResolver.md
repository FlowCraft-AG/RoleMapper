[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/resolver/camunda-mutation.resolver](../README.md) / CamundaMutationResolver

# Class: CamundaMutationResolver

Defined in: [src/camunda/resolver/camunda-mutation.resolver.ts:55](https://github.com/FlowCraft-AG/RoleMapper/blob/64577d705cc4c579b4cd41d48895a5fa1f3b9249/backend/src/camunda/resolver/camunda-mutation.resolver.ts#L55)

GraphQL-Resolver für die Verarbeitung von Anfragen an die Camunda Platform API.

Dieser Resolver unterstützt:
- Abfragen von Aufgaben
- Abruf von Prozessinstanzen
- Zugriff auf Prozessdefinitionen

Alle Anfragen nutzen:
- Authentifizierung über Keycloak
- Logging
- Fehlerbehandlung

## Constructors

### new CamundaMutationResolver()

> **new CamundaMutationResolver**(`camundaService`): [`CamundaMutationResolver`](CamundaMutationResolver.md)

Defined in: [src/camunda/resolver/camunda-mutation.resolver.ts:72](https://github.com/FlowCraft-AG/RoleMapper/blob/64577d705cc4c579b4cd41d48895a5fa1f3b9249/backend/src/camunda/resolver/camunda-mutation.resolver.ts#L72)

Konstruktor für den CamundaResolver.

#### Parameters

##### camundaService

[`CamundaWriteService`](../../../service/camunda-write.service/classes/CamundaWriteService.md)

Service für die Kommunikation mit der Camunda API.

#### Returns

[`CamundaMutationResolver`](CamundaMutationResolver.md)

## Methods

### completeUserTask()

> **completeUserTask**(`taskId`, `variables`, `context`): `Promise`\<[`Task`](../../../types/task.type/type-aliases/Task.md)\>

Defined in: [src/camunda/resolver/camunda-mutation.resolver.ts:93](https://github.com/FlowCraft-AG/RoleMapper/blob/64577d705cc4c579b4cd41d48895a5fa1f3b9249/backend/src/camunda/resolver/camunda-mutation.resolver.ts#L93)

#### Parameters

##### taskId

`string`

##### variables

`Record`\<`string`, `any`\>

##### context

[`GraphQLContext`](../type-aliases/GraphQLContext.md)

#### Returns

`Promise`\<[`Task`](../../../types/task.type/type-aliases/Task.md)\>

***

### deleteProcessInstance()

> **deleteProcessInstance**(`key`, `context`): `Promise`\<`string`\>

Defined in: [src/camunda/resolver/camunda-mutation.resolver.ts:78](https://github.com/FlowCraft-AG/RoleMapper/blob/64577d705cc4c579b4cd41d48895a5fa1f3b9249/backend/src/camunda/resolver/camunda-mutation.resolver.ts#L78)

#### Parameters

##### key

`string`

##### context

[`GraphQLContext`](../type-aliases/GraphQLContext.md)

#### Returns

`Promise`\<`string`\>
