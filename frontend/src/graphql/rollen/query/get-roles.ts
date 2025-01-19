import { gql } from '@apollo/client';

export const GET_ALL_ROLES = gql`
  query GetData {
    getData(
      input: {
        entity: ROLES
        sort: { field: name, direction: ASC }
        pagination: { limit: 0 }
      }
    ) {
      data {
        ... on Role {
          _id
          name
        }
      }
      totalCount
    }
  }
`;

export const GET_ROLES_BY_PROCESS_ID = gql`
  query GetData($filter: [FilterInput]) {
    getData(
      input: {
        entity: ROLES
        filter: { OR: $filter }
        sort: { field: name, direction: ASC }
      }
    ) {
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

export const GET_ROLES = gql`
  query GetProcessRoles($processId: ID!, $userId: String!) {
    getProcessRoles(processId: $processId, userId: $userId) {
      roles {
        roleName
        users {
          functionName
          user {
            userId
            profile {
              firstName
              lastName
            }
          }
        }
      }
    }
  }
`;
