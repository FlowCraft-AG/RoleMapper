[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [security/keycloak/token.controller](../README.md) / TokenController

# Class: TokenController

Defined in: [src/security/keycloak/token.controller.ts:35](https://github.com/FlowCraft-AG/RoleMapper/blob/046a4446f7c1ce6f2997dfd7b028c1b4223ffb6a/backend/src/security/keycloak/token.controller.ts#L35)

## Constructors

### new TokenController()

> **new TokenController**(`keycloakService`): [`TokenController`](TokenController.md)

Defined in: [src/security/keycloak/token.controller.ts:40](https://github.com/FlowCraft-AG/RoleMapper/blob/046a4446f7c1ce6f2997dfd7b028c1b4223ffb6a/backend/src/security/keycloak/token.controller.ts#L40)

#### Parameters

##### keycloakService

[`KeycloakService`](../../keycloak.service/classes/KeycloakService.md)

#### Returns

[`TokenController`](TokenController.md)

## Methods

### refresh()

> **refresh**(`body`, `response`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [src/security/keycloak/token.controller.ts:74](https://github.com/FlowCraft-AG/RoleMapper/blob/046a4446f7c1ce6f2997dfd7b028c1b4223ffb6a/backend/src/security/keycloak/token.controller.ts#L74)

#### Parameters

##### body

[`Refresh`](Refresh.md)

##### response

`Response`\<`any`, `Record`\<`string`, `any`\>\>

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

***

### token()

> **token**(`__namedParameters`, `response`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [src/security/keycloak/token.controller.ts:53](https://github.com/FlowCraft-AG/RoleMapper/blob/046a4446f7c1ce6f2997dfd7b028c1b4223ffb6a/backend/src/security/keycloak/token.controller.ts#L53)

#### Parameters

##### \_\_namedParameters

[`TokenData`](TokenData.md)

##### response

`Response`\<`any`, `Record`\<`string`, `any`\>\>

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>
