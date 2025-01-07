[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/service/read.service](../README.md) / ReadService

# Class: ReadService

Defined in: [src/role-mapper/service/read.service.ts:36](https://github.com/FlowCraft-AG/RoleMapper/blob/2b9cb86a69a058eebb4388dc6380ab3f35004bd1/backend/src/role-mapper/service/read.service.ts#L36)

Der Service, der alle Leseoperationen für Entitäten wie Benutzer, Prozesse und Mandate behandelt.

Verantwortlich für das Abrufen von Entitätsdaten aus der Datenbank und das Erstellen von dynamischen Abfragen
basierend auf gegebenen Filtern.

## Constructors

### new ReadService()

> **new ReadService**(`userModel`, `processModel`, `mandateModel`, `orgUnitModel`, `roleModel`): [`ReadService`](ReadService.md)

Defined in: [src/role-mapper/service/read.service.ts:51](https://github.com/FlowCraft-AG/RoleMapper/blob/2b9cb86a69a058eebb4388dc6380ab3f35004bd1/backend/src/role-mapper/service/read.service.ts#L51)

Konstruktor für den Service, der die Mongoose-Modelle injiziert.

#### Parameters

##### userModel

`Model`\<[`UserDocument`](../../../model/entity/user.entity/type-aliases/UserDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`UserDocument`](../../../model/entity/user.entity/type-aliases/UserDocument.md)\> & [`User`](../../../model/entity/user.entity/classes/User.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

Modell für Benutzer.

##### processModel

`Model`\<[`ProcessDocument`](../../../model/entity/process.entity/type-aliases/ProcessDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`ProcessDocument`](../../../model/entity/process.entity/type-aliases/ProcessDocument.md)\> & [`Process`](../../../model/entity/process.entity/classes/Process.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

Modell für Prozesse.

##### mandateModel

`Model`\<[`MandateDocument`](../../../model/entity/mandates.entity/type-aliases/MandateDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`MandateDocument`](../../../model/entity/mandates.entity/type-aliases/MandateDocument.md)\> & [`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

Modell für Mandate.

##### orgUnitModel

`Model`\<[`OrgUnitDocument`](../../../model/entity/org-unit.entity/type-aliases/OrgUnitDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`OrgUnitDocument`](../../../model/entity/org-unit.entity/type-aliases/OrgUnitDocument.md)\> & [`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

Modell für organisatorische Einheiten.

##### roleModel

`Model`\<[`RoleDocument`](../../../model/entity/roles.entity/type-aliases/RoleDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`RoleDocument`](../../../model/entity/roles.entity/type-aliases/RoleDocument.md)\> & [`Role`](../../../model/entity/roles.entity/classes/Role.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

Modell für Rollen.

#### Returns

[`ReadService`](ReadService.md)

## Methods

### buildFilterQuery()

> **buildFilterQuery**(`filter`?): `FilterQuery`\<`any`\>

Defined in: [src/role-mapper/service/read.service.ts:235](https://github.com/FlowCraft-AG/RoleMapper/blob/2b9cb86a69a058eebb4388dc6380ab3f35004bd1/backend/src/role-mapper/service/read.service.ts#L235)

Erstellt rekursiv eine MongoDB-Filter-Query basierend auf den angegebenen Bedingungen.

#### Parameters

##### filter?

[`FilterInput`](../../../model/input/filter.input/type-aliases/FilterInput.md)

Die Filterbedingungen.

#### Returns

`FilterQuery`\<`any`\>

Die generierte MongoDB-Query.

#### Throws

Wenn ein ungültiger Operator angegeben wird.

#### Throws

Wenn ein unvollständiger Filter angegeben wird.

***

### buildSortQuery()

> **buildSortQuery**(`orderBy`?): `Record`\<`string`, `-1` \| `1`\>

Defined in: [src/role-mapper/service/read.service.ts:283](https://github.com/FlowCraft-AG/RoleMapper/blob/2b9cb86a69a058eebb4388dc6380ab3f35004bd1/backend/src/role-mapper/service/read.service.ts#L283)

Erstellt eine Sortier-Query basierend auf den angegebenen Bedingungen.

#### Parameters

##### orderBy?

[`SortInput`](../../../model/input/sort.input/type-aliases/SortInput.md)

Die Sortierbedingungen.

#### Returns

`Record`\<`string`, `-1` \| `1`\>

Die generierte Sortier-Query.

***

### executeSavedQuery()

> **executeSavedQuery**(`id`): `Promise`\<\{ `data`: [`EntityType`](../../../model/entity/entities.entity/type-aliases/EntityType.md)[]; `functionName`: `string`; \}\>

Defined in: [src/role-mapper/service/read.service.ts:149](https://github.com/FlowCraft-AG/RoleMapper/blob/2b9cb86a69a058eebb4388dc6380ab3f35004bd1/backend/src/role-mapper/service/read.service.ts#L149)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<\{ `data`: [`EntityType`](../../../model/entity/entities.entity/type-aliases/EntityType.md)[]; `functionName`: `string`; \}\>

***

### findAncestors()

> **findAncestors**(`id`): `Promise`\<[`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md)[]\>

Defined in: [src/role-mapper/service/read.service.ts:358](https://github.com/FlowCraft-AG/RoleMapper/blob/2b9cb86a69a058eebb4388dc6380ab3f35004bd1/backend/src/role-mapper/service/read.service.ts#L358)

#### Parameters

##### id

`ObjectId`

#### Returns

`Promise`\<[`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md)[]\>

***

### findData()

> **findData**\<`T`\>(`entity`, `filter`?, `pagination`?, `orderBy`?): `Promise`\<`T`[]\>

Defined in: [src/role-mapper/service/read.service.ts:181](https://github.com/FlowCraft-AG/RoleMapper/blob/2b9cb86a69a058eebb4388dc6380ab3f35004bd1/backend/src/role-mapper/service/read.service.ts#L181)

Führt eine dynamische Filterung für eine angegebene Entität durch.

#### Type Parameters

• **T** *extends* [`EntityType`](../../../model/entity/entities.entity/type-aliases/EntityType.md)

#### Parameters

##### entity

[`EntityCategoryType`](../../../model/entity/entities.entity/type-aliases/EntityCategoryType.md)

Der Name der Ziel-Entität (z. B. `users`, `mandates`).

##### filter?

[`FilterInput`](../../../model/input/filter.input/type-aliases/FilterInput.md)

Die Filterbedingungen.

##### pagination?

[`PaginationParameters`](../../../model/input/pagination-parameters/type-aliases/PaginationParameters.md)

Parameter für die Seitennummerierung.

##### orderBy?

[`SortInput`](../../../model/input/sort.input/type-aliases/SortInput.md)

#### Returns

`Promise`\<`T`[]\>

Eine Liste der gefilterten Daten.

#### Throws

Wenn die Entität nicht unterstützt wird.

***

### findProcessRoles()

> **findProcessRoles**(`processId`, `userId`): `Promise`\<\{ `roles`: [`RoleResult`](../../../model/payload/role-payload.type/type-aliases/RoleResult.md)[]; \}\>

Defined in: [src/role-mapper/service/read.service.ts:76](https://github.com/FlowCraft-AG/RoleMapper/blob/2b9cb86a69a058eebb4388dc6380ab3f35004bd1/backend/src/role-mapper/service/read.service.ts#L76)

Sucht die Rollen und die zugehörigen Benutzer für einen gegebenen Prozess.

#### Parameters

##### processId

`string`

Die (Object-)ID des Prozesses, für den die Rollen gesucht werden.

##### userId

`string`

Die ID des Benutzers, der die Anfrage stellt.

#### Returns

`Promise`\<\{ `roles`: [`RoleResult`](../../../model/payload/role-payload.type/type-aliases/RoleResult.md)[]; \}\>

Eine Liste der Rollen und der zugehörigen Benutzer.

#### Throws

Wenn der Prozess oder der Benutzer nicht gefunden werden kann.

***

### findUsersByFunction()

> **findUsersByFunction**(`id`): `Promise`\<[`GetUsersByFunctionResult`](../../../model/payload/kp.payload/type-aliases/GetUsersByFunctionResult.md)\>

Defined in: [src/role-mapper/service/read.service.ts:313](https://github.com/FlowCraft-AG/RoleMapper/blob/2b9cb86a69a058eebb4388dc6380ab3f35004bd1/backend/src/role-mapper/service/read.service.ts#L313)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`GetUsersByFunctionResult`](../../../model/payload/kp.payload/type-aliases/GetUsersByFunctionResult.md)\>
