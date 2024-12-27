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
          isSingleUser
          isImpliciteFunction
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
        filter: { field: _id, operator: EQ, value: $functionId }
        sort: { field: functionName, direction: ASC }
      }
    ) {
      data {
        ... on Function {
          users
          functionName
          isSingleUser
          isImpliciteFunction
        }
      }
    }
  }
`;

export const FUNCTIONS_BY_ORG_UNIT = gql`
  query GetData($orgUnitId: String) {
    getData(
      input: {
        entity: MANDATES
        filter: { field: orgUnit, operator: EQ, value: $orgUnitId }
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
          isImpliciteFunction
        }
      }
    }
  }
`;

export const GET_SAVED_DATA = gql`
  query GetSavedData($id: ID!) {
    getSavedData(id: $id) {
      users
      functionName
    }
  }
`;
