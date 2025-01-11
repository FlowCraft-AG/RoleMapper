/**
 * @file camunda-api.ts
 * @description Typdefinitionen und Input-Modelle für die Camunda Platform API. Diese Typen dienen als Grundlage für die Filter- und Suchanfragen der GraphQL-Resolver.
 */

export type CamundaBaseFilter = {
    tenantId?: string; // Mandanten-ID
    processDefinitionKey?: string | number; // Prozessdefinition
    processInstanceKey?: string | number; // Prozessinstanz
    startDate?: string; // Startdatum im ISO-Format
    endDate?: string; // Enddatum im ISO-Format
    state?: 'ACTIVE' | 'COMPLETED' | 'CANCELED' | 'CREATED' | 'FAILED'; // Status
};

type CamundaSortInput = {
    field: string; // Feldname für die Sortierung
    order: 'ASC' | 'DESC'; // Sortierrichtung
};

export type VariableFilterInput = {
    filter: VariableFilter; // Filter für Variablen
    size?: number; // Anzahl der zurückgegebenen Ergebnisse
    sort?: CamundaSortInput[]; // Sortierung
};

type VariableFilter = {
    key?: number;
    processInstanceKey?: number;
    scopeKey?: number;
    name?: string;
    value?: string;
    truncated?: boolean;
    tenantId?: string;
};

export type ProcessFilterInput = {
    filter: CamundaFilterInput; // Filter für die Prozessinstanzen
    size?: number; // Anzahl der zurückgegebenen Ergebnisse
    sort?: CamundaSortInput[]; // Sortierung
};

type CamundaFilterInput = CamundaBaseFilter & {
    key?: number; // Schlüssel der Prozessinstanz
    processVersion?: number; // Version der Prozessinstanz
    processVersionTag?: string; // Tag der Prozessversion
    bpmnProcessId?: string; // ID des BPMN-Prozesses
    parentKey?: number; // Schlüssel des übergeordneten Prozesses
    parentFlowNodeInstanceKey?: number; // Schlüssel der übergeordneten Flow-Node-Instanz
    startDate?: string; // Startdatum des Prozesses
    endDate?: string; // Enddatum des Prozesses
    state?: 'ACTIVE' | 'COMPLETED' | 'CANCELED'; // Status der Prozessinstanz
    incident?: boolean; // Gibt an, ob ein Incident vorliegt
    processDefinitionKey?: number; // Schlüssel der Prozessdefinition
    tenantId?: string; // Mandanten-ID
};

export type TaskSearchRequest = CamundaBaseFilter & {
    assigned?: boolean; // Gibt an, ob die Aufgabe zugewiesen ist
    assignee?: string; // Benutzername oder ID des zugewiesenen Benutzers
    assignees?: string[]; // Liste der Benutzer, die zugewiesen sind
    taskDefinitionId?: string; // ID des BPMN-Flow-Nodes
    candidateGroup?: string; // Gruppe, die in der Kandidatenliste ist
    candidateGroups?: string[]; // Gruppen, die in der Kandidatenliste sind
    candidateUser?: string; // Benutzer, der in der Kandidatenliste ist
    candidateUsers?: string[]; // Benutzer, die in der Kandidatenliste sind
    pageSize?: number; // Größe der Seite (Standard = 50)
    followUpDate?: DateRange; // Nachverfolgungsdatum
    dueDate?: DateRange; // Fälligkeitsdatum
    taskVariables?: TaskVariableFilter[]; // Filter für Variablen
    sort?: CamundaSortInput[]; // Sortieroptionen
    searchAfter?: string[]; // Für Paginierung: Folgende Seite
    searchAfterOrEqual?: string[]; // Für Paginierung: Folgende Seite (inklusive aktueller)
    searchBefore?: string[]; // Für Paginierung: Vorherige Seite
    searchBeforeOrEqual?: string[]; // Für Paginierung: Vorherige Seite (inklusive aktueller)
    includeVariables?: IncludeVariable[]; // Eingeschlossene Variablen
    implementation?: 'JOB_WORKER' | 'ZEEBE_USER_TASK'; // Typ der Implementierung
    priority?: PriorityFilter; // Prioritätsfilter
};

type DateRange = {
    from?: string; // Startdatum im ISO-Format
    to?: string; // Enddatum im ISO-Format
};

type TaskVariableFilter = {
    name: string; // Name der Variablen
    value: string; // Wert der Variablen
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'; // Vergleichsoperator
};

type IncludeVariable = {
    name: string; // Name der Variablen
    alwaysReturnFullValue: boolean; // Gibt an, ob der vollständige Wert zurückgegeben werden soll
};

type PriorityFilter = {
    eq?: number; // Genau
    gte?: number; // Größer oder gleich
    gt?: number; // Größer
    lt?: number; // Kleiner
    lte?: number; // Kleiner oder gleich
};

type ProcessDefinitionFilterInput = {
    key?: number; // Der Schlüssel der Prozessdefinition
    name?: string; // Der Name der Prozessdefinition
    version?: number; // Die Version der Prozessdefinition
    versionTag?: string; // Das Versionstag der Prozessdefinition
    bpmnProcessId?: string; // Die ID des BPMN-Prozesses
    tenantId?: string; // Die Mandanten-ID
};

export type ProcessDefinitionSearchInput = {
    filter?: ProcessDefinitionFilterInput; // Filterkriterien
    size?: number; // Größe der Ergebnisliste
    sort?: CamundaSortInput[]; // Sortieroptionen
};
