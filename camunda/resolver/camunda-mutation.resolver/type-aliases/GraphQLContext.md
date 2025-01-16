[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/resolver/camunda-mutation.resolver](../README.md) / GraphQLContext

# Type Alias: GraphQLContext

> **GraphQLContext**: `object`

Defined in: [src/camunda/resolver/camunda-mutation.resolver.ts:22](https://github.com/FlowCraft-AG/RoleMapper/blob/55ba436164ff7e5a7c4d8ad55ac7ddffe5029190/backend/src/camunda/resolver/camunda-mutation.resolver.ts#L22)

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
