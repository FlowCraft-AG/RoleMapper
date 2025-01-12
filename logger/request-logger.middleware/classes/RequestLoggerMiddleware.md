[**RoleMapper Backend API Documentation v2024.11.28**](../../../README.md)

***

[RoleMapper Backend API Documentation](../../../modules.md) / [logger/request-logger.middleware](../README.md) / RequestLoggerMiddleware

# Class: RequestLoggerMiddleware

Defined in: [src/logger/request-logger.middleware.ts:6](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/logger/request-logger.middleware.ts#L6)

## Implements

- `NestMiddleware`

## Constructors

### new RequestLoggerMiddleware()

> **new RequestLoggerMiddleware**(): [`RequestLoggerMiddleware`](RequestLoggerMiddleware.md)

#### Returns

[`RequestLoggerMiddleware`](RequestLoggerMiddleware.md)

## Methods

### use()

> **use**(`request`, `_response`, `next`): `void`

Defined in: [src/logger/request-logger.middleware.ts:9](https://github.com/FlowCraft-AG/RoleMapper/blob/431ad1c9b0d708a278f2d2969907ccf8ac66ccc1/backend/src/logger/request-logger.middleware.ts#L9)

#### Parameters

##### request

`Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

##### \_response

`Response`\<`any`, `Record`\<`string`, `any`\>\>

##### next

`NextFunction`

#### Returns

`void`

#### Implementation of

`NestMiddleware.use`
