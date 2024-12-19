import { gql } from '@apollo/client';

export const CREATE_FUNCTIONS = gql`
  mutation CreateEntity(
    $functionName: String!
    $orgUnit: String!
    $users: [String!]!
  ) {
    createEntity(
      input: {
        entity: MANDATES
        functionData: {
          functionName: $functionName
          orgUnit: $orgUnit
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
