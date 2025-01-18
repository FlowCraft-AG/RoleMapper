import { gql } from '@apollo/client';

export const CREATE_PROCESS = gql`
  mutation CreateProcess(
    $name: String!
    $parentId: ID
    $roles: [ProcessRoleInput]
  ) {
    createEntity(
      input: {
        entity: PROCESSES
        processData: { name: $name, parentId: $parentId, roles: $roles }
      }
    ) {
      success
    }
  }
`;

export const CREATE_PROCESS_COLLECTION = gql`
  mutation CreateProcess($name: String!, $parentId: ID) {
    createEntity(
      input: {
        entity: PROCESSES
        processData: { name: $name, parentId: $parentId }
      }
    ) {
      success
      result {
        ... on Process {
          _id
        }
      }
    }
  }
`;
