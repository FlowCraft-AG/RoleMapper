import { gql } from '@apollo/client';

export const DELETE_FUNCTIONS = gql`
  mutation DeleteEntity($functionId: String) {
    deleteEntity(
      input: {
        entity: MANDATES
        filter: { field: _id, operator: EQ, value: $functionId }
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
