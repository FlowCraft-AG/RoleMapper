[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/payload/saved-query.payload](../README.md) / SavedQueryPayload

# Type Alias: SavedQueryPayload

> **SavedQueryPayload**: `object`

Defined in: [src/role-mapper/model/payload/saved-query.payload.ts:6](https://github.com/FlowCraft-AG/RoleMapper/blob/8da0bd78326e48681af59eedcf5fc8f5e650849b/backend/src/role-mapper/model/payload/saved-query.payload.ts#L6)

Nutzlast für die Antwort der gespeicherten Abfrage.

## Type declaration

### message

> **message**: `string`

Eine Nachricht, die den Status der Speicherung beschreibt.

#### Example

```ts
"Save operation successful."
```

### result

> **result**: [`Mandates`](../../../entity/mandates.entity/classes/Mandates.md)

Das Ergebnis der gespeicherten Abfrage.

#### Example

```ts
{
     *   functionName: 'Manager',
     *   orgUnit: '64b1f768d9a8e900001b1b2f',
     *   users: ['12345', '67890'],
     * }
```

### success

> **success**: `boolean`

Gibt an, ob die Speicherung der Abfrage erfolgreich war.

#### Example

```ts
true
```
