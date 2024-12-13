import { gql } from '@apollo/client';

export const CREATE_FUNCTIONS = gql`
  mutation CreateEntity(
    $functionName: String!
    $orgUnit: String!
    $type: String!
    $users: [String!]!
  ) {
    createEntity(
      input: {
        entity: MANDATES
        functionData: {
          functionName: $functionName
          orgUnit: $orgUnit
          type: $type
          users: $users
        }
      }
    ) {
      success
      message
      affectedCount
    }
  }
`;
