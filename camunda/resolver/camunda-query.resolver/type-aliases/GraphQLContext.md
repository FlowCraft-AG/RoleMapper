[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/resolver/camunda-query.resolver](../README.md) / GraphQLContext

# Type Alias: GraphQLContext

> **GraphQLContext**: `object`

Defined in: [src/camunda/resolver/camunda-query.resolver.ts:31](https://github.com/FlowCraft-AG/RoleMapper/blob/dfa0426eb5b55e53274c22382030e399befc29aa/backend/src/camunda/resolver/camunda-query.resolver.ts#L31)

Typ für den GraphQL-Kontext, der in Resolvern verwendet wird.
Enthält Informationen über den eingehenden HTTP-Request.

## Type declaration

### req

> **req**: `object`

HTTP-Request-Objekt, das vom GraphQL-Server bereitgestellt wird.

#### req.headers

> **headers**: `object`

HTTP-Header des eingehenden Requests.
Der `authorization`-Header ist optional, wird jedoch benötigt,
um das Bearer-Token zu extrahieren.

#### req.headers.authorization?

> `optional` **authorization**: `string`
