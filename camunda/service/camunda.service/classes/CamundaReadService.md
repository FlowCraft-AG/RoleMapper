[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/service/camunda.service](../README.md) / CamundaReadService

# Class: CamundaReadService

Defined in: [src/camunda/service/camunda.service.ts:21](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/camunda/service/camunda.service.ts#L21)

## Constructors

### new CamundaReadService()

> **new CamundaReadService**(`httpService`): [`CamundaReadService`](CamundaReadService.md)

Defined in: [src/camunda/service/camunda.service.ts:25](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/camunda/service/camunda.service.ts#L25)

#### Parameters

##### httpService

`HttpService`

#### Returns

[`CamundaReadService`](CamundaReadService.md)

## Methods

### fetchFlowNodes()

> **fetchFlowNodes**(`filter`, `token`): `Promise`\<[`FlowNode`](../../../types/flownode.type/type-aliases/FlowNode.md)[]\>

Defined in: [src/camunda/service/camunda.service.ts:171](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/camunda/service/camunda.service.ts#L171)

Ruft FlowNodes basierend auf den angegebenen Filterkriterien ab.

#### Parameters

##### filter

[`FlowNodeFilter`](../../../types/input-filter/flownode-filter/type-aliases/FlowNodeFilter.md)

Die Filterkriterien für die Suche nach FlowNodes.
 - `processInstanceKey` (optional): Der Schlüssel der zugehörigen Prozessinstanz.
 - `processDefinitionKey` (optional): Der Schlüssel der Prozessdefinition.
 - `startDate` (optional): Das Startdatum im ISO-Format, um FlowNodes zu finden, die nach diesem Zeitpunkt gestartet wurden.
 - `endDate` (optional): Das Enddatum im ISO-Format, um FlowNodes zu finden, die vor diesem Zeitpunkt beendet wurden.
 - `flowNodeId` (optional): Die eindeutige ID der FlowNode.
 - `flowNodeName` (optional): Der Name der FlowNode.
 - `incidentKey` (optional): Der Schlüssel des zugehörigen Incidents.
 - `type` (optional): Der Typ der FlowNode (z. B. "User Task", "Service Task").
 - `state` (optional): Der Zustand der FlowNode (z. B. "ACTIVE", "COMPLETED").
 - `incident` (optional): Gibt an, ob ein Incident mit der FlowNode verknüpft ist.

##### token

`string`

Das Bearer-Token zur Authentifizierung der Anfrage.

#### Returns

`Promise`\<[`FlowNode`](../../../types/flownode.type/type-aliases/FlowNode.md)[]\>

Ein Promise, das eine Liste von FlowNodes zurückgibt.

#### Example

```typescript
const filter: FlowNodeFilter = {
    processInstanceKey: 12345,
    state: 'ACTIVE',
};
const token = 'Bearer eyJ...';
const flowNodes = await service.fetchFlowNodes(filter, token);
console.log(flowNodes);
```

#### Throws

Wenn die Anfrage fehlschlägt oder keine FlowNodes gefunden werden.

***

### fetchIncidents()

> **fetchIncidents**(`filter`, `token`): `Promise`\<[`Incident`](../../../types/incident.type/type-aliases/Incident.md)[]\>

Defined in: [src/camunda/service/camunda.service.ts:127](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/camunda/service/camunda.service.ts#L127)

Ruft eine Liste von Incidents basierend auf den angegebenen Filterkriterien ab.

#### Parameters

##### filter

[`IncidentFilter`](../../../types/input-filter/incident-filter/type-aliases/IncidentFilter.md)

Die Filterkriterien zur Einschränkung der Incidentsuche.

##### token

`string`

Der Bearer-Token für die Authentifizierung.

#### Returns

`Promise`\<[`Incident`](../../../types/incident.type/type-aliases/Incident.md)[]\>

Ein Promise, das eine Liste von Incident-Objekten zurückgibt.

#### Throws

Wenn die Anfrage fehlschlägt oder eine ungültige Antwort zurückgegeben wird.

#### Example

```typescript
const filter: IncidentFilter = {
  processInstanceKey: '12345',
  state: 'ACTIVE',
};
const token = 'Bearer eyJ...';
const incidents = await fetchIncidents(filter, token);
console.log(incidents);
```

***

### fetchProcessDefinitionXml()

> **fetchProcessDefinitionXml**(`key`, `token`): `Promise`\<`string`\>

Defined in: [src/camunda/service/camunda.service.ts:94](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/camunda/service/camunda.service.ts#L94)

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

Defined in: [src/camunda/service/camunda.service.ts:35](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/camunda/service/camunda.service.ts#L35)

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

Defined in: [src/camunda/service/camunda.service.ts:59](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/camunda/service/camunda.service.ts#L59)

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

Defined in: [src/camunda/service/camunda.service.ts:73](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/camunda/service/camunda.service.ts#L73)

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
