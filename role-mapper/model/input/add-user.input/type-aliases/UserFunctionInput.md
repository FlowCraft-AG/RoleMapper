[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/add-user.input](../README.md) / UserFunctionInput

# Type Alias: UserFunctionInput

> **UserFunctionInput**: `object`

Defined in: [src/role-mapper/model/input/add-user.input.ts:7](https://github.com/FlowCraft-AG/RoleMapper/blob/d09e0a221a0891128652190f77e15989426161d8/backend/src/role-mapper/model/input/add-user.input.ts#L7)

Eingabetyp für Operationen, die Benutzer einer Funktion zuordnen oder entfernen.

Dieser Typ definiert die Eingabedaten, die für das Hinzufügen oder Entfernen
eines Benutzers zu/von einer Funktion erforderlich sind.

## Type declaration

### functionId

> **functionId**: `string`

Die ID der Funktion, auf die sich die Operation bezieht.

#### Example

```ts
"64b1f768d9a8e900001b1b2f"
```

### userId

> **userId**: `string`

Die ID des Benutzers, der hinzugefügt oder entfernt werden soll.

#### Example

```ts
"12345"
```
