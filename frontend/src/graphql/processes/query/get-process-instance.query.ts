import { gql } from '@apollo/client';

/**
 * GraphQL-Abfrage, um alle Camunda-Prozessinstanzen zu erhalten.
 * Die Ergebnisse werden nach `bpmnProcessId` aufsteigend sortiert.
 */
export const GET_ALL_PROCESS_INSTANCES = gql`
  query GetCamundaProcesses {
    getCamundaProcesses(
      filter: { sortBy: [{ field: "bpmnProcessId", order: ASC }] }
    ) {
      key
      processVersion
      bpmnProcessId
      startDate
      state
      incident
      processDefinitionKey
      tenantId
    }
  }
`;

/**
 * GraphQL-Abfrage, um eine spezifische Camunda-Prozessinstanz anhand ihres Schlüssels zu erhalten.
 * @param $key Der Schlüssel der Prozessinstanz, die abgefragt werden soll.
 */
export const GET_PROCESS_INSTANCE_BY_PROCESS_INSTANCE_KEY = gql`
  query GetCamundaProcesses($key: ID!) {
    getCamundaProcesses(
      filter: { key: $key, sortBy: [{ field: "bpmnProcessId", order: ASC }] }
    ) {
      key
      processVersion
      bpmnProcessId
      startDate
      state
      incident
      processDefinitionKey
      tenantId
    }
  }
`;

/**
 * GraphQL-Abfrage, um die XML-Darstellung einer Prozessdefinition anhand ihres Schlüssels zu erhalten.
 * @param $processDefinitionKey Der Schlüssel der Prozessdefinition, deren XML abgefragt werden soll.
 */
export const GET_PROCESS_DEFINITION_XML_BY_PROCESS_DEFINITION_KEY = gql`
  query GetProcessDefinitionXmlByKey($processDefinitionKey: ID!) {
    getProcessDefinitionXmlByKey(processDefinitionKey: $processDefinitionKey)
  }
`;

export const GET_PROCESS_INSTANCE_BY_USER = gql`
  query GetProcessInstancesByUserId($userId: String!) {
    getProcessInstancesByUserId(userId: $userId) {
      key
      processVersion
      bpmnProcessId
      startDate
      state
      incident
      processDefinitionKey
      tenantId
    }
  }
`;
