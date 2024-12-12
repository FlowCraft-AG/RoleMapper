import { gql } from '@apollo/client';

export const FUNCTIONS = gql`
  query GetData {
    getData(input: { entity: MANDATES }) {
      totalCount
      data {
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
