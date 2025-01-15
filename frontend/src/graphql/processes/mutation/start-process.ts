import { gql } from '@apollo/client';

export const START_CAMUNDA_PROCESS = gql`
  mutation StartProcess($processKey: String!, $userId: String!) {
    startProcess(processKey: $processKey, userId: $userId)
  }
`;
