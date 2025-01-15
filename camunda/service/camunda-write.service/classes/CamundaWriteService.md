[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/service/camunda-write.service](../README.md) / CamundaWriteService

# Class: CamundaWriteService

Defined in: [src/camunda/service/camunda-write.service.ts:12](https://github.com/FlowCraft-AG/RoleMapper/blob/dfa0426eb5b55e53274c22382030e399befc29aa/backend/src/camunda/service/camunda-write.service.ts#L12)

## Constructors

### new CamundaWriteService()

> **new CamundaWriteService**(`httpService`): [`CamundaWriteService`](CamundaWriteService.md)

Defined in: [src/camunda/service/camunda-write.service.ts:16](https://github.com/FlowCraft-AG/RoleMapper/blob/dfa0426eb5b55e53274c22382030e399befc29aa/backend/src/camunda/service/camunda-write.service.ts#L16)

#### Parameters

##### httpService

`HttpService`

#### Returns

[`CamundaWriteService`](CamundaWriteService.md)

## Methods

### deleteProcessInstance()

> **deleteProcessInstance**(`key`, `token`): `Promise`\<`string`\>

Defined in: [src/camunda/service/camunda-write.service.ts:26](https://github.com/FlowCraft-AG/RoleMapper/blob/dfa0426eb5b55e53274c22382030e399befc29aa/backend/src/camunda/service/camunda-write.service.ts#L26)

Sucht Prozessinstanzen anhand eines Filters.

#### Parameters

##### key

`string`

##### token

`string`

Der Bearer-Token für die Authentifizierung.

#### Returns

`Promise`\<`string`\>

Eine Liste von Prozessinstanzen.
