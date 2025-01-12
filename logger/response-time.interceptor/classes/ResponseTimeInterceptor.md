[**RoleMapper Backend API Documentation v2024.11.28**](../../../README.md)

***

[RoleMapper Backend API Documentation](../../../modules.md) / [logger/response-time.interceptor](../README.md) / ResponseTimeInterceptor

# Class: ResponseTimeInterceptor

Defined in: [src/logger/response-time.interceptor.ts:15](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/logger/response-time.interceptor.ts#L15)

## Implements

- `NestInterceptor`

## Constructors

### new ResponseTimeInterceptor()

> **new ResponseTimeInterceptor**(): [`ResponseTimeInterceptor`](ResponseTimeInterceptor.md)

#### Returns

[`ResponseTimeInterceptor`](ResponseTimeInterceptor.md)

## Methods

### intercept()

> **intercept**(`context`, `next`): `Observable`\<`any`\>

Defined in: [src/logger/response-time.interceptor.ts:18](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/logger/response-time.interceptor.ts#L18)

Method to implement a custom interceptor.

#### Parameters

##### context

`ExecutionContext`

an `ExecutionContext` object providing methods to access the
route handler and class about to be invoked.

##### next

`CallHandler`\<`any`\>

a reference to the `CallHandler`, which provides access to an
`Observable` representing the response stream from the route handler.

#### Returns

`Observable`\<`any`\>

#### Implementation of

`NestInterceptor.intercept`
