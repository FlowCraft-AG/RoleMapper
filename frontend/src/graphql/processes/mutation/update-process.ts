import { gql } from '@apollo/client';

export const UPDATE_PROCESS = gql`
  mutation UpdateEntity(
    $id: String
    $name: String
    $parentId: String
    $roles: [RoleInput!]
  ) {
    updateEntity(
      input: {
        entity: PROCESSES
        filter: { field: _id, operator: EQ, value: $id }
        processData: { name: $name, parentId: $parentId, roles: $roles }
      }
    ) {
      success
    }
  }
`;
