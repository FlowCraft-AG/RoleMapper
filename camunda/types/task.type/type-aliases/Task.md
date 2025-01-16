[**RoleMapper Backend API Documentation v2024.11.28**](../../../../README.md)

***

[RoleMapper Backend API Documentation](../../../../modules.md) / [camunda/types/task.type](../README.md) / Task

# Type Alias: Task

> **Task**: `object`

Defined in: [src/camunda/types/task.type.ts:5](https://github.com/FlowCraft-AG/RoleMapper/blob/c56690d4fd1bda4e01111a8d104f8e1bd628a5f5/backend/src/camunda/types/task.type.ts#L5)

Typ für eine Aufgabe in Camunda.
Beschreibt eine Benutzeraufgabe, einschließlich Status, zugewiesenem Benutzer und weiteren Metadaten.

## Type declaration

### assignee

> **assignee**: `string` \| `undefined`

Benutzername oder ID des Benutzers, dem die Aufgabe zugewiesen wurde.
Null, wenn die Aufgabe nicht zugewiesen ist.

### candidateGroups

> **candidateGroups**: `string`[] \| `undefined`

Liste der Kandidatengruppen, die für die Aufgabe zuständig sind.
Null, wenn keine Kandidatengruppen festgelegt sind.

### candidateUsers

> **candidateUsers**: `string`[] \| `undefined`

Liste der Kandidatenbenutzer, die für die Aufgabe zuständig sind.
Null, wenn keine Kandidatenbenutzer festgelegt sind.

### completionDate

> **completionDate**: `string` \| `undefined`

ISO-Datum/Zeit des Abschlusses der Aufgabe.
Null, wenn die Aufgabe noch nicht abgeschlossen ist.

### creationDate

> **creationDate**: `string`

ISO-Datum/Zeit der Erstellung der Aufgabe.
Beispiel: `"2025-01-01T12:00:00Z"`.

### dueDate

> **dueDate**: `string` \| `undefined`

Fälligkeitsdatum der Aufgabe (ISO-Format).
Null, wenn kein Fälligkeitsdatum festgelegt wurde.

### followUpDate

> **followUpDate**: `string` \| `undefined`

Datum für Nachverfolgung der Aufgabe (ISO-Format).
Null, wenn kein Datum festgelegt wurde.

### formId

> **formId**: `string` \| `undefined`

ID des Formulars, das mit der Aufgabe verknüpft ist.
Null, wenn kein Formular vorhanden ist.

### formKey

> **formKey**: `string` \| `undefined`

Schlüssel des Formulars, das der Aufgabe zugeordnet ist.
Null, wenn kein Formular vorhanden ist.

### formVersion

> **formVersion**: `number` \| `undefined`

Version des Formulars, das mit der Aufgabe verknüpft ist.
Null, wenn kein Formular vorhanden ist.

### id

> **id**: `string`

Eindeutige ID der Aufgabe.

### implementation?

> `optional` **implementation**: `"JOB_WORKER"` \| `"ZEEBE_USER_TASK"`

Implementierungstyp der Aufgabe.
Mögliche Werte:
- `JOB_WORKER`
- `ZEEBE_USER_TASK`

### isFormEmbedded

> **isFormEmbedded**: `boolean`

Gibt an, ob das Formular für die Aufgabe eingebettet ist.

### name

> **name**: `string`

Name der Aufgabe.
Beispiel: `"Genehmigung prüfen"` oder `"Dokument freigeben"`.

### priority

> **priority**: `number`

Priorität der Aufgabe.
Höhere Werte bedeuten eine höhere Priorität.
Beispiel: `100` für höchste Priorität.

### processDefinitionKey

> **processDefinitionKey**: `string`

Schlüssel der zugehörigen Prozessdefinition.

### processInstanceKey

> **processInstanceKey**: `string`

Schlüssel der zugehörigen Prozessinstanz.

### processName

> **processName**: `string`

Name des zugehörigen Prozesses.
Beispiel: `"Bestellprozess"` oder `"Reisekostenprozess"`.

### taskDefinitionId

> **taskDefinitionId**: `string`

ID der Aufgaben-Definition aus dem BPMN-Modell.

### taskState

> **taskState**: `"CREATED"` \| `"COMPLETED"` \| `"CANCELED"` \| `"FAILED"`

Zustand der Aufgabe.
Mögliche Werte:
- `CREATED`: Die Aufgabe wurde erstellt.
- `COMPLETED`: Die Aufgabe wurde abgeschlossen.
- `CANCELED`: Die Aufgabe wurde abgebrochen.
- `FAILED`: Die Aufgabe ist fehlgeschlagen.

### tenantId

> **tenantId**: `string`

Tenant-ID der Aufgabe.
Kann leer sein, wenn keine Multi-Tenancy verwendet wird.
