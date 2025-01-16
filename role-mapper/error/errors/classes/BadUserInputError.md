[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/error/errors](../README.md) / BadUserInputError

# Class: BadUserInputError

Defined in: [src/role-mapper/error/errors.ts:12](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/role-mapper/error/errors.ts#L12)

Error-Klasse für GraphQL, die einen Response mit `errors` und
code `BAD_USER_INPUT` produziert.

## Extends

- `GraphQLError`

## Constructors

### new BadUserInputError()

> **new BadUserInputError**(`message`, `exception`?): [`BadUserInputError`](BadUserInputError.md)

Defined in: [src/role-mapper/error/errors.ts:18](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/role-mapper/error/errors.ts#L18)

Erstellt eine neue Instanz von BadUserInputError.

#### Parameters

##### message

`string`

Die Fehlermeldung.

##### exception?

`Error`

Die ursprüngliche Ausnahme, falls vorhanden.

#### Returns

[`BadUserInputError`](BadUserInputError.md)

#### Overrides

`GraphQLError.constructor`
