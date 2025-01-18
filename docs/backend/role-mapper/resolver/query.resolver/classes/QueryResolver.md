[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/resolver/query.resolver](../README.md) / QueryResolver

# Class: QueryResolver

Defined in: [src/role-mapper/resolver/query.resolver.ts:30](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/query.resolver.ts#L30)

Resolver für die `RoleMapper`-Entität, der GraphQL-Abfragen verarbeitet und die entsprechenden Daten
vom `ReadService` an den Client zurückgibt.

Verwendet Filter und Interceptoren für Fehlerbehandlung und Zeitprotokollierung.

## Constructors

### new QueryResolver()

> **new QueryResolver**(`service`): [`QueryResolver`](QueryResolver.md)

Defined in: [src/role-mapper/resolver/query.resolver.ts:39](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/query.resolver.ts#L39)

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

Defined in: [src/role-mapper/resolver/query.resolver.ts:215](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/query.resolver.ts#L215)

Führt eine Abfrage aus, um alle übergeordneten Organisationseinheiten basierend auf einer ID abzurufen.

Diese Methode ruft die `findAncestors`-Methode des Services auf, um die Hierarchie
der übergeordneten Organisationseinheiten zu ermitteln.

#### Parameters

##### id

`ObjectId`

Die eindeutige ID der Organisationseinheit, deren Vorfahren abgerufen werden sollen.

#### Returns

`Promise`\<[`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md)[]\>

Ein Promise, das die Liste der übergeordneten Organisationseinheiten zurückgibt.

#### Example

```typescript
const ancestors = await getAncestors(new Types.ObjectId('64b1f768d9a8e900001b1b2f'));
console.log(ancestors); // Gibt die Liste der übergeordneten Organisationseinheiten aus.
```

***

### getEntityData()

> **getEntityData**(`input`): `Promise`\<[`DataPayload`](../../../model/payload/data.payload/type-aliases/DataPayload.md)\>

Defined in: [src/role-mapper/resolver/query.resolver.ts:95](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/query.resolver.ts#L95)

Führt eine dynamische Abfrage für beliebige Entitäten mit flexiblen Filtern aus.

Diese Methode verwendet das `ReadService`, um Entitätsdaten basierend auf den angegebenen
Filtern, Paginierungs- und Sortierkriterien abzufragen. Sie unterstützt die flexible Abfrage von
verschiedenen Entitäten wie Benutzer, Prozesse, Rollen usw.

#### Parameters

##### input

[`DataInput`](../../../model/input/data.input/type-aliases/DataInput.md)

Die Eingabedaten, die die zugehörige Entität, Filterkriterien,
                           Paginierungsparameter und Sortieroptionen enthalten.

#### Returns

`Promise`\<[`DataPayload`](../../../model/payload/data.payload/type-aliases/DataPayload.md)\>

Ein Promise, das die abgefragten Daten und die Gesamtanzahl der Datensätze zurückgibt.

#### Throws

Wird ausgelöst, wenn die angeforderte Entität nicht unterstützt wird.

#### Example

```typescript
const result = await getEntityData({
    entity: 'User',
    filter: { active: true },
    pagination: { page: 1, pageSize: 10 },
    sort: { field: 'name', direction: 'asc' },
});
console.log(result.data); // Gibt die gefilterten Benutzer zurück
console.log(result.totalCount); // Gibt die Gesamtanzahl der Benutzer zurück
```

***

### getRole()

> **getRole**(`input`): `Promise`\<[`RolePayload`](../../../model/payload/role-payload.type/type-aliases/RolePayload.md)\>

Defined in: [src/role-mapper/resolver/query.resolver.ts:61](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/query.resolver.ts#L61)

Führt eine Abfrage aus, um die Rollen eines Prozesses zu erhalten.

Diese Methode ruft die `findProcessRoles`-Methode des `ReadService` auf, um die Rollen
eines bestimmten Prozesses sowie die zugehörigen Benutzer abzurufen.

#### Parameters

##### input

[`GetRolesInput`](../../../model/input/get-roles.input/type-aliases/GetRolesInput.md)

Die Eingabedaten für die Abfrage (enthält `processId` und `userId`).

#### Returns

`Promise`\<[`RolePayload`](../../../model/payload/role-payload.type/type-aliases/RolePayload.md)\>

Ein Promise mit den Rollen des Prozesses und den zugeordneten Benutzern.

#### Throws

Wird ausgelöst, wenn der Prozess oder der Benutzer nicht gefunden werden kann.

#### Example

```typescript
const result = await getRole({ processId: '12345', userId: 'user678' });
console.log(result.roles); // Gibt die Rollen und Benutzer aus.
```

***

### getSavedData()

> **getSavedData**(`id`): `Promise`\<[`MandatePayload`](../../../model/payload/mandate.payload/type-aliases/MandatePayload.md)\>

Defined in: [src/role-mapper/resolver/query.resolver.ts:139](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/query.resolver.ts#L139)

Führt eine Abfrage aus, um gespeicherte Daten zu einem Mandat abzurufen.

Diese Methode ruft die `executeSavedQuery`-Methode des Services auf, um die Mandatsdaten
basierend auf der angegebenen ID abzurufen. Die zurückgegebene Nutzlast enthält Details
wie Benutzer, Funktion und Organisations-Einheit.

#### Parameters

##### id

`string`

Die eindeutige ID, die die gespeicherten Daten identifiziert.

#### Returns

`Promise`\<[`MandatePayload`](../../../model/payload/mandate.payload/type-aliases/MandatePayload.md)\>

Ein Promise, das die Nutzlast mit den abgerufenen Mandatsdaten zurückgibt.

#### Throws

Wird ausgelöst, wenn keine Daten zu der angegebenen ID gefunden werden.

#### Example

```typescript
const mandate = await getSavedData('64b1f768d9a8e900001b1b2f');
console.log(mandate.users); // Gibt die Benutzer zurück, die mit dem Mandat verknüpft sind.
console.log(mandate.functionName); // Gibt den Namen der zugehörigen Funktion zurück.
```

***

### getUsersByFunction()

> **getUsersByFunction**(`id`): `Promise`\<[`GetUsersByFunctionResult`](../../../model/payload/kp.payload/type-aliases/GetUsersByFunctionResult.md)\>

Defined in: [src/role-mapper/resolver/query.resolver.ts:180](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/query.resolver.ts#L180)

Führt eine Abfrage aus, um Benutzer basierend auf einer Funktion abzurufen.

Diese Methode ruft die `findUsersByFunction`-Methode des Services auf, um die Benutzer,
die einer bestimmten Funktion zugeordnet sind, sowie weitere relevante Informationen abzurufen.

#### Parameters

##### id

`string`

Die eindeutige ID der Funktion, für die die Benutzer abgerufen werden sollen.

#### Returns

`Promise`\<[`GetUsersByFunctionResult`](../../../model/payload/kp.payload/type-aliases/GetUsersByFunctionResult.md)\>

Ein Promise, das die Nutzlast mit den abgerufenen Benutzerdaten zurückgibt.

#### Example

```typescript
const result = await getUsersByFunction('64b1f768d9a8e900001b1b2f');
console.log(result.functionName); // Gibt den Namen der Funktion zurück.
console.log(result.users); // Gibt die Benutzer zurück, die der Funktion zugeordnet sind.
```
