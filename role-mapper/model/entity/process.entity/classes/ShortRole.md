[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/entity/process.entity](../README.md) / ShortRole

# Class: ShortRole

Defined in: [src/role-mapper/model/entity/process.entity.ts:9](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/role-mapper/model/entity/process.entity.ts#L9)

Definiert das Schema für die Role-Entität innerhalb eines Prozesses.

## Constructors

### new ShortRole()

> **new ShortRole**(): [`ShortRole`](ShortRole.md)

#### Returns

[`ShortRole`](ShortRole.md)

## Properties

### roleId

> **roleId**: `string`

Defined in: [src/role-mapper/model/entity/process.entity.ts:16](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/role-mapper/model/entity/process.entity.ts#L16)

Eindeutige ID der Rolle.

***

### roleName

> **roleName**: `string`

Defined in: [src/role-mapper/model/entity/process.entity.ts:12](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/role-mapper/model/entity/process.entity.ts#L12)

Schlüssel der Rolle (z. B. "Reviewer").

***

### roleType

> **roleType**: `RoleType`

Defined in: [src/role-mapper/model/entity/process.entity.ts:20](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/role-mapper/model/entity/process.entity.ts#L20)

Typ der Rolle (z. B. "COLLECTION").