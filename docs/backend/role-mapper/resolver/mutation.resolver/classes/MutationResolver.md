[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/resolver/mutation.resolver](../README.md) / MutationResolver

# Class: MutationResolver

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:31](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/mutation.resolver.ts#L31)

Resolver für Mutationsoperationen.

Dieser Resolver definiert verschiedene Mutationsmethoden zum Erstellen, Aktualisieren,
Löschen und Verwalten von Entitäten sowie zur Verwaltung benutzerdefinierter Abfragen.

## Constructors

### new MutationResolver()

> **new MutationResolver**(`service`): [`MutationResolver`](MutationResolver.md)

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:34](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/mutation.resolver.ts#L34)

#### Parameters

##### service

[`WriteService`](../../../service/write.service/classes/WriteService.md)

#### Returns

[`MutationResolver`](MutationResolver.md)

## Methods

### addUserToMandate()

> **addUserToMandate**(`input`): `Promise`\<[`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md)\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:293](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/mutation.resolver.ts#L293)

Fügt einen Benutzer zu einer Funktion hinzu.

Diese Mutation aktualisiert eine vorhandene Funktion, indem sie den angegebenen Benutzer
hinzufügt. Die Funktion wird dabei eindeutig durch ihre ID identifiziert.

#### Parameters

##### input

[`AddUserInput`](../../../model/input/add-user.input/type-aliases/AddUserInput.md)

Die Eingabedaten, bestehend aus der ID der Funktion
(`functionId`) und der ID des Benutzers (`userId`).

#### Returns

`Promise`\<[`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md)\>

Die aktualisierte Funktion nach Hinzufügen des Benutzers.

#### Throws

Wenn die Aktualisierung fehlschlägt oder die Eingabedaten ungültig sind.

#### Example

```typescript
const input: AddUserInput = {
  functionId: '64b1f768d9a8e900001b1b2f',
  userId: '12345',
};
const updatedFunction = await addUserToRole(input);
console.log(updatedFunction.users); // ['12345', ...]
```

***

### createEntity()

> **createEntity**(`input`): `Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:68](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/mutation.resolver.ts#L68)

Erstellt eine neue Entität in der Datenbank.

Diese Methode akzeptiert Eingabedaten für verschiedene Entitätstypen wie Benutzer, Funktionen,
Prozesse, Organisationseinheiten und Rollen. Basierend auf der Entitätsart werden die
entsprechenden Daten validiert und zur Erstellung an den Service weitergeleitet.

#### Parameters

##### input

[`CreateEntityInput`](../../../model/dto/create.dto/type-aliases/CreateEntityInput.md)

Die Eingabedaten für die zu erstellende Entität, einschließlich
des Entitätstyps und der spezifischen Daten.

#### Returns

`Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Das Ergebnis der Operation mit einem Erfolgsstatus, einer Nachricht
und den erstellten Daten.

#### Throws

Wenn ein Duplikatfehler auftritt, z. B. wenn eine Entität mit denselben Eigenschaften
bereits existiert.

#### Throws

Wenn die Eingabedaten nicht den Validierungsanforderungen entsprechen.

#### Throws

Für allgemeine Fehler oder wenn der Entitätstyp `USERS` noch nicht implementiert ist.

#### Example

```typescript
const input: CreateEntityInput = {
  entity: 'ORG_UNITS',
  orgUnitData: { name: 'IT-Abteilung', parentId: '64b1f768d9a8e900001b1b2f' },
};
const result = await createEntity(input);
console.log(result.success); // true
console.log(result.message); // 'Create operation successful.'
```

***

### deleteEntity()

> **deleteEntity**(`input`): `Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:244](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/mutation.resolver.ts#L244)

Löscht eine bestehende Entität aus der Datenbank.

Diese Methode löscht Entitäten basierend auf dem bereitgestellten Entitätstyp und den
spezifischen Filtern. Der Service übernimmt die Ausführung der Löschoperation.

#### Parameters

##### input

[`DeleteEntityInput`](../../../model/dto/delete.dto/type-aliases/DeleteEntityInput.md)

Die Eingabedaten für die Löschoperation, einschließlich
des Entitätstyps und der Filterkriterien.

#### Returns

`Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Das Ergebnis der Operation, einschließlich Erfolgsstatus,
Nachricht und der Anzahl der gelöschten Dokumente.

#### Throws

Wenn die Löschoperation fehlschlägt.

#### Example

```typescript
const input: DeleteEntityInput = {
  entity: 'ORG_UNITS',
  filter: { field: 'name', operator: 'EQ', value: 'IT-Abteilung' },
};
const result = await deleteEntity(input);
console.log(result.success); // true
console.log(result.message); // 'Delete operation successful.'
console.log(result.affectedCount); // 1
```

***

### removeUserFromRole()

> **removeUserFromRole**(`functionId`, `userId`): `Promise`\<`Document`\<`unknown`, \{\}, [`EntityType`](../../../model/entity/entities.entity/type-aliases/EntityType.md)\> & [`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md) & `Required`\<\{\}\> & `object` \| [`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md) & `Required`\<\{\}\> & `object` \| [`Process`](../../../model/entity/process.entity/classes/Process.md) & `Required`\<\{\}\> & `object` \| [`Role`](../../../model/entity/roles.entity/classes/Role.md) & `Required`\<\{\}\> & `object` \| [`User`](../../../model/entity/user.entity/classes/User.md) & `Required`\<\{\}\> & `object`\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:334](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/mutation.resolver.ts#L334)

Entfernt einen Benutzer aus einer Funktion.

Diese Methode aktualisiert die Funktion, indem sie einen Benutzer basierend auf der
angegebenen Funktions-ID und Benutzer-ID entfernt. Die Aktualisierung erfolgt über
den entsprechenden Service.

#### Parameters

##### functionId

`string`

Die ID der Funktion, aus der der Benutzer entfernt werden soll.

##### userId

`string`

Die ID des Benutzers, der entfernt werden soll.

#### Returns

`Promise`\<`Document`\<`unknown`, \{\}, [`EntityType`](../../../model/entity/entities.entity/type-aliases/EntityType.md)\> & [`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md) & `Required`\<\{\}\> & `object` \| [`OrgUnit`](../../../model/entity/org-unit.entity/classes/OrgUnit.md) & `Required`\<\{\}\> & `object` \| [`Process`](../../../model/entity/process.entity/classes/Process.md) & `Required`\<\{\}\> & `object` \| [`Role`](../../../model/entity/roles.entity/classes/Role.md) & `Required`\<\{\}\> & `object` \| [`User`](../../../model/entity/user.entity/classes/User.md) & `Required`\<\{\}\> & `object`\>

Die aktualisierte Funktion nach der Entfernung des Benutzers.

#### Throws

Wenn die Entfernung fehlschlägt.

#### Example

```typescript
const updatedFunction = await removeUserFromRole('function123', 'user456');
console.log(updatedFunction); // Ausgabe der aktualisierten Funktion
```

***

### saveQuery()

> **saveQuery**(`functionName`, `orgUnitId`, `input`): `Promise`\<\{ `message`: `string`; `result`: `any`; `success`: `boolean`; \}\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:385](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/mutation.resolver.ts#L385)

Speichert eine benutzerdefinierte Abfrage.

Diese Methode speichert Abfrageparameter wie die Funktion, die Organisationseinheit,
die Entität, Filter und Sortieroptionen. Die Speicherung erfolgt über den entsprechenden Service.

#### Parameters

##### functionName

`string`

Der Name der Funktion, für die die Abfrage gespeichert werden soll.

##### orgUnitId

`ObjectId`

Die ID der Organisationseinheit, für die die Abfrage gespeichert werden soll.

##### input

[`DataInput`](../../../model/input/data.input/type-aliases/DataInput.md)

Die Eingabedaten für die Abfrage, einschließlich Entität, Filter und Sortieroptionen.

#### Returns

`Promise`\<\{ `message`: `string`; `result`: `any`; `success`: `boolean`; \}\>

Das Ergebnis der Speicherung,
einschließlich Erfolgsstatus, Nachricht und des gespeicherten Ergebnisses.

#### Throws

Wenn die Speicherung der Abfrage fehlschlägt.

#### Example

```typescript
const input: DataInput = {
  entity: 'USERS',
  filter: { field: 'name', operator: 'LIKE', value: 'John' },
  sort: { field: 'name', direction: 'ASC' },
};
const result = await saveQuery('function123', new Types.ObjectId('64b1f768d9a8e900001b1b2f'), input);
console.log(result.success); // true
console.log(result.message); // 'Save operation successful.'
console.log(result.result); // Gespeicherte Abfrage
```

***

### updateEntity()

> **updateEntity**(`input`): `Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:177](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/resolver/mutation.resolver.ts#L177)

Aktualisiert eine bestehende Entität in der Datenbank.

Diese Methode akzeptiert Eingabedaten für verschiedene Entitätstypen wie Benutzer, Funktionen,
Prozesse, Organisationseinheiten und Rollen.Basierend auf der Entitätsart und den bereitgestellten
Filtern werden die entsprechenden Daten aktualisiert.

#### Parameters

##### input

[`UpdateEntityInput`](../../../model/dto/update.dto/type-aliases/UpdateEntityInput.md)

Die Eingabedaten für die Aktualisierung, einschließlich
des Entitätstyps, der Filter und der spezifischen Aktualisierungsdaten.

#### Returns

`Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Das Ergebnis der Operation mit Erfolgsstatus, Nachricht
und der Anzahl der betroffenen Dokumente.

#### Throws

Wenn der Entitätstyp oder die Daten fehlen.

#### Throws

Wenn die Aktualisierung aufgrund von Validierungsfehlern fehlschlägt.

#### Example

```typescript
const input: UpdateEntityInput = {
  entity: 'ORG_UNITS',
  filter: { field: 'name', operator: 'EQ', value: 'IT-Abteilung' },
  orgUnitData: { parentId: '64b1f768d9a8e900001b1b2f' },
};
const result = await updateEntity(input);
console.log(result.success); // true
console.log(result.message); // 'Update operation successful.'
console.log(result.affectedCount); // 1
```
