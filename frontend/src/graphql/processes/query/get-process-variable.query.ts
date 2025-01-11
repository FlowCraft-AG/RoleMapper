import { gql } from '@apollo/client';

export const GET_ALL_PROCESS_VARIABLE = gql`
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

export const GET_PROCESS_VARIABLE_BY_PROCESS_INSTANCE_KEY = gql`
  query SearchTaskVariables($processInstanceKey: String!) {
    searchTaskVariables(filter: { processInstanceKey: $processInstanceKey }) {
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
