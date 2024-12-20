import { gql } from '@apollo/client';

export const CREATE_ORG_UNIT = gql`
  mutation CreateOrgUnit($name: String!, $parentId: ID, $supervisor: String) {
    createEntity(
      input: {
        entity: ORG_UNITS
        orgUnitData: {
          name: $name
          parentId: $parentId
          supervisor: $supervisor
        }
      }
    ) {
      success
      message
      affectedCount
      warnings
      result {
        ... on OrgUnit {
          _id
          name
          parentId
          supervisor
          alias
          kostenstelleNr
          type
        }
      }
    }
  }
`;
