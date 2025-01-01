import { gql } from '@apollo/client';

export const ADD_FUNCTIONS = gql`
  mutation AddUserToFunction($functionName: String!, $userId: String!) {
    addUserToFunction(functionName: $functionName, userId: $userId) {
      users
    }
  }
`;
