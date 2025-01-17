[**RoleMapper Backend API Documentation v2024.11.28**](../../../README.md)

***

[RoleMapper Backend API Documentation](../../../modules.md) / [logger/request-logger.middleware](../README.md) / RequestLoggerMiddleware

# Class: RequestLoggerMiddleware

Defined in: [src/logger/request-logger.middleware.ts:6](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/logger/request-logger.middleware.ts#L6)

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

Defined in: [src/logger/request-logger.middleware.ts:9](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/logger/request-logger.middleware.ts#L9)

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
