import { gql } from '@apollo/client';

export const DELETE_FUNCTIONS = gql`
  mutation DeleteEntity($functionName: String) {
    deleteEntity(
      input: {
        entity: MANDATES
        filter: { field: functionName, operator: EQ, value: $functionName }
      }
    ) {
      success
      message
      affectedCount
      warnings
      result {
        ... on Function {
          _id
          functionName
          users
          orgUnit
          type
        }
      }
    }
  }
`;
