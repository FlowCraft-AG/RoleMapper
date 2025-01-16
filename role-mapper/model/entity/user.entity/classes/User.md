[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/entity/user.entity](../README.md) / User

# Class: User

Defined in: [src/role-mapper/model/entity/user.entity.ts:86](https://github.com/FlowCraft-AG/RoleMapper/blob/da8087f9c63e7aa49e7a655f3f13ecbe5687d6eb/backend/src/role-mapper/model/entity/user.entity.ts#L86)

Repräsentiert einen Benutzer in der Datenbank.

## Schema

HKA_Users

## Timestamps

true

## Extends

- `Document`

## Constructors

### new User()

> **new User**(`doc`?): [`User`](User.md)

Defined in: node\_modules/mongoose/types/document.d.ts:22

#### Parameters

##### doc?

`any`

#### Returns

[`User`](User.md)

#### Inherited from

`Document.constructor`

## Properties

### active

> **active**: `boolean`

Defined in: [src/role-mapper/model/entity/user.entity.ts:121](https://github.com/FlowCraft-AG/RoleMapper/blob/da8087f9c63e7aa49e7a655f3f13ecbe5687d6eb/backend/src/role-mapper/model/entity/user.entity.ts#L121)

Gibt an, ob der Benutzer aktiv ist.

#### Required

#### Default

```ts
true
```

***

### employee?

> `optional` **employee**: `Employee`

Defined in: [src/role-mapper/model/entity/user.entity.ts:156](https://github.com/FlowCraft-AG/RoleMapper/blob/da8087f9c63e7aa49e7a655f3f13ecbe5687d6eb/backend/src/role-mapper/model/entity/user.entity.ts#L156)

Optionales Mitarbeiterobjekt, falls der Benutzer ein Mitarbeiter ist.

#### Optional

***

### orgUnit

> **orgUnit**: `string`

Defined in: [src/role-mapper/model/entity/user.entity.ts:113](https://github.com/FlowCraft-AG/RoleMapper/blob/da8087f9c63e7aa49e7a655f3f13ecbe5687d6eb/backend/src/role-mapper/model/entity/user.entity.ts#L113)

Organisationseinheit des Benutzers.

#### Required

***

### profile

> **profile**: `Profile`

Defined in: [src/role-mapper/model/entity/user.entity.ts:142](https://github.com/FlowCraft-AG/RoleMapper/blob/da8087f9c63e7aa49e7a655f3f13ecbe5687d6eb/backend/src/role-mapper/model/entity/user.entity.ts#L142)

Profil des Benutzers.

#### Required

***

### student?

> `optional` **student**: `Student`

Defined in: [src/role-mapper/model/entity/user.entity.ts:149](https://github.com/FlowCraft-AG/RoleMapper/blob/da8087f9c63e7aa49e7a655f3f13ecbe5687d6eb/backend/src/role-mapper/model/entity/user.entity.ts#L149)

Optionales Studentenobjekt, falls der Benutzer ein Student ist.

#### Optional

***

### userId

> **userId**: `string`

Defined in: [src/role-mapper/model/entity/user.entity.ts:92](https://github.com/FlowCraft-AG/RoleMapper/blob/da8087f9c63e7aa49e7a655f3f13ecbe5687d6eb/backend/src/role-mapper/model/entity/user.entity.ts#L92)

Eindeutige Benutzer-ID.

#### Required

***

### userRole

> **userRole**: `string`

Defined in: [src/role-mapper/model/entity/user.entity.ts:106](https://github.com/FlowCraft-AG/RoleMapper/blob/da8087f9c63e7aa49e7a655f3f13ecbe5687d6eb/backend/src/role-mapper/model/entity/user.entity.ts#L106)

Rolle des Benutzers (z.B. Admin, User).

#### Required

***

### userType

> **userType**: `string`

Defined in: [src/role-mapper/model/entity/user.entity.ts:99](https://github.com/FlowCraft-AG/RoleMapper/blob/da8087f9c63e7aa49e7a655f3f13ecbe5687d6eb/backend/src/role-mapper/model/entity/user.entity.ts#L99)

Typ des Benutzers (z.B. Student, Mitarbeiter).

#### Required

***

### validFrom

> **validFrom**: `Date`

Defined in: [src/role-mapper/model/entity/user.entity.ts:128](https://github.com/FlowCraft-AG/RoleMapper/blob/da8087f9c63e7aa49e7a655f3f13ecbe5687d6eb/backend/src/role-mapper/model/entity/user.entity.ts#L128)

Datum, ab dem der Benutzer gültig ist.

#### Required

***

### validUntil

> **validUntil**: `Date`

Defined in: [src/role-mapper/model/entity/user.entity.ts:135](https://github.com/FlowCraft-AG/RoleMapper/blob/da8087f9c63e7aa49e7a655f3f13ecbe5687d6eb/backend/src/role-mapper/model/entity/user.entity.ts#L135)

Datum, bis zu dem der Benutzer gültig ist.

#### Required
