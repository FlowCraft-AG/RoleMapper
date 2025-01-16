[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [camunda/types/input-filter/variable-filter](../README.md) / VariableFilter

# Type Alias: VariableFilter

> **VariableFilter**: [`BaseFilter`](../../base-filter/type-aliases/BaseFilter.md) & `object`

Defined in: [src/camunda/types/input-filter/variable-filter.ts:10](https://github.com/FlowCraft-AG/RoleMapper/blob/bd02a9f13cb3346480f35c2638b81cb7d31e5c1f/backend/src/camunda/types/input-filter/variable-filter.ts#L10)

Erweiterter Filter für die Suche nach Variablen in Camunda.

## Type declaration

### name?

> `optional` **name**: `string`

Name der Variable.

### processInstanceKey?

> `optional` **processInstanceKey**: `number`

Schlüssel der zugehörigen Prozessinstanz.

### scopeKey?

> `optional` **scopeKey**: `number`

Schlüssel des Geltungsbereichs der Variable.

### truncated?

> `optional` **truncated**: `boolean`

Gibt an, ob der Wert der Variable abgeschnitten wurde.

### value?

> `optional` **value**: `string`

Wert der Variable.