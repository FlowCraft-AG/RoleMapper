[**RoleMapper Backend API Documentation v2024.11.28**](../../README.md)

***

[RoleMapper Backend API Documentation](../../modules.md) / [ZeebeService](../README.md) / ZeebeService

# Class: ZeebeService

Defined in: [src/camunda/service/zeebe.service.ts:20](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/service/zeebe.service.ts#L20)

## Implements

- `OnModuleInit`
- `OnModuleDestroy`

## Constructors

### new ZeebeService()

> **new ZeebeService**(`service`): [`ZeebeService`](ZeebeService.md)

Defined in: [src/camunda/service/zeebe.service.ts:38](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/service/zeebe.service.ts#L38)

#### Parameters

##### service

[`ReadService`](../../role-mapper/service/read.service/classes/ReadService.md)

Instanz des ReadService zur Rollenabfrage

#### Returns

[`ZeebeService`](ZeebeService.md)

## Methods

### cancelProcessInstance()

> **cancelProcessInstance**(`processInstanceKey`): `Promise`\<`void`\>

Defined in: [src/camunda/service/zeebe.service.ts:106](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/service/zeebe.service.ts#L106)

#### Parameters

##### processInstanceKey

`string`

#### Returns

`Promise`\<`void`\>

***

### onModuleDestroy()

> **onModuleDestroy**(): `Promise`\<`void`\>

Defined in: [src/camunda/service/zeebe.service.ts:63](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/service/zeebe.service.ts#L63)

Beendet den Zeebe-Service und schließt die Worker sowie den Client.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

***

### onModuleInit()

> **onModuleInit**(): `void`

Defined in: [src/camunda/service/zeebe.service.ts:47](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/service/zeebe.service.ts#L47)

Initialisiert den Zeebe-Service und registriert die Worker.

#### Returns

`void`

#### Implementation of

`OnModuleInit.onModuleInit`

***

### startProcess()

> **startProcess**(`processKey`, `variables`): `Promise`\<`CreateProcessInstanceResponse`\>

Defined in: [src/camunda/service/zeebe.service.ts:83](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/camunda/service/zeebe.service.ts#L83)

Startet einen neuen Prozess mit den angegebenen Variablen.

#### Parameters

##### processKey

`string`

Der Schlüssel des BPMN-Prozesses

##### variables

`Record`\<`string`, `any`\>

Variablen für den Prozess

#### Returns

`Promise`\<`CreateProcessInstanceResponse`\>

#### Throws

Fehler, wenn Zeebe deaktiviert ist oder der Prozessstart fehlschlägt
