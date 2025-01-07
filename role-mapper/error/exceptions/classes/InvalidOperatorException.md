[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/error/exceptions](../README.md) / InvalidOperatorException

# Class: InvalidOperatorException

Defined in: [src/role-mapper/error/exceptions.ts:12](https://github.com/FlowCraft-AG/RoleMapper/blob/2b9cb86a69a058eebb4388dc6380ab3f35004bd1/backend/src/role-mapper/error/exceptions.ts#L12)

Fehler bei der Verwendung eines ungültigen Operators in der Filter-Query.

## Extends

- `HttpException`

## Constructors

### new InvalidOperatorException()

> **new InvalidOperatorException**(`operator`): [`InvalidOperatorException`](InvalidOperatorException.md)

Defined in: [src/role-mapper/error/exceptions.ts:13](https://github.com/FlowCraft-AG/RoleMapper/blob/2b9cb86a69a058eebb4388dc6380ab3f35004bd1/backend/src/role-mapper/error/exceptions.ts#L13)

#### Parameters

##### operator

`undefined` | `string`

#### Returns

[`InvalidOperatorException`](InvalidOperatorException.md)

#### Overrides

`HttpException.constructor`
