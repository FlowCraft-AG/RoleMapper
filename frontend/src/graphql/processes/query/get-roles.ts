import { gql } from '@apollo/client';

export const GET_ROLES_BY_PROCESS = gql`
  query GetRolesByProcess($id: String!) {
    getEntity(
      input: {
        entity: PROCESSES
        filter: { field: _id, operator: EQ, value: $id }
      }
    ) {
      data {
        ... on Process {
          roles {
            roleId
            roleName
          }
        }
      }
    }
  }
`;
