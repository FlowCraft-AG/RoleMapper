import { gql } from '@apollo/client';

export const DELETE_ORG_UNIT = gql`
  mutation DeleteEntity($value: String!) {
    deleteEntity(
      input: {
        entity: ORG_UNITS
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
