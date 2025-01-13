[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/error/exceptions](../README.md) / InvalidOperatorException

# Class: InvalidOperatorException

Defined in: [src/role-mapper/error/exceptions.ts:12](https://github.com/FlowCraft-AG/RoleMapper/blob/60ae5b0c50e531d470a492fa6758544dd7523d6f/backend/src/role-mapper/error/exceptions.ts#L12)

Fehler bei der Verwendung eines ungültigen Operators in der Filter-Query.

## Extends

- `HttpException`

## Constructors

### new InvalidOperatorException()

> **new InvalidOperatorException**(`operator`): [`InvalidOperatorException`](InvalidOperatorException.md)

Defined in: [src/role-mapper/error/exceptions.ts:13](https://github.com/FlowCraft-AG/RoleMapper/blob/60ae5b0c50e531d470a492fa6758544dd7523d6f/backend/src/role-mapper/error/exceptions.ts#L13)

#### Parameters

##### operator

`undefined` | `string`

#### Returns

[`InvalidOperatorException`](InvalidOperatorException.md)

#### Overrides

`HttpException.constructor`
