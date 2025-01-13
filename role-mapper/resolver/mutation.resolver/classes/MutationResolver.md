[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/resolver/mutation.resolver](../README.md) / MutationResolver

# Class: MutationResolver

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:31](https://github.com/FlowCraft-AG/RoleMapper/blob/a27a4625e026a9ad2c24db2d223617539cb70099/backend/src/role-mapper/resolver/mutation.resolver.ts#L31)

Resolver für Mutationsoperationen.

Dieser Resolver definiert verschiedene Mutationsmethoden zum Erstellen, Aktualisieren,
Löschen und Verwalten von Entitäten sowie zur Verwaltung benutzerdefinierter Abfragen.

## Constructors

### new MutationResolver()

> **new MutationResolver**(`service`): [`MutationResolver`](MutationResolver.md)

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:34](https://github.com/FlowCraft-AG/RoleMapper/blob/a27a4625e026a9ad2c24db2d223617539cb70099/backend/src/role-mapper/resolver/mutation.resolver.ts#L34)

#### Parameters

##### service

[`WriteService`](../../../service/write.service/classes/WriteService.md)

#### Returns

[`MutationResolver`](MutationResolver.md)

## Methods

### addUserToMandate()

> **addUserToMandate**(`input`): `Promise`\<[`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md)\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:293](https://github.com/FlowCraft-AG/RoleMapper/blob/a27a4625e026a9ad2c24db2d223617539cb70099/backend/src/role-mapper/resolver/mutation.resolver.ts#L293)

Fügt einen Benutzer zu einer Funktion hinzu.

Diese Mutation aktualisiert eine vorhandene Funktion, indem sie den angegebenen Benutzer
hinzufügt. Die Funktion wird dabei eindeutig durch ihre ID identifiziert.

#### Parameters

##### input

[`UserFunctionInput`](../../../model/input/add-user.input/type-aliases/UserFunctionInput.md)

Die Eingabedaten, bestehend aus der ID der Funktion
(`functionId`) und der ID des Benutzers (`userId`).

#### Returns

`Promise`\<[`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md)\>

Die aktualisierte Funktion nach Hinzufügen des Benutzers.

#### Throws

Wenn die Aktualisierung fehlschlägt oder die Eingabedaten ungültig sind.

#### Example

```typescript
const input: UserFunctionInput = {
  functionId: '64b1f768d9a8e900001b1b2f',
  userId: '12345',
};
const updatedFunction = await addUserToRole(input);
console.log(updatedFunction.users); // ['12345', ...]
```

***

### createEntity()

> **createEntity**(`input`): `Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:68](https://github.com/FlowCraft-AG/RoleMapper/blob/a27a4625e026a9ad2c24db2d223617539cb70099/backend/src/role-mapper/resolver/mutation.resolver.ts#L68)

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

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:244](https://github.com/FlowCraft-AG/RoleMapper/blob/a27a4625e026a9ad2c24db2d223617539cb70099/backend/src/role-mapper/resolver/mutation.resolver.ts#L244)

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

> **removeUserFromRole**(`input`): `Promise`\<[`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md)\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:337](https://github.com/FlowCraft-AG/RoleMapper/blob/a27a4625e026a9ad2c24db2d223617539cb70099/backend/src/role-mapper/resolver/mutation.resolver.ts#L337)

Entfernt einen Benutzer aus einer Funktion.

Diese Mutation aktualisiert eine vorhandene Funktion, indem der angegebene Benutzer
entfernt wird. Die Funktion wird eindeutig durch ihre ID identifiziert.

#### Parameters

##### input

[`UserFunctionInput`](../../../model/input/add-user.input/type-aliases/UserFunctionInput.md)

Die Eingabedaten, bestehend aus der ID der Funktion (`functionId`)
und der ID des Benutzers (`userId`).

#### Returns

`Promise`\<[`Mandates`](../../../model/entity/mandates.entity/classes/Mandates.md)\>

- Die aktualisierte Funktion nach dem Entfernen des Benutzers.

#### Throws

- Wenn die Aktualisierung fehlschlägt oder die Eingabedaten ungültig sind.

#### Example

```typescript
const input: UserFunctionInput = {
  functionId: '64b1f768d9a8e900001b1b2f',
  userId: '12345',
};
const updatedFunction = await removeUserFromRole(input);
console.log(updatedFunction.users); // ['67890', ...] (ohne '12345')
```

***

### saveQuery()

> **saveQuery**(`data`): `Promise`\<[`SavedQueryPayload`](../../../model/payload/saved-query.payload/type-aliases/SavedQueryPayload.md)\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:390](https://github.com/FlowCraft-AG/RoleMapper/blob/a27a4625e026a9ad2c24db2d223617539cb70099/backend/src/role-mapper/resolver/mutation.resolver.ts#L390)

Mutation zum Speichern einer Abfrage für eine spezifische Funktion und Organisationseinheit.

Diese Mutation speichert eine Abfrage, die auf einer Funktion und einer Organisationseinheit basiert,
einschließlich der zugehörigen Filter- und Sortierkriterien.

#### Parameters

##### data

[`SaveQueryInput`](../../../model/input/save-query.input/type-aliases/SaveQueryInput.md)

Die Eingabedaten für die Abfrage, bestehend aus `functionName`,
`orgUnitId` und den Abfrageparametern (`input`).

#### Returns

`Promise`\<[`SavedQueryPayload`](../../../model/payload/saved-query.payload/type-aliases/SavedQueryPayload.md)\>

- Die Nutzlast mit dem Ergebnis der gespeicherten Abfrage.

#### Throws

- Wenn die Speicherung fehlschlägt.

#### Example

```typescript
const data: SaveQueryInput = {
  functionName: 'Manager',
  orgUnitId: new Types.ObjectId('64b1f768d9a8e900001b1b2f'),
  input: {
    entity: 'USERS',
    filter: { field: 'status', operator: 'EQ', value: 'active' },
    sort: { field: 'name', direction: 'ASC' },
  },
};

const result = await saveQuery(data);
console.log(result.message); // "Save operation successful."
```

***

### updateEntity()

> **updateEntity**(`input`): `Promise`\<[`MutationPayload`](../../../model/payload/mutation.payload/classes/MutationPayload.md)\>

Defined in: [src/role-mapper/resolver/mutation.resolver.ts:177](https://github.com/FlowCraft-AG/RoleMapper/blob/a27a4625e026a9ad2c24db2d223617539cb70099/backend/src/role-mapper/resolver/mutation.resolver.ts#L177)

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
