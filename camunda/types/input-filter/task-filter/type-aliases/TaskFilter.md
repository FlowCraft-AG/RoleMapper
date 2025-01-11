[**RoleMapper Backend API Documentation v2024.11.28**](../../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../../modules.md) / [camunda/types/input-filter/task-filter](../README.md) / TaskFilter

# Type Alias: TaskFilter

> **TaskFilter**: [`BaseFilter`](../../base-filter/type-aliases/BaseFilter.md) & `object`

Defined in: [src/camunda/types/input-filter/task-filter.ts:10](https://github.com/FlowCraft-AG/RoleMapper/blob/8da0bd78326e48681af59eedcf5fc8f5e650849b/backend/src/camunda/types/input-filter/task-filter.ts#L10)

Erweiterter Filter für die Suche nach Aufgaben in der Camunda Tasklist API.

## Type declaration

### assigned?

> `optional` **assigned**: `boolean`

Gibt an, ob die Aufgabe einer Person zugewiesen ist.
- `true`: Nur zugewiesene Aufgaben
- `false`: Nur unzugewiesene Aufgaben

### assignee?

> `optional` **assignee**: `string`

Benutzername oder ID des Benutzers, dem die Aufgabe zugewiesen ist.

### assignees?

> `optional` **assignees**: `string`[]

Liste möglicher Benutzer, denen die Aufgabe zugewiesen sein könnte.

### candidateGroup?

> `optional` **candidateGroup**: `string`

Kandidatengruppe, die für die Aufgabe zuständig ist.

### candidateGroups?

> `optional` **candidateGroups**: `string`[]

Liste von Kandidatengruppen, die für die Aufgabe zuständig sein könnten.

### candidateUser?

> `optional` **candidateUser**: `string`

Kandidatenbenutzer, der für die Aufgabe zuständig ist.

### candidateUsers?

> `optional` **candidateUsers**: `string`[]

Liste von Kandidatenbenutzern, die für die Aufgabe zuständig sein könnten.

### dueDate?

> `optional` **dueDate**: `DateRange`

Zeitraum für das Fälligkeitsdatum (Due-Date).

### followUpDate?

> `optional` **followUpDate**: `DateRange`

Zeitraum für das Nachverfolgungsdatum (Follow-Up-Date).

### includeVariables?

> `optional` **includeVariables**: `IncludeVariable`[]

Variablen, die in den Ergebnissen enthalten sein sollen.

### processDefinitionKey?

> `optional` **processDefinitionKey**: `string`

Schlüssel der zugehörigen Prozessdefinition.

### processInstanceKey?

> `optional` **processInstanceKey**: `string`

Schlüssel der zugehörigen Prozessinstanz.

### state?

> `optional` **state**: `"CREATED"` \| `"COMPLETED"` \| `"CANCELED"` \| `"FAILED"`

Status der Aufgabe.
Mögliche Werte: `CREATED`, `COMPLETED`, `CANCELED`, `FAILED`.

### taskVariables?

> `optional` **taskVariables**: `VariableFilter`[]

Variablen, die bei der Aufgabenfilterung berücksichtigt werden sollen.
