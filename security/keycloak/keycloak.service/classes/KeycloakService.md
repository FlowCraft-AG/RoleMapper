[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [security/keycloak/keycloak.service](../README.md) / KeycloakService

# Class: KeycloakService

Defined in: [src/security/keycloak/keycloak.service.ts:24](https://github.com/FlowCraft-AG/RoleMapper/blob/2e49de298fb7aea6638be4e21aef4b51c0753b47/backend/src/security/keycloak/keycloak.service.ts#L24)

## Implements

- `KeycloakConnectOptionsFactory`

## Constructors

### new KeycloakService()

> **new KeycloakService**(): [`KeycloakService`](KeycloakService.md)

Defined in: [src/security/keycloak/keycloak.service.ts:32](https://github.com/FlowCraft-AG/RoleMapper/blob/2e49de298fb7aea6638be4e21aef4b51c0753b47/backend/src/security/keycloak/keycloak.service.ts#L32)

#### Returns

[`KeycloakService`](KeycloakService.md)

## Methods

### createKeycloakConnectOptions()

> **createKeycloakConnectOptions**(): `KeycloakConnectOptions`

Defined in: [src/security/keycloak/keycloak.service.ts:50](https://github.com/FlowCraft-AG/RoleMapper/blob/2e49de298fb7aea6638be4e21aef4b51c0753b47/backend/src/security/keycloak/keycloak.service.ts#L50)

#### Returns

`KeycloakConnectOptions`

#### Implementation of

`KeycloakConnectOptionsFactory.createKeycloakConnectOptions`

***

### refresh()

> **refresh**(`refresh_token`): `Promise`\<`undefined` \| `Record`\<`string`, `string` \| `number`\>\>

Defined in: [src/security/keycloak/keycloak.service.ts:76](https://github.com/FlowCraft-AG/RoleMapper/blob/2e49de298fb7aea6638be4e21aef4b51c0753b47/backend/src/security/keycloak/keycloak.service.ts#L76)

#### Parameters

##### refresh\_token

`undefined` | `string`

#### Returns

`Promise`\<`undefined` \| `Record`\<`string`, `string` \| `number`\>\>

***

### token()

> **token**(`__namedParameters`): `Promise`\<`undefined` \| `Record`\<`string`, `string` \| `number`\>\>

Defined in: [src/security/keycloak/keycloak.service.ts:54](https://github.com/FlowCraft-AG/RoleMapper/blob/2e49de298fb7aea6638be4e21aef4b51c0753b47/backend/src/security/keycloak/keycloak.service.ts#L54)

#### Parameters

##### \_\_namedParameters

[`TokenData`](../type-aliases/TokenData.md)

#### Returns

`Promise`\<`undefined` \| `Record`\<`string`, `string` \| `number`\>\>
