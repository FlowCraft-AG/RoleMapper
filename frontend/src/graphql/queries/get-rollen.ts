import { gql } from '@apollo/client';

export const GET_ROLES = gql`
  query GetProcessRoles($processId: ID!, $userId: String!) {
    getProcessRoles(processId: $processId, userId: $userId) {
      roles {
        roleName
        users {
          functionName
          user {
            userId
          }
        }
      }
    }
  }
`;
