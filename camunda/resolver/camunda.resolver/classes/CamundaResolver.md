[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/resolver/camunda.resolver](../README.md) / CamundaResolver

# Class: CamundaResolver

Defined in: [src/camunda/resolver/camunda.resolver.ts:62](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/camunda/resolver/camunda.resolver.ts#L62)

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

### new CamundaResolver()

> **new CamundaResolver**(`camundaService`): [`CamundaResolver`](CamundaResolver.md)

Defined in: [src/camunda/resolver/camunda.resolver.ts:79](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/camunda/resolver/camunda.resolver.ts#L79)

Konstruktor für den CamundaResolver.

#### Parameters

##### camundaService

[`CamundaReadService`](../../../service/camunda.service/classes/CamundaReadService.md)

Service für die Kommunikation mit der Camunda API.

#### Returns

[`CamundaResolver`](CamundaResolver.md)

## Methods

### getIncidentFlowNodeByProcessInstanceKey()

> **getIncidentFlowNodeByProcessInstanceKey**(`key`, `context`): `Promise`\<`string`\>

Defined in: [src/camunda/resolver/camunda.resolver.ts:281](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/camunda/resolver/camunda.resolver.ts#L281)

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

Defined in: [src/camunda/resolver/camunda.resolver.ts:266](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/camunda/resolver/camunda.resolver.ts#L266)

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

Defined in: [src/camunda/resolver/camunda.resolver.ts:110](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/camunda/resolver/camunda.resolver.ts#L110)

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

Defined in: [src/camunda/resolver/camunda.resolver.ts:156](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/camunda/resolver/camunda.resolver.ts#L156)

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

Defined in: [src/camunda/resolver/camunda.resolver.ts:194](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/camunda/resolver/camunda.resolver.ts#L194)

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

Defined in: [src/camunda/resolver/camunda.resolver.ts:232](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/camunda/resolver/camunda.resolver.ts#L232)

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
