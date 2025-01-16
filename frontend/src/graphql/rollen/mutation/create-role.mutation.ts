import { gql } from '@apollo/client';

export const CREATE_PROCESS_ROLE = gql`
  mutation UpdateEntity($id: String!, $roles: [ProcessRoleInput]) {
    updateEntity(
      input: {
        entity: PROCESSES
        filter: { field: _id, operator: EQ, value: $id }
        processData: { roles: $roles }
      }
    ) {
      success
    }
  }
`;
