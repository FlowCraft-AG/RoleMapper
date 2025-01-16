[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/add-user.input](../README.md) / UserFunctionInput

# Type Alias: UserFunctionInput

> **UserFunctionInput**: `object`

Defined in: [src/role-mapper/model/input/add-user.input.ts:7](https://github.com/FlowCraft-AG/RoleMapper/blob/64577d705cc4c579b4cd41d48895a5fa1f3b9249/backend/src/role-mapper/model/input/add-user.input.ts#L7)

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
