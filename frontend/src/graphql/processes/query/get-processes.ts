import { gql } from '@apollo/client';

export const GET_ALL_PROCESSES = gql`
  query GetData {
    getData(
      input: { entity: PROCESSES, sort: { field: name, direction: ASC } }
    ) {
      totalCount
      data {
        ... on Process {
          _id
          name
          parentId
          roles {
            roleName
            roleId
          }
        }
      }
    }
  }
`;

export const GET_PROCESS_BY_ID = gql`
  query GetData($id: String!) {
    getData(
      input: {
        entity: PROCESSES
        filter: { field: _id, operator: EQ, value: $id }
      }
    ) {
      totalCount
      data {
        ... on Process {
          _id
          name
          parentId
          roles {
            roleName
            roleId
          }
        }
      }
    }
  }
`;

export const GET_PROCESSES_SHORT = gql`
  query GetData {
    getData(
      input: { entity: PROCESSES, sort: { field: name, direction: ASC } }
    ) {
      totalCount
      data {
        ... on Process {
          _id
          name
          parentId
        }
      }
    }
  }
`;
