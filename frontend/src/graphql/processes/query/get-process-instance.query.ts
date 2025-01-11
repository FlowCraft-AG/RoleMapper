import { gql } from '@apollo/client';

export const GET_ALL_PROCESS_INSTANCES = gql`
  query GetCamundaProcesses {
    getCamundaProcesses {
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

export const GET_PROCESS_INSTANCE_BY_KEY = gql`
  query GetCamundaProcesses($key: String!) {
    getCamundaProcesses(filter: { key: $key } ) {
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

export const GET_PROCESS_DEFINITION_XML_BY_PROCESS_DEFINITION_KEY = gql`
  query GetProcessDefinitionXmlByKey($processDefinitionKey: String!) {
    getProcessDefinitionXmlByKey(
        processDefinitionKey: $processDefinitionKey
    )
}
`;
