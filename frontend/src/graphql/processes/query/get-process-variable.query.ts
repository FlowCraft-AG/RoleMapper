import { gql } from '@apollo/client';

export const GET_ALL_VARIABLE = gql`
  query SearchTaskVariables {
    searchTaskVariables {
        key
        processInstanceKey
        scopeKey
        name
        value
        truncated
        tenantId
    }
}
`;

export const GET_TASKS_BY_PROCESS_INSTANCE = gql`
  query SearchTaskVariables($processInstanceKey: String!) {
    searchTaskVariables(
        filter: { processInstanceKey:  $processInstanceKey }
    ) {
        key
        processInstanceKey
        scopeKey
        name
        value
        truncated
        tenantId
    }
}
`;
