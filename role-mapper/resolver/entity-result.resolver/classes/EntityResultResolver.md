[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/resolver/entity-result.resolver](../README.md) / EntityResultResolver

# Class: EntityResultResolver

Defined in: [src/role-mapper/resolver/entity-result.resolver.ts:36](https://github.com/FlowCraft-AG/RoleMapper/blob/2b9cb86a69a058eebb4388dc6380ab3f35004bd1/backend/src/role-mapper/resolver/entity-result.resolver.ts#L36)

Resolver für die Union `EntityResult`.
Bestimmt zur Laufzeit den konkreten Typ des Objekts basierend auf dessen Eigenschaften.

## Constructors

### new EntityResultResolver()

> **new EntityResultResolver**(): [`EntityResultResolver`](EntityResultResolver.md)

#### Returns

[`EntityResultResolver`](EntityResultResolver.md)

## Methods

### resolveType()

> **resolveType**(`object`): `undefined` \| `string`

Defined in: [src/role-mapper/resolver/entity-result.resolver.ts:43](https://github.com/FlowCraft-AG/RoleMapper/blob/2b9cb86a69a058eebb4388dc6380ab3f35004bd1/backend/src/role-mapper/resolver/entity-result.resolver.ts#L43)

Bestimmt den konkreten Typ eines Objekts innerhalb der Union `EntityResult`.

#### Parameters

##### object

`Record`\<`string`, `unknown`\>

Das Objekt, dessen Typ aufgelöst werden soll.

#### Returns

`undefined` \| `string`

Der Name des konkreten Typs, falls erkannt; andernfalls `undefined`.
