[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/controller/read.controller](../README.md) / ReadController

# Class: ReadController

Defined in: [src/role-mapper/controller/read.controller.ts:80](https://github.com/FlowCraft-AG/RoleMapper/blob/536244048d4b335d6a9047c5d05cfa1a8bc97efb/backend/src/role-mapper/controller/read.controller.ts#L80)

ReadController

## Description

Controller für das Lesen von Rollen und Daten in der Role Mapper REST-API.

## Param

Der Service, der für das Lesen von Rollen und Daten verwendet wird.

## Method

getProcessRoles

## Description

Führt eine Abfrage aus, um die Rollen eines Prozesses zu erhalten.

## Param

Die ID des Prozesses.

## Param

Die ID des Benutzers.

## Param

Das HTTP-Request-Objekt.

## Method

getData

## Description

Dynamische Abfrage für beliebige Entitäten mit flexiblen Filtern.

## Param

Die Ziel-Entität (z. B. USERS, MANDATES).

## Param

Die Filterbedingungen.

## Throws

- Wenn die Entität nicht unterstützt wird.

## Method

validateEntity

## Description

Validiert, ob die angegebene Entität unterstützt wird.

## Param

Die zu validierende Entität.

## Throws

- Wenn die Entität nicht unterstützt wird.

## Method

#createHateoasLinks

## Description

Diese Funktion erstellt HATEOAS-Links basierend auf den RoleNames im RolePayload.
Sie fügt Links für jede Rolle in _links hinzu, um die Navigation zu ermöglichen.

## Param

Die Basis-URL, die zur Erstellung der Links verwendet wird.

## Param

Die Payload mit den Rollen und Benutzerdaten.

## Param

Die Prozess-ID, die zur Erstellung der Links verwendet wird.

## Param

Die Benutzer-ID, die zur Erstellung der Links verwendet wird.

## Constructors

### new ReadController()

> **new ReadController**(`readService`): [`ReadController`](ReadController.md)

Defined in: [src/role-mapper/controller/read.controller.ts:83](https://github.com/FlowCraft-AG/RoleMapper/blob/536244048d4b335d6a9047c5d05cfa1a8bc97efb/backend/src/role-mapper/controller/read.controller.ts#L83)

#### Parameters

##### readService

[`ReadService`](../../../service/read.service/classes/ReadService.md)

#### Returns

[`ReadController`](ReadController.md)

## Methods

### getData()

> **getData**(`request`, `entityType`, `field`?, `operator`?, `value`?, `limit`?, `offset`?): `Promise`\<[`DataPayloadRest`](../../../model/payload/data.payload/type-aliases/DataPayloadRest.md)\>

Defined in: [src/role-mapper/controller/read.controller.ts:183](https://github.com/FlowCraft-AG/RoleMapper/blob/536244048d4b335d6a9047c5d05cfa1a8bc97efb/backend/src/role-mapper/controller/read.controller.ts#L183)

Dynamische Abfrage für beliebige Entitäten mit flexiblen Filtern.

#### Parameters

##### request

`Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

##### entityType

[`EntityCategoryType`](../../../model/entity/entities.entity/type-aliases/EntityCategoryType.md)

Die Ziel-Entität (z. B. USERS, MANDATES).

##### field?

[`FilterField`](../../../model/types/filter.type/type-aliases/FilterField.md)

##### operator?

[`FilterOperator`](../../../model/types/filter.type/type-aliases/FilterOperator.md)

##### value?

`string`

##### limit?

`number` = `DEFAULT_LIMIT`

##### offset?

`number` = `0`

#### Returns

`Promise`\<[`DataPayloadRest`](../../../model/payload/data.payload/type-aliases/DataPayloadRest.md)\>

- Die gefilterten Daten.

#### Throws

- Wenn die Entität nicht unterstützt wird.

***

### getProcessRoles()

> **getProcessRoles**(`processId`, `userId`, `request`): `Promise`\<[`RolePayloadRest`](../../../model/payload/role-payload.type/type-aliases/RolePayloadRest.md)\>

Defined in: [src/role-mapper/controller/read.controller.ts:126](https://github.com/FlowCraft-AG/RoleMapper/blob/536244048d4b335d6a9047c5d05cfa1a8bc97efb/backend/src/role-mapper/controller/read.controller.ts#L126)

Führt eine Abfrage aus, um die Rollen eines Prozesses zu erhalten.

#### Parameters

##### processId

`string`

Die ID des Prozesses.

##### userId

`string`

Die ID des Benutzers.

##### request

`Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

#### Returns

`Promise`\<[`RolePayloadRest`](../../../model/payload/role-payload.type/type-aliases/RolePayloadRest.md)\>

- Die Rollen des Prozesses.
