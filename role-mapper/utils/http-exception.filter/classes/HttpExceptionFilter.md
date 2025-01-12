[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/utils/http-exception.filter](../README.md) / HttpExceptionFilter

# Class: HttpExceptionFilter

Defined in: [src/role-mapper/utils/http-exception.filter.ts:9](https://github.com/FlowCraft-AG/RoleMapper/blob/c9acdd00838c66d920e7b437b70c88dfa20c9c4e/backend/src/role-mapper/utils/http-exception.filter.ts#L9)

## Implements

- `ExceptionFilter`

## Constructors

### new HttpExceptionFilter()

> **new HttpExceptionFilter**(): [`HttpExceptionFilter`](HttpExceptionFilter.md)

#### Returns

[`HttpExceptionFilter`](HttpExceptionFilter.md)

## Methods

### catch()

> **catch**(`exception`): `void`

Defined in: [src/role-mapper/utils/http-exception.filter.ts:16](https://github.com/FlowCraft-AG/RoleMapper/blob/c9acdd00838c66d920e7b437b70c88dfa20c9c4e/backend/src/role-mapper/utils/http-exception.filter.ts#L16)

Fängt eine HttpException ab und wirft eine BadUserInputError.

#### Parameters

##### exception

`HttpException`

Die abgefangene Ausnahme.

#### Returns

`void`

#### Throws

- Wenn die Ausnahme abgefangen wird.

#### Implementation of

`ExceptionFilter.catch`
