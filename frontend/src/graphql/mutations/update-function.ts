import { gql } from '@apollo/client';

export const UPDATE_FUNCTIONS = gql`
  mutation CreateEntity(
    $value: String!
    $newFunctionName: String
    $newOrgUnit: String
    $newIsSingleUser: Boolean
  ) {
    updateEntity(
      input: {
        entity: MANDATES
        filter: { field: functionName, operator: EQ, value: $value }
        functionData: {
          functionName: $newFunctionName
          orgUnit: $newOrgUnit
          isSingleUser: $newIsSingleUser
        }
      }
    ) {
      success
      message
      affectedCount
      warnings
    }
  }
`;
