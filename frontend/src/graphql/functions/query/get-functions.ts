import { gql } from '@apollo/client';

export const GET_ALL_FUNCTIONS = gql`
  query GetData {
    getData(
      input: { entity: MANDATES, sort: { field: functionName, direction: ASC } }
    ) {
      totalCount
      data {
        ... on Function {
          _id
          functionName
          users
          isImpliciteFunction
          orgUnit
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
          orgUnit
        }
      }
    }
  }
`;

export const HAS_SINGLE_USERS = gql`
  query GetData {
    getData(
      input: {
        entity: MANDATES
        filter: { field: isSingleUser, operator: EQ, value: "true" }
      }
    ) {
      data {
        ... on Function {
          functionName
          users
          isSingleUser
          orgUnit
          _id
        }
      }
      totalCount
    }
  }
`;

export const GET_ANCESTORS = gql`
  query GetAncestors($id: ID) {
    getAncestors(id: $id) {
      _id
      name
    }
  }
`;
