import { gql } from '@apollo/client';

export const GET_ALL_TASKS = gql`
  query GetTasks {
    getTasks {
      id
      name
      taskDefinitionId
      processName
      creationDate
      completionDate
      assignee
      taskState
      formKey
      formId
      formVersion
      isFormEmbedded
      processDefinitionKey
      processInstanceKey
      tenantId
      dueDate
      followUpDate
      candidateGroups
      candidateUsers
      implementation
      priority
    }
  }
`;

export const GET_TASKS_BY_PROCESS_INSTANCE_KEY = gql`
  query GetTasks($processInstanceKey: String!) {
    getTasks(filter: { processInstanceKey: $processInstanceKey }) {
      id
      name
      taskDefinitionId
      processName
      creationDate
      completionDate
      assignee
      taskState
      formKey
      formId
      formVersion
      isFormEmbedded
      processDefinitionKey
      processInstanceKey
      tenantId
      dueDate
      followUpDate
      candidateGroups
      candidateUsers
      implementation
      priority
    }
  }
`;

export const GET_ACTIVE_ELEMENT = gql`
  query GetTasks($processInstanceKey: String!) {
    getTasks(
      filter: { processInstanceKey: $processInstanceKey, state: CREATED }
    ) {
      taskDefinitionId
    }
  }
`;
export const GET_INCIDENT_FLOW_NODE = gql`
  query GetIncidentFlowNodeByProcessInstanceKey($processInstanceKey: String!) {
    getIncidentFlowNodeByProcessInstanceKey(
      processInstanceKey: $processInstanceKey
    )
  }
`;
