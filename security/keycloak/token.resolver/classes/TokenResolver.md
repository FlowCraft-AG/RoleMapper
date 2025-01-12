[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [security/keycloak/token.resolver](../README.md) / TokenResolver

# Class: TokenResolver

Defined in: [src/security/keycloak/token.resolver.ts:25](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/security/keycloak/token.resolver.ts#L25)

## Constructors

### new TokenResolver()

> **new TokenResolver**(`keycloakService`): [`TokenResolver`](TokenResolver.md)

Defined in: [src/security/keycloak/token.resolver.ts:30](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/security/keycloak/token.resolver.ts#L30)

#### Parameters

##### keycloakService

[`KeycloakService`](../../keycloak.service/classes/KeycloakService.md)

#### Returns

[`TokenResolver`](TokenResolver.md)

## Methods

### refresh()

> **refresh**(`input`): `Promise`\<`Record`\<`string`, `string` \| `number`\>\>

Defined in: [src/security/keycloak/token.resolver.ts:53](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/security/keycloak/token.resolver.ts#L53)

#### Parameters

##### input

[`RefreshInput`](../type-aliases/RefreshInput.md)

#### Returns

`Promise`\<`Record`\<`string`, `string` \| `number`\>\>

***

### token()

> **token**(`__namedParameters`): `Promise`\<`Record`\<`string`, `string` \| `number`\>\>

Defined in: [src/security/keycloak/token.resolver.ts:36](https://github.com/FlowCraft-AG/RoleMapper/blob/ac5d66f12f967d3e6cc401aba4d232c3d8d25cca/backend/src/security/keycloak/token.resolver.ts#L36)

#### Parameters

##### \_\_namedParameters

[`TokenInput`](../type-aliases/TokenInput.md)

#### Returns

`Promise`\<`Record`\<`string`, `string` \| `number`\>\>
