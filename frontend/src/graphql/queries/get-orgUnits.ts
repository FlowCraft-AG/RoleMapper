import { gql } from '@apollo/client';

export const ORG_UNITS = gql`
  query GetData {
    getData(
      input: { entity: ORG_UNITS, sort: { field: name, direction: ASC } }
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

export const ORG_UNITS_IDS = gql`
  query GetData {
    getData(
      input: { entity: ORG_UNITS, sort: { field: name, direction: ASC } }
    ) {
      totalCount
      data {
        ... on OrgUnit {
          _id
          name
          parentId
        }
      }
    }
  }
`;

export const ORG_UNIT_BY_ID = gql`
  query GetData($id: String!) {
    getData(
      input: {
        entity: ORG_UNITS
        filter: { field: _id, operator: EQ, value: $id }
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
