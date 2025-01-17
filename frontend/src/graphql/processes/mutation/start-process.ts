import { gql } from '@apollo/client';

export const START_CAMUNDA_PROCESS = gql`
  mutation StartProcess(
    $processKey: String!
    $userId: String!
    $orgUnitId: String
  ) {
    startProcess(
      processKey: $processKey
      userId: $userId
      orgUnitId: $orgUnitId
    ) {
      success
      message
    }
  }
`;
