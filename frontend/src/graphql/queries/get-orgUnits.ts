import { gql } from '@apollo/client';

export const ORG_UNITS = gql`
  query GetData {
    getData(input: { entity: ORG_UNITS, sort: { field: name, direction: ASC } }) {
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
