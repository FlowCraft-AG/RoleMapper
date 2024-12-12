import { gql } from '@apollo/client';

export const REMOVE_FUNCTIONS = gql`
  mutation RemoveUserFromFunction($functionName: String!, $userId: String!) {
    removeUserFromFunction(functionName: $functionName, userId: $userId) {
      users
    }
  }
`;
