[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [security/http/helmet.handler](../README.md) / helmetHandlers

# Variable: helmetHandlers

> `const` **helmetHandlers**: (`_req`, `res`, `next`) => `void`[]

Defined in: [src/security/http/helmet.handler.ts:6](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/security/http/helmet.handler.ts#L6)

Security-Funktionen für z.B. CSP, XSS, Click-Jacking, HSTS und MIME-Sniffing.

## Parameters

### \_req

`IncomingMessage`

### res

`ServerResponse`\<`IncomingMessage`\>

### next

() => `void`

## Returns

`void`
