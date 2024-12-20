import { gql } from '@apollo/client';

export const CREATE_FUNCTIONS = gql`
  mutation CreateEntity(
    $functionName: String!
    $orgUnit: String!
    $users: [String!]!
    $isSingleUser: Boolean!
  ) {
    createEntity(
      input: {
        entity: MANDATES
        functionData: {
          functionName: $functionName
          orgUnit: $orgUnit
          users: $users
          isSingleUser: $isSingleUser
        }
      }
    ) {
      success
      message
      affectedCount
    }
  }
`;
