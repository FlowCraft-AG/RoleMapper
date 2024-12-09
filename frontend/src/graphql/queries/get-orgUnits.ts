import { gql } from '@apollo/client';

export const ORG_UNITS = gql`
  query GetData {
    getData(input: { entity: ORG_UNITS }) {
        totalCount
        data {
            ... on OrgUnit {
                _id
                name
                parentId
                supervisor
            }
        }
    }
}

`;
