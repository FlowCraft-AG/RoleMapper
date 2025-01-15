[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/error/exceptions](../README.md) / InvalidFilterException

# Class: InvalidFilterException

Defined in: [src/role-mapper/error/exceptions.ts:27](https://github.com/FlowCraft-AG/RoleMapper/blob/dfa0426eb5b55e53274c22382030e399befc29aa/backend/src/role-mapper/error/exceptions.ts#L27)

Fehler bei unvollständigen oder ungültigen Filterbedingungen.

## Extends

- `HttpException`

## Constructors

### new InvalidFilterException()

> **new InvalidFilterException**(`missingFields`): [`InvalidFilterException`](InvalidFilterException.md)

Defined in: [src/role-mapper/error/exceptions.ts:28](https://github.com/FlowCraft-AG/RoleMapper/blob/dfa0426eb5b55e53274c22382030e399befc29aa/backend/src/role-mapper/error/exceptions.ts#L28)

#### Parameters

##### missingFields

`string`[]

#### Returns

[`InvalidFilterException`](InvalidFilterException.md)

#### Overrides

`HttpException.constructor`
