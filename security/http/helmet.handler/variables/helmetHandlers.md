[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [security/http/helmet.handler](../README.md) / helmetHandlers

# Variable: helmetHandlers

> `const` **helmetHandlers**: (`_req`, `res`, `next`) => `void`[]

Defined in: [src/security/http/helmet.handler.ts:6](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/security/http/helmet.handler.ts#L6)

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
