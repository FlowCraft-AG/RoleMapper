[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [role-mapper/model/input/update.input](../README.md) / UpdateUserInput

# Type Alias: UpdateUserInput

> **UpdateUserInput**: `object`

Defined in: [src/role-mapper/model/input/update.input.ts:8](https://github.com/FlowCraft-AG/RoleMapper/blob/de0e51be3f89e6fa69f76597242a3d3e3b4ee01f/backend/src/role-mapper/model/input/update.input.ts#L8)

Eingabetyp für die Aktualisierung von Benutzerdaten.

## Type declaration

### active?

> `optional` **active**: `boolean`

Gibt an, ob der Benutzer aktiv ist.

### employee?

> `optional` **employee**: [`UpdateEmployeeInput`](UpdateEmployeeInput.md)

Spezifische Daten für Mitarbeiter.

### orgUnit?

> `optional` **orgUnit**: `string`

Die zugeordnete Organisationseinheit des Benutzers.

### student?

> `optional` **student**: [`UpdateStudentInput`](UpdateStudentInput.md)

Spezifische Daten für Studenten.

### userId

> **userId**: `string`

Die ID des Benutzers.

### userRole?

> `optional` **userRole**: `string`

Die Rolle des Benutzers.

### userType?

> `optional` **userType**: `string`

Der Typ des Benutzers (z. B. 'Student' oder 'Mitarbeiter').

### validFrom?

> `optional` **validFrom**: `string`

Gültigkeitsbeginn des Benutzers.

### validUntil?

> `optional` **validUntil**: `string`

Gültigkeitsende des Benutzers.
