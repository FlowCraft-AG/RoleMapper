import { gql } from '@apollo/client';

export const GET_ALL_ROLES = gql`
  query GetData {
    getData(input: { entity: ROLES, sort: { field: name, direction: ASC } }) {
      totalCount
      data {
        ... on Role {
          _id
          name
          roleId
          query {
            match {
              expr {
                eq
                in
                ifNull
              }
            }
            lookup {
              from
              let
              pipeline {
                match {
                  expr {
                    eq
                  }
                }
              }
              as
            }
            unwind {
              path
              preserveNullAndEmptyArrays
            }
            project {
              functionName
              user {
                _id
                userId
                userType
                userRole
                orgUnit
                active
                validFrom
                validUntil
                employee
                profile
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ROLES_BY_PROCESS_ID = gql`
  query GetData($filter: [FilterInput]) {
    getData(input: { entity: ROLES, filter: { OR: $filter } }) {
      data {
        ... on Role {
          _id
          name
          roleId
        }
      }
      totalCount
    }
  }
`;
