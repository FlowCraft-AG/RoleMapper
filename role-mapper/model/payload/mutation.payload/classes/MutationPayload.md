[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/payload/mutation.payload](../README.md) / MutationPayload

# Class: MutationPayload

Defined in: [src/role-mapper/model/payload/mutation.payload.ts:11](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/role-mapper/model/payload/mutation.payload.ts#L11)

Definiert die Struktur der Antwort für GraphQL-Mutationen.

Diese Klasse repräsentiert die allgemeine Antwortstruktur für Mutationen und enthält
Informationen über den Erfolg, eine optionale Nachricht, das Ergebnis und zusätzliche
Metadaten wie die Anzahl der betroffenen Einträge oder Warnungen.

## Constructors

### new MutationPayload()

> **new MutationPayload**(): [`MutationPayload`](MutationPayload.md)

#### Returns

[`MutationPayload`](MutationPayload.md)

## Properties

### affectedCount?

> `optional` **affectedCount**: `number`

Defined in: [src/role-mapper/model/payload/mutation.payload.ts:46](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/role-mapper/model/payload/mutation.payload.ts#L46)

Die Anzahl der betroffenen Einträge durch die Mutation.

#### Example

```ts
1
```

***

### message?

> `optional` **message**: `string`

Defined in: [src/role-mapper/model/payload/mutation.payload.ts:28](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/role-mapper/model/payload/mutation.payload.ts#L28)

Eine optionale Nachricht, die zusätzliche Informationen zur Mutation enthält.

#### Example

```ts
"Mutation completed successfully."
```

***

### result?

> `optional` **result**: `any`

Defined in: [src/role-mapper/model/payload/mutation.payload.ts:37](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/role-mapper/model/payload/mutation.payload.ts#L37)

Das Ergebnis der Mutation, falls vorhanden.

#### Example

```ts
{ id: "12345", name: "Updated Entity" }
```

***

### success

> **success**: `boolean`

Defined in: [src/role-mapper/model/payload/mutation.payload.ts:19](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/role-mapper/model/payload/mutation.payload.ts#L19)

Gibt an, ob die Mutation erfolgreich war.

#### Example

```ts
true
```

***

### warnings?

> `optional` **warnings**: `string`[]

Defined in: [src/role-mapper/model/payload/mutation.payload.ts:55](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/role-mapper/model/payload/mutation.payload.ts#L55)

Eine Liste von Warnungen, die während der Mutation aufgetreten sind.

#### Example

```ts
["Field 'description' was truncated.", "User already exists."]
```
