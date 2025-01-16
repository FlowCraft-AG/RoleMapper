[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [role-mapper/resolver/entity-result.resolver](../README.md) / EntityResultResolver

# Class: EntityResultResolver

Defined in: [src/role-mapper/resolver/entity-result.resolver.ts:16](https://github.com/FlowCraft-AG/RoleMapper/blob/64577d705cc4c579b4cd41d48895a5fa1f3b9249/backend/src/role-mapper/resolver/entity-result.resolver.ts#L16)

Resolver für die Union `EntityResult`.

Dieser Resolver bestimmt zur Laufzeit den konkreten Typ eines Objekts innerhalb
der Union `EntityResult`, basierend auf dessen Eigenschaften.

## Constructors

### new EntityResultResolver()

> **new EntityResultResolver**(): [`EntityResultResolver`](EntityResultResolver.md)

#### Returns

[`EntityResultResolver`](EntityResultResolver.md)

## Methods

### resolveType()

> **resolveType**(`object`): `undefined` \| `string`

Defined in: [src/role-mapper/resolver/entity-result.resolver.ts:34](https://github.com/FlowCraft-AG/RoleMapper/blob/64577d705cc4c579b4cd41d48895a5fa1f3b9249/backend/src/role-mapper/resolver/entity-result.resolver.ts#L34)

Bestimmt den konkreten Typ eines Objekts innerhalb der Union `EntityResult`.

Diese Methode überprüft die Eigenschaften des übergebenen Objekts und gibt
den entsprechenden Typ zurück, falls dieser erkannt wird.

#### Parameters

##### object

`Record`\<`string`, `unknown`\>

Das Objekt, dessen Typ bestimmt werden soll.

#### Returns

`undefined` \| `string`

Der Name des konkreten Typs (`User`, `Function`, `Process`, `Role`, `OrgUnit`),
                              falls erkannt; andernfalls `undefined`.

#### Example

```typescript
const type = resolver.resolveType({ userId: '123' });
console.log(type); // 'User'
```
