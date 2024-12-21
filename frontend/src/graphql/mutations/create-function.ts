import { gql } from '@apollo/client';

export const CREATE_EXPLICITE_FUNCTIONS = gql`
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

export const CREATE_IMPLICITE_FUNCTIONS = gql`
  mutation CreateEntity(
    $functionName: String!
    $value: String
    $orgUnitId: ID!
    $field: FilterOptions
  ) {
    saveQuery(
      functionName: $functionName
      input: {
        entity: USERS
        filter: { field: $field, operator: EQ, value: $value }
        sort: { field: userId, direction: ASC }
      }
      orgUnitId: $orgUnitId
    )
  }
`;
