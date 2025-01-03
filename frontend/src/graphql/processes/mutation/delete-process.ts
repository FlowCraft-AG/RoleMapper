import { gql } from '@apollo/client';

export const DELETE_PROCESS = gql`
  mutation DeleteEntity($value: String!) {
    deleteEntity(
      input: {
        entity: PROCESSES
        filter: { field: _id, operator: EQ, value: $value }
      }
    ) {
      success
      message
      affectedCount
      warnings
    }
  }
`;
