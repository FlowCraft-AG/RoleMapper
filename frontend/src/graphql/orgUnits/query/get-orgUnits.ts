import { gql } from '@apollo/client';

export const GET_ALL_ORG_UNITS = gql`
  query GetData {
    getData(
      input: {
        entity: ORG_UNITS
        sort: { field: name, direction: ASC }
        pagination: { limit: 0, offset: 0 }
      }
    ) {
      totalCount
      data {
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

export const GET_ORG_UNIT_BY_ID = gql`
  query GetData($id: String!) {
    getData(
      input: {
        entity: ORG_UNITS
        filter: { field: _id, operator: EQ, value: $id }
        pagination: { limit: 0, offset: 0 }
      }
    ) {
      totalCount
      data {
        ... on OrgUnit {
          _id
          name
          supervisor
        }
      }
    }
  }
`;
