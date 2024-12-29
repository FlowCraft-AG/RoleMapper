import { gql } from '@apollo/client';

export const GET_ALL_FUNCTIONS = gql`
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
      functionName
      users {
        _id
        userId
        userType
        userRole
        orgUnit
        active
        validFrom
        validUntil
        profile {
          firstName
          lastName
        }
      }
    }
  }
`;

export const GET_FUNCTION_BY_ID = gql`
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
            _id
          users
          functionName
          isSingleUser
          isImpliciteFunction
        }
      }
    }
  }
`;
