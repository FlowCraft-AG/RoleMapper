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
        }
      }
    }
  }
`;

export const USERS_BY_FUNCTION = gql`
  query GetData($functionId: String) {
    getData(
      input: {
        entity: MANDATES
        filter: { field: _id, operator: EQ, value: $functionId },
        sort: { field: functionName, direction: ASC }
      }
    ) {
      data {
        ... on Function {
          users
          functionName
          isSingleUser
        }
      }
    }
  }
`;

export const FUNCTIONS_BY_ORG_UNIT = gql`
  query GetData($functionId: String) {
    getData(
      input: {
        entity: MANDATES
        filter: { field: orgUnit, operator: EQ, value: $functionId },
        sort: { field: functionName, direction: ASC }
      }
    ) {
      data {
        ... on Function {
          _id
          functionName
          users
          orgUnit
          isSingleUser
        }
      }
    }
  }
`;
