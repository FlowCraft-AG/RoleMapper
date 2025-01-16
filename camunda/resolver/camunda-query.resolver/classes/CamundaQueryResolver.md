[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/resolver/camunda-query.resolver](../README.md) / CamundaQueryResolver

# Class: CamundaQueryResolver

Defined in: [src/camunda/resolver/camunda-query.resolver.ts:64](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/resolver/camunda-query.resolver.ts#L64)

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

### new CamundaQueryResolver()

> **new CamundaQueryResolver**(`camundaService`): [`CamundaQueryResolver`](CamundaQueryResolver.md)

Defined in: [src/camunda/resolver/camunda-query.resolver.ts:81](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/resolver/camunda-query.resolver.ts#L81)

Konstruktor für den CamundaResolver.

#### Parameters

##### camundaService

[`CamundaReadService`](../../../service/camunda-read.service/classes/CamundaReadService.md)

Service für die Kommunikation mit der Camunda API.

#### Returns

[`CamundaQueryResolver`](CamundaQueryResolver.md)

## Methods

### getIncidentFlowNodeByProcessInstanceKey()

> **getIncidentFlowNodeByProcessInstanceKey**(`key`, `context`): `Promise`\<`string`\>

Defined in: [src/camunda/resolver/camunda-query.resolver.ts:283](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/resolver/camunda-query.resolver.ts#L283)

#### Parameters

##### key

`string`

##### context

[`GraphQLContext`](../type-aliases/GraphQLContext.md)

#### Returns

`Promise`\<`string`\>

***

### getProcessDefinitionXmlByKey()

> **getProcessDefinitionXmlByKey**(`key`, `context`): `Promise`\<`string`\>

Defined in: [src/camunda/resolver/camunda-query.resolver.ts:268](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/resolver/camunda-query.resolver.ts#L268)

**XML-Definition einer Prozessdefinition abrufen**

Ruft die XML-Definition einer bestimmten Prozessdefinition ab.

#### Parameters

##### key

`string`

Schlüssel der Prozessdefinition.

##### context

[`GraphQLContext`](../type-aliases/GraphQLContext.md)

GraphQL-Kontext mit den Request-Headern.

#### Returns

`Promise`\<`string`\>

XML-Definition der Prozessdefinition.

#### Example

```graphql
query {
  getProcessDefinitionXmlByKey(processDefinitionKey: "process123") {
    xml
  }
}
```

***

### getProcessInstancesByUserId()

> **getProcessInstancesByUserId**(`userId`, `context`): `Promise`\<[`ProcessInstance`](../../../types/process-instance.type/type-aliases/ProcessInstance.md)[]\>

Defined in: [src/camunda/resolver/camunda-query.resolver.ts:112](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/resolver/camunda-query.resolver.ts#L112)

**Prozessinstanzen eines Benutzers abrufen**

Ruft die Prozessinstanzen ab, die einem bestimmten Benutzer zugeordnet sind.

#### Parameters

##### userId

`string`

ID des Benutzers, dessen Prozessinstanzen abgerufen werden sollen.

##### context

[`GraphQLContext`](../type-aliases/GraphQLContext.md)

GraphQL-Kontext mit den Request-Headern.

#### Returns

`Promise`\<[`ProcessInstance`](../../../types/process-instance.type/type-aliases/ProcessInstance.md)[]\>

Liste der Prozessinstanzen des Benutzers.

#### Example

```graphql
query {
  getProcessesByUserId(userId: "user1234") {
    key
    processVersion
    bpmnProcessId
    startDate
    state
    incident
    processDefinitionKey
    tenantId
  }
}
```

***

### getProzessListe()

> **getProzessListe**(`filter`, `context`): `Promise`\<[`ProcessInstance`](../../../types/process-instance.type/type-aliases/ProcessInstance.md)[]\>

Defined in: [src/camunda/resolver/camunda-query.resolver.ts:158](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/resolver/camunda-query.resolver.ts#L158)

**Prozessinstanzen filtern**

Ruft Prozessinstanzen basierend auf den angegebenen Filterkriterien ab.

#### Parameters

##### filter

[`ProcessInstanceFilter`](../../../types/input-filter/process-instance-filter/type-aliases/ProcessInstanceFilter.md)

Filterkriterien für die Prozessinstanzen.

##### context

[`GraphQLContext`](../type-aliases/GraphQLContext.md)

GraphQL-Kontext mit den Request-Headern.

#### Returns

`Promise`\<[`ProcessInstance`](../../../types/process-instance.type/type-aliases/ProcessInstance.md)[]\>

Liste der gefilterten Prozessinstanzen.

#### Example

```graphql
query {
  getCamundaProcesses(filter: { filter: { state: "ACTIVE" } }) {
    key
    processVersion
    bpmnProcessId
    startDate
    state
    incident
    processDefinitionKey
    tenantId
  }
}
```

***

### getTasks()

> **getTasks**(`filter`, `context`): `Promise`\<[`Task`](../../../types/task.type/type-aliases/Task.md)[]\>

Defined in: [src/camunda/resolver/camunda-query.resolver.ts:196](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/resolver/camunda-query.resolver.ts#L196)

**Aufgaben filtern**

Ruft Aufgaben basierend auf den angegebenen Filterkriterien ab.

#### Parameters

##### filter

[`TaskFilter`](../../../types/input-filter/task-filter/type-aliases/TaskFilter.md)

Filterkriterien für die Aufgaben.

##### context

[`GraphQLContext`](../type-aliases/GraphQLContext.md)

GraphQL-Kontext mit den Request-Headern.

#### Returns

`Promise`\<[`Task`](../../../types/task.type/type-aliases/Task.md)[]\>

Liste der gefilterten Aufgaben.

#### Example

```graphql
query {
  getTasks(filter: { filter: { candidateUser: "user123" } }) {
    id
    name
    taskState
    assignee
    processDefinitionKey
    processInstanceKey
  }
}
```

***

### getTaskVariables()

> **getTaskVariables**(`filter`, `context`): `Promise`\<[`ProcessVariable`](../../../types/process-variable.type/type-aliases/ProcessVariable.md)[]\>

Defined in: [src/camunda/resolver/camunda-query.resolver.ts:234](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/resolver/camunda-query.resolver.ts#L234)

**Variablen einer Aufgabe suchen**

Ruft Variablen basierend auf den angegebenen Filterkriterien ab.

#### Parameters

##### filter

[`VariableFilter`](../../../types/input-filter/variable-filter/type-aliases/VariableFilter.md)

Filterkriterien für die Variablen.

##### context

[`GraphQLContext`](../type-aliases/GraphQLContext.md)

GraphQL-Kontext mit den Request-Headern.

#### Returns

`Promise`\<[`ProcessVariable`](../../../types/process-variable.type/type-aliases/ProcessVariable.md)[]\>

Liste der gefundenen Variablen.

#### Example

```graphql
query {
  searchTaskVariables(filter: { filter: { name: "variableName" } }) {
    key
    name
    value
    type
    truncated
    tenantId
  }
}
```
