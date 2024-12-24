import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Token($username: String!, $password: String!) {
    authenticate(username: $username, password: $password) {
      access_token
      expires_in
      refresh_token
      refresh_expires_in
      id_token
      scope
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation Token($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      access_token
      expires_in
      refresh_token
      refresh_expires_in
      id_token
      scope
    }
  }
`;
