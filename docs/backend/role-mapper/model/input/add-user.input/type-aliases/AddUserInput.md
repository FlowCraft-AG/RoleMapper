[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/add-user.input](../README.md) / AddUserInput

# Type Alias: AddUserInput

> **AddUserInput**: `object`

Defined in: src/role-mapper/model/input/add-user.input.ts:7

Eingabetyp für das Hinzufügen eines Benutzers zu einer Funktion.

Dieser Typ definiert die Struktur der Eingabeparameter, die erforderlich sind,
um einen Benutzer einer bestimmten Funktion zuzuordnen.

## Type declaration

### functionId

> **functionId**: `string`

Die ID der Funktion, zu der der Benutzer hinzugefügt werden soll.

#### Example

```ts
"64b1f768d9a8e900001b1b2f"
```

### userId

> **userId**: `string`

Die ID des Benutzers, der zur Funktion hinzugefügt werden soll.

#### Example

```ts
"12345"
```
