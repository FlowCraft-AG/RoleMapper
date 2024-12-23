import { gql } from '@apollo/client';

export const USERS = gql`
  query GetData {
    getData(input: { entity: USERS }) {
      totalCount
      data {
        ... on User {
          _id
          userId
          userType
          userRole
          orgUnit
          active
          validFrom
          validUntil
          employee {
            costCenter
            department
          }
          student {
            _id
            courseOfStudy
            courseOfStudyUnique
            courseOfStudyShort
            courseOfStudyName
            level
            examRegulation
          }
        }
      }
    }
  }
`;

export const USER_IDS = gql`
  query GetData {
    getData(input: { entity: USERS, sort: { field: userId, direction: ASC } }) {
      totalCount
      data {
        ... on User {
          userId
        }
      }
    }
  }
`;

export const USER_DETAILS = gql`
  query GetData($userId: String) {
    getData(
      input: {
        entity: USERS
        filter: { field: userId, operator: EQ, value: $userId }
        sort: { field: userId, direction: ASC }
      }
    ) {
      data {
        ... on User {
          _id
          userId
          userType
          userRole
          orgUnit
          active
          validFrom
          validUntil
          employee {
            costCenter
            department
          }
          student {
            _id
            courseOfStudy
            courseOfStudyUnique
            courseOfStudyShort
            courseOfStudyName
            level
            examRegulation
          }
        }
      }
    }
  }
`;

export const MITGLIEDER = gql`
  query GetData($alias: String, $kostenstelleNr: String) {
    getData(
      input: {
        entity: USERS
        filter: {
          OR: [
            { field: orgUnit, operator: EQ, value: $alias }
            { field: orgUnit, operator: EQ, value: $kostenstelleNr }
          ]
        }
        sort: { field: userId, direction: ASC }
      }
    ) {
      totalCount
      data {
        ... on User {
          _id
          userId
          userType
          userRole
          orgUnit
          active
          validFrom
          validUntil
          employee {
            costCenter
            department
          }
          student {
            _id
            courseOfStudy
            courseOfStudyUnique
            courseOfStudyShort
            courseOfStudyName
            level
            examRegulation
          }
        }
      }
    }
  }
`;

export const GET_EMPLOYEES = gql`
  query GetData {
    getData(
      input: {
        entity: USERS
        filter: { field: userType, operator: EQ, value: "employee" }
        sort: { field: userId, direction: ASC }
      }
    ) {
      totalCount
      data {
        ... on User {
          userId
          _id
        }
      }
    }
  }
`;
