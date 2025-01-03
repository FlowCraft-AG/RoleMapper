import { gql } from '@apollo/client';

export const CREATE_PROCESS = gql`
  mutation CreateProcess($name: String!, $parentId: ID, $roles: [RoleInput!]) {
    createEntity(
      input: {
        entity: PROCESSES
        processData: {
          name: $name
          parentId: $parentId
          roles: $roles
        }
      }
    ) {
      success
      message
      affectedCount
      warnings
      result {
        ... on Process {
          _id
          name
          parentId
          roles {
            roleName
            roleId
          }
          processId
        }
      }
    }
  }
`;
