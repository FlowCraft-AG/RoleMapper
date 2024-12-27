import { gql } from '@apollo/client';

export const UPDATE_ORG_UNIT = gql`
  mutation UpdateEntity($id: String, $name: String, $supervisor: String) {
    updateEntity(
      input: {
        entity: ORG_UNITS
        filter: { field: _id, operator: EQ, value: $id }
        orgUnitData: { name: $name, supervisor: $supervisor }
      }
    ) {
      success
    }
  }
`;
