[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/service/read.service](../README.md) / ReadService

# Class: ReadService

Defined in: [src/role-mapper/service/read.service.ts:36](https://github.com/FlowCraft-AG/RoleMapper/blob/046a4446f7c1ce6f2997dfd7b028c1b4223ffb6a/backend/src/role-mapper/service/read.service.ts#L36)

Service für Leseoperationen von Entitäten.

Diese Klasse stellt Methoden für das Abrufen, Filtern, Sortieren und Paginieren
von Entitäten wie Benutzer, Prozesse, Mandate und Organisationseinheiten bereit.

## Constructors

### new ReadService()

> **new ReadService**(`userModel`, `processModel`, `mandateModel`, `orgUnitModel`, `roleModel`): [`ReadService`](ReadService.md)

Defined in: [src/role-mapper/service/read.service.ts:52](https://github.com/FlowCraft-AG/RoleMapper/blob/046a4446f7c1ce6f2997dfd7b028c1b4223ffb6a/backend/src/role-mapper/service/read.service.ts#L52)

Konstruktor für den ReadService.

#### Parameters

##### userModel

`Model`\<[`UserDocument`](../../../model/entity/user.entity/type-aliases/UserDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`UserDocument`](../../../model/entity/user.entity/type-aliases/UserDocument.md)\> & [`User`](../../../model/entity/user.entity/classes/User.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

Das Mongoose-Modell für Benutzer.

##### processModel

`Model`\<[`ProcessDocument`](../../../model/entity/process.entity/type-aliases/ProcessDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`ProcessDocument`](../../../model/entity/process.entity/type-aliases/ProcessDocument.md)\> & [`Process`](../../../model/entity/process.entity/classes/Process.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

Das Mongoose-Modell für Prozesse.

##### mandateModel

`Model`\<[`MandateDocument`](../../../model/entity/mandates.entity/type-aliases/MandateDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`MandateDocument`](../../../model/entity/mandates.entity/type-aliases/MandateDocument.md)\> & [`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

Das Mongoose-Modell für Mandate.

##### orgUnitModel

`Model`\<[`OrgUnitDocument`](../../../model/entity/org-unit.entity/type-aliases/OrgUnitDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`OrgUnitDocument`](../../../model/entity/org-unit.entity/type-aliases/OrgUnitDocument.md)\> & [`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

Das Mongoose-Modell für Organisationseinheiten.

##### roleModel

`Model`\<[`RoleDocument`](../../../model/entity/roles.entity/type-aliases/RoleDocument.md), \{\}, \{\}, \{\}, `Document`\<`unknown`, \{\}, [`RoleDocument`](../../../model/entity/roles.entity/type-aliases/RoleDocument.md)\> & [`Role`](../../../model/entity/roles.entity/classes/Role.md) & `Document`\<`unknown`, `any`, `any`\> & `Required`\<\{\}\> & `object`, `any`\>

Das Mongoose-Modell für Rollen.

#### Returns

[`ReadService`](ReadService.md)

## Methods

### buildFilterQuery()

> **buildFilterQuery**(`filter`?): `FilterQuery`\<`any`\>

Defined in: [src/role-mapper/service/read.service.ts:297](https://github.com/FlowCraft-AG/RoleMapper/blob/046a4446f7c1ce6f2997dfd7b028c1b4223ffb6a/backend/src/role-mapper/service/read.service.ts#L297)

Erstellt rekursiv eine MongoDB-Filter-Query basierend auf den angegebenen Bedingungen.

Diese Methode verarbeitet Filterbedingungen, einschließlich logischer Operatoren (`AND`, `OR`, `NOR`)
und einzelner Feldbedingungen. Sie kann auch spezielle Felder mappen und Werte wie ObjectIds konvertieren,
falls erforderlich.

#### Parameters

##### filter?

[`FilterInput`](../../../model/input/filter.input/type-aliases/FilterInput.md)

Die Filterbedingungen, einschließlich logischer Operatoren und Feldbedingungen.
                                Wenn kein Filter angegeben ist oder der Filter leer ist, wird eine leere Query zurückgegeben.

#### Returns

`FilterQuery`\<`any`\>

Eine generierte MongoDB-Filter-Query, die in `Model.find` oder ähnlichen Methoden verwendet werden kann.

#### Throws

Wenn ein ungültiger Operator im Filter verwendet wird.

#### Throws

Wenn der Filter unvollständig ist (z. B. fehlendes Feld, Operator oder Wert).

#### Example

```typescript
const filter: FilterInput = {
    field: 'name',
    operator: 'EQ',
    value: 'John Doe',
    AND: [
        { field: 'active', operator: 'EQ', value: true },
        { field: 'roleId', operator: 'IN', value: ['123', '456'] }
    ]
};
const query = buildFilterQuery(filter);
console.log(query);
// { $and: [{ name: { $eq: 'John Doe' } }, { active: { $eq: true } }, { roleId: { $in: ['123', '456'] } }] }
```

***

### buildSortQuery()

> **buildSortQuery**(`orderBy`?): `Record`\<`string`, `-1` \| `1`\>

Defined in: [src/role-mapper/service/read.service.ts:361](https://github.com/FlowCraft-AG/RoleMapper/blob/046a4446f7c1ce6f2997dfd7b028c1b4223ffb6a/backend/src/role-mapper/service/read.service.ts#L361)

Erstellt eine Sortier-Query basierend auf den angegebenen Bedingungen.

Diese Methode generiert eine MongoDB-konforme Sortier-Query, die in `Model.find` oder ähnlichen
Abfragen verwendet werden kann. Die Sortierung erfolgt nach einem angegebenen Feld und einer
Richtung (`ASC` für aufsteigend, `DESC` für absteigend).

#### Parameters

##### orderBy?

[`SortInput`](../../../model/input/sort.input/type-aliases/SortInput.md)

Die Sortierbedingungen, bestehend aus einem Feld und einer Richtung.
                               Wenn keine Sortierbedingungen angegeben sind, wird eine leere Query zurückgegeben.

#### Returns

`Record`\<`string`, `-1` \| `1`\>

Eine Sortier-Query, wobei `1` für aufsteigend und `-1` für absteigend steht.

#### Throws

Wird ausgelöst, wenn das Sortierfeld nicht angegeben ist oder die Richtung ungültig ist.

#### Example

```typescript
const sortQuery = buildSortQuery({ field: 'name', direction: 'ASC' });
console.log(sortQuery); // { name: 1 }

const emptySortQuery = buildSortQuery();
console.log(emptySortQuery); // {}
```

***

### executeSavedQuery()

> **executeSavedQuery**(`id`): `Promise`\<\{ `data`: [`EntityType`](../../../model/entity/entities.entity/type-aliases/EntityType.md)[]; `savedQuery`: [`MandateDocument`](../../../model/entity/mandates.entity/type-aliases/MandateDocument.md); \}\>

Defined in: [src/role-mapper/service/read.service.ts:175](https://github.com/FlowCraft-AG/RoleMapper/blob/046a4446f7c1ce6f2997dfd7b028c1b4223ffb6a/backend/src/role-mapper/service/read.service.ts#L175)

Führt eine gespeicherte Abfrage aus, um Mandatsdaten zu erhalten.

Diese Methode ruft eine gespeicherte Abfrage aus der Datenbank ab und führt die
darin enthaltenen Filter-, Paginierungs- und Sortierkriterien aus, um relevante
Daten zu ermitteln.

#### Parameters

##### id

`string`

Die eindeutige ID der gespeicherten Abfrage.

#### Returns

`Promise`\<\{ `data`: [`EntityType`](../../../model/entity/entities.entity/type-aliases/EntityType.md)[]; `savedQuery`: [`MandateDocument`](../../../model/entity/mandates.entity/type-aliases/MandateDocument.md); \}\>

Ein Promise, das die gespeicherte Abfrage
und die gefilterten Daten zurückgibt.

#### Throws

Wird ausgelöst, wenn keine gespeicherte Abfrage mit der angegebenen ID gefunden wird
oder die gespeicherte Abfrage keine gültigen Kriterien enthält.

#### Example

```typescript
const result = await executeSavedQuery('64b1f768d9a8e900001b1b2f');
console.log(result.savedQuery); // Die gespeicherte Query
console.log(result.data); // Die gefilterten Daten
```

***

### findAncestors()

> **findAncestors**(`_id`): `Promise`\<[`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md)[]\>

Defined in: [src/role-mapper/service/read.service.ts:480](https://github.com/FlowCraft-AG/RoleMapper/blob/046a4446f7c1ce6f2997dfd7b028c1b4223ffb6a/backend/src/role-mapper/service/read.service.ts#L480)

Findet alle übergeordneten Organisationseinheiten einer gegebenen Organisationseinheit.

Diese Methode ermittelt die Hierarchie der Organisationseinheiten, indem sie rekursiv die
`parentId`-Felder durchläuft und alle übergeordneten Organisationseinheiten sammelt.

#### Parameters

##### \_id

`ObjectId`

Die eindeutige ID der aktuellen Organisationseinheit.

#### Returns

`Promise`\<[`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md)[]\>

Ein Promise, das eine Liste aller übergeordneten Organisationseinheiten zurückgibt.

#### Throws

Wird ausgelöst, wenn die Organisationseinheit mit der angegebenen ID nicht gefunden wird.

#### Example

```typescript
const ancestors = await findAncestors(new Types.ObjectId('64b1f768d9a8e900001b1b2f'));
console.log(ancestors); // Gibt die Liste der übergeordneten Organisationseinheiten aus
```

***

### findData()

> **findData**\<`T`\>(`entity`, `filter`?, `pagination`?, `orderBy`?): `Promise`\<`T`[]\>

Defined in: [src/role-mapper/service/read.service.ts:223](https://github.com/FlowCraft-AG/RoleMapper/blob/046a4446f7c1ce6f2997dfd7b028c1b4223ffb6a/backend/src/role-mapper/service/read.service.ts#L223)

Führt eine Filterabfrage für eine bestimmte Entität aus.

Diese Methode generiert eine MongoDB-Abfrage basierend auf den angegebenen Filter-,
Paginierungs- und Sortierparametern und ruft die gefilterten Daten aus der entsprechenden
Entität ab. Die Ergebnisse können optional paginiert und sortiert werden.

#### Type Parameters

• **T** *extends* [`EntityType`](../../../model/entity/entities.entity/type-aliases/EntityType.md)

Der Typ der Entität, die abgerufen wird (z. B. User, Mandates).

#### Parameters

##### entity

[`EntityCategoryType`](../../../model/entity/entities.entity/type-aliases/EntityCategoryType.md)

Der Name der Zielentität (z. B. 'USERS', 'MANDATES').

##### filter?

[`FilterInput`](../../../model/input/filter.input/type-aliases/FilterInput.md)

Die Filterkriterien für die Abfrage.

##### pagination?

[`PaginationParameters`](../../../model/input/pagination-parameters/type-aliases/PaginationParameters.md)

Paginierungsparameter, um Ergebnisse zu begrenzen und zu verschieben.

##### orderBy?

[`SortInput`](../../../model/input/sort.input/type-aliases/SortInput.md)

Sortieroptionen, um die Reihenfolge der Ergebnisse festzulegen.

#### Returns

`Promise`\<`T`[]\>

Ein Promise, das eine Liste der gefilterten Entitäten zurückgibt.

#### Throws

Wird ausgelöst, wenn die angegebene Entität nicht unterstützt wird.

#### Example

```typescript
const users = await findData<User>('USERS',
    { field: 'active', operator: 'EQ', value: true },
    { offset: 0, limit: 10 },
    { field: 'name', direction: 'ASC' });
console.log(users);
```

***

### findProcessRoles()

> **findProcessRoles**(`_id`, `userId`): `Promise`\<\{ `roles`: [`RoleResult`](../../../model/payload/role-payload.type/type-aliases/RoleResult.md)[]; \}\>

Defined in: [src/role-mapper/service/read.service.ts:87](https://github.com/FlowCraft-AG/RoleMapper/blob/046a4446f7c1ce6f2997dfd7b028c1b4223ffb6a/backend/src/role-mapper/service/read.service.ts#L87)

Sucht die Rollen und die zugehörigen Benutzer für einen angegebenen Prozess.

Diese Methode ruft die Prozessdaten aus der Datenbank ab, extrahiert die Rolleninformationen
und führt für jede Rolle eine Aggregations-Pipeline aus, um die zugehörigen Benutzer zu ermitteln.

#### Parameters

##### \_id

`string`

Die eindeutige ID des Prozesses, dessen Rollen abgerufen werden sollen.

##### userId

`string`

Die ID des Benutzers, der die Anfrage stellt.

#### Returns

`Promise`\<\{ `roles`: [`RoleResult`](../../../model/payload/role-payload.type/type-aliases/RoleResult.md)[]; \}\>

Ein Promise, das eine Liste von Rollen und den zugehörigen Benutzern zurückgibt.

#### Throws

Wird ausgelöst, wenn der Prozess nicht existiert, keine Rollen hat oder der Benutzer nicht existiert.

#### Example

```typescript
const result = await findProcessRoles('64b1f768d9a8e900001b1b2f', 'user123');
console.log(result.roles); // Gibt die Rollen und die zugehörigen Benutzer aus
```

***

### findUsersByFunction()

> **findUsersByFunction**(`id`): `Promise`\<[`GetUsersByFunctionResult`](../../../model/payload/get-users.payload/type-aliases/GetUsersByFunctionResult.md)\>

Defined in: [src/role-mapper/service/read.service.ts:412](https://github.com/FlowCraft-AG/RoleMapper/blob/046a4446f7c1ce6f2997dfd7b028c1b4223ffb6a/backend/src/role-mapper/service/read.service.ts#L412)

Findet Benutzer basierend auf der Funktion eines Mandats.

Diese Methode sucht ein Mandat anhand der angegebenen ID und ruft die Benutzer
ab, die der Funktion des Mandats zugeordnet sind. Zusätzlich werden relevante
Informationen wie der Funktionsname, ob die Funktion implizit ist und die
zugehörige Organisationseinheit zurückgegeben.

#### Parameters

##### id

`string`

Die eindeutige ID des Mandats.

#### Returns

`Promise`\<[`GetUsersByFunctionResult`](../../../model/payload/get-users.payload/type-aliases/GetUsersByFunctionResult.md)\>

Ein Promise, das die Benutzer und zusätzliche Informationen zurückgibt.

#### Throws

Wird ausgelöst, wenn kein Mandat für die angegebene ID gefunden wird.

#### Throws

Wird ausgelöst, wenn die ID des Mandats keine gültige `ObjectId` ist.

#### Example

```typescript
const result = await findUsersByFunction('64b1f768d9a8e900001b1b2f');
console.log(result.functionName); // Gibt den Funktionsnamen des Mandats aus.
console.log(result.users); // Gibt die Liste der Benutzer aus.
```
