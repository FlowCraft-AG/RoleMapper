[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/resolver/camunda-mutation.resolver](../README.md) / CamundaMutationResolver

# Class: CamundaMutationResolver

Defined in: [src/camunda/resolver/camunda-mutation.resolver.ts:54](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/camunda/resolver/camunda-mutation.resolver.ts#L54)

GraphQL-Resolver für die Verarbeitung von Anfragen an die Camunda Platform API.

Dieser Resolver unterstützt:
- Abfragen von Aufgaben
- Abruf von Prozessinstanzen
- Zugriff auf Prozessdefinitionen

Alle Anfragen nutzen:
- Authentifizierung über Keycloak
- Logging
- Fehlerbehandlung

## Constructors

### new CamundaMutationResolver()

> **new CamundaMutationResolver**(`camundaService`): [`CamundaMutationResolver`](CamundaMutationResolver.md)

Defined in: [src/camunda/resolver/camunda-mutation.resolver.ts:71](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/camunda/resolver/camunda-mutation.resolver.ts#L71)

Konstruktor für den CamundaResolver.

#### Parameters

##### camundaService

[`CamundaWriteService`](../../../service/camunda-write.service/classes/CamundaWriteService.md)

Service für die Kommunikation mit der Camunda API.

#### Returns

[`CamundaMutationResolver`](CamundaMutationResolver.md)

## Methods

### deleteProcessInstance()

> **deleteProcessInstance**(`key`, `context`): `Promise`\<`string`\>

Defined in: [src/camunda/resolver/camunda-mutation.resolver.ts:77](https://github.com/FlowCraft-AG/RoleMapper/blob/aa2b8d129f8bd1600fa58ea512b195a2a2308efd/backend/src/camunda/resolver/camunda-mutation.resolver.ts#L77)

#### Parameters

##### key

`string`

##### context

[`GraphQLContext`](../type-aliases/GraphQLContext.md)

#### Returns

`Promise`\<`string`\>
