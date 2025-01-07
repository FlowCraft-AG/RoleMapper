[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/resolver/query.resolver](../README.md) / QueryResolver

# Class: QueryResolver

Defined in: [src/role-mapper/resolver/query.resolver.ts:24](https://github.com/FlowCraft-AG/RoleMapper/blob/1b2b6c233762d0bcac1cf2d3fd5c5f2ed014cf3e/backend/src/role-mapper/resolver/query.resolver.ts#L24)

Resolver für die `RoleMapper`-Entität, der GraphQL-Abfragen verarbeitet und die entsprechenden Daten
vom `ReadService` an den Client zurückgibt.

Verwendet Filter und Interceptoren für Fehlerbehandlung und Zeitprotokollierung.

## Constructors

### new QueryResolver()

> **new QueryResolver**(`service`): [`QueryResolver`](QueryResolver.md)

Defined in: [src/role-mapper/resolver/query.resolver.ts:33](https://github.com/FlowCraft-AG/RoleMapper/blob/1b2b6c233762d0bcac1cf2d3fd5c5f2ed014cf3e/backend/src/role-mapper/resolver/query.resolver.ts#L33)

Konstruktor für den QueryResolver, der den ReadService injiziert.

#### Parameters

##### service

[`ReadService`](../../../service/read.service/classes/ReadService.md)

Der Service, der für die Datenabfragen zuständig ist.

#### Returns

[`QueryResolver`](QueryResolver.md)

## Methods

### getAncestors()

> **getAncestors**(`id`): `Promise`\<[`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md)[]\>

Defined in: [src/role-mapper/resolver/query.resolver.ts:136](https://github.com/FlowCraft-AG/RoleMapper/blob/1b2b6c233762d0bcac1cf2d3fd5c5f2ed014cf3e/backend/src/role-mapper/resolver/query.resolver.ts#L136)

#### Parameters

##### id

`ObjectId`

#### Returns

`Promise`\<[`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md)[]\>

***

### getEntityData()

> **getEntityData**(`input`): `Promise`\<`any`\>

Defined in: [src/role-mapper/resolver/query.resolver.ts:71](https://github.com/FlowCraft-AG/RoleMapper/blob/1b2b6c233762d0bcac1cf2d3fd5c5f2ed014cf3e/backend/src/role-mapper/resolver/query.resolver.ts#L71)

Führt eine dynamische Abfrage für beliebige Entitäten mit flexiblen Filtern aus.

Diese Methode verwendet das `ReadService`, um Entitätsdaten basierend auf den angegebenen
Filtern und der Paginierung abzufragen. Sie unterstützt die flexible Abfrage von
verschiedenen Entitäten wie Benutzer, Prozesse, Rollen usw.

#### Parameters

##### input

[`DataInput`](../../../model/input/data.input/type-aliases/DataInput.md)

Die Eingabedaten, die die Entität, Filter und Paginierung enthalten.

#### Returns

`Promise`\<`any`\>

- Die gefilterten und paginierten Daten.

#### Throws

- Wenn die angeforderte Entität nicht unterstützt wird.

***

### getRole()

> **getRole**(`processId`, `userId`): `Promise`\<`any`\>

Defined in: [src/role-mapper/resolver/query.resolver.ts:50](https://github.com/FlowCraft-AG/RoleMapper/blob/1b2b6c233762d0bcac1cf2d3fd5c5f2ed014cf3e/backend/src/role-mapper/resolver/query.resolver.ts#L50)

Führt eine Abfrage aus, um die Rollen eines Prozesses zu erhalten.

Diese Methode ruft die Methode `findProcessRoles` des `ReadService` auf, um die Rollen
eines bestimmten Prozesses und die zugehörigen Benutzer zu erhalten.

#### Parameters

##### processId

`string`

Die ID des Prozesses.

##### userId

`string`

Die ID des Benutzers, der die Anfrage stellt.

#### Returns

`Promise`\<`any`\>

- Die Rollen des Prozesses.

#### Throws

- Wenn der Prozess oder der Benutzer nicht gefunden werden kann.

***

### getSavedData()

> **getSavedData**(`id`): `Promise`\<`any`\>

Defined in: [src/role-mapper/resolver/query.resolver.ts:99](https://github.com/FlowCraft-AG/RoleMapper/blob/1b2b6c233762d0bcac1cf2d3fd5c5f2ed014cf3e/backend/src/role-mapper/resolver/query.resolver.ts#L99)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`any`\>

***

### getUsersByFunction()

> **getUsersByFunction**(`id`): `Promise`\<[`GetUsersByFunctionResult`](../../../model/payload/kp.payload/type-aliases/GetUsersByFunctionResult.md)\>

Defined in: [src/role-mapper/resolver/query.resolver.ts:116](https://github.com/FlowCraft-AG/RoleMapper/blob/1b2b6c233762d0bcac1cf2d3fd5c5f2ed014cf3e/backend/src/role-mapper/resolver/query.resolver.ts#L116)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`GetUsersByFunctionResult`](../../../model/payload/kp.payload/type-aliases/GetUsersByFunctionResult.md)\>
