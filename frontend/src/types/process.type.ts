interface Task {
  id: string;
  name: string;
  assignee: string | null;
}

interface Variable {
  value: string;
}

export interface ProcessDetails {
  key: string;
  processVersion: number;
  bpmnProcessId: string;
  startDate: string;
  state: string;
  incident: false;
  processDefinitionKey: string;
  tenantId: string;
}

export interface ProcessInstance {
  id: string;
  definitionId: string;
  businessKey: string;
  tasks: Task[];
  variables: Record<string, Variable>;
  processDefinitionKey: string;
}

export type ProcessVariable = {
  key: number;
  processInstanceKey: number;
  scopeKey: number;
  name: string;
  value: string;
  truncated: boolean;
  tenantId: string;
};

export type ProcessTask = {
  id: string;
  name: string;
  taskDefinitionId: string;
  processName: string;
  creationDate: string;
  completionDate: string | null;
  assignee: string | null;
  taskState: string;
  formKey: string | null;
  formId: string | null;
  formVersion: number | null;
  isFormEmbedded: boolean;
  processDefinitionKey: string;
  processInstanceKey: string;
  tenantId: string;
  dueDate: string | null;
  followUpDate: string | null;
  candidateGroups: string[] | null;
  candidateUsers: string[] | null;
  implementation: string;
  priority: number;
};
