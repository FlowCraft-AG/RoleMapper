[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/payload/mutation.payload](../README.md) / MutationPayload

# Class: MutationPayload

Defined in: [src/role-mapper/model/payload/mutation.payload.ts:7](https://github.com/FlowCraft-AG/RoleMapper/blob/3eb36c970c08048b7af3096cccc727e0fc5a22b5/backend/src/role-mapper/model/payload/mutation.payload.ts#L7)

Definiert die Antwortstruktur für Mutationen in GraphQL.

## Constructors

### new MutationPayload()

> **new MutationPayload**(): [`MutationPayload`](MutationPayload.md)

#### Returns

[`MutationPayload`](MutationPayload.md)

## Properties

### affectedCount?

> `optional` **affectedCount**: `number`

Defined in: [src/role-mapper/model/payload/mutation.payload.ts:29](https://github.com/FlowCraft-AG/RoleMapper/blob/3eb36c970c08048b7af3096cccc727e0fc5a22b5/backend/src/role-mapper/model/payload/mutation.payload.ts#L29)

***

### message?

> `optional` **message**: `string`

Defined in: [src/role-mapper/model/payload/mutation.payload.ts:20](https://github.com/FlowCraft-AG/RoleMapper/blob/3eb36c970c08048b7af3096cccc727e0fc5a22b5/backend/src/role-mapper/model/payload/mutation.payload.ts#L20)

Eine optionale Nachricht, die zusätzliche Informationen zur Mutation enthält.

***

### result?

> `optional` **result**: `any`

Defined in: [src/role-mapper/model/payload/mutation.payload.ts:27](https://github.com/FlowCraft-AG/RoleMapper/blob/3eb36c970c08048b7af3096cccc727e0fc5a22b5/backend/src/role-mapper/model/payload/mutation.payload.ts#L27)

Das Ergebnis der Mutation, falls vorhanden.

***

### success

> **success**: `boolean`

Defined in: [src/role-mapper/model/payload/mutation.payload.ts:13](https://github.com/FlowCraft-AG/RoleMapper/blob/3eb36c970c08048b7af3096cccc727e0fc5a22b5/backend/src/role-mapper/model/payload/mutation.payload.ts#L13)

Gibt an, ob die Mutation erfolgreich war.

***

### warnings?

> `optional` **warnings**: `string`[]

Defined in: [src/role-mapper/model/payload/mutation.payload.ts:31](https://github.com/FlowCraft-AG/RoleMapper/blob/3eb36c970c08048b7af3096cccc727e0fc5a22b5/backend/src/role-mapper/model/payload/mutation.payload.ts#L31)
