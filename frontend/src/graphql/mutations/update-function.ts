import { gql } from '@apollo/client';

export const CREATE_FUNCTIONS = gql`
  mutation CreateEntity(
    $functionName: String!
    $orgUnit: String!
    $type: String!
    $users: [String!]!
  ) {
    updateEntity(
      input: {
        entity: MANDATES
        filters: [{ field: functionName, operator: EQ, value: "Student" }]
        functionData: { functionName: "name2" }
      }
    ) {
      success
      message
      affectedCount
      warnings
    }
  }
`;
