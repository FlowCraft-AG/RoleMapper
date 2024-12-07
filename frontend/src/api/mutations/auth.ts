import { gql } from 'graphql-request';

export const AUTH = gql`
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password) {
      accessToken
      expiresIn
      refreshToken
      refreshExpiresIn
      idToken
      scope
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation Refresh($refreshToken: String!) {
    refresh(refresh_token: $refreshToken) {
      access_token
      refresh_token
      expires_in
      refresh_expires_in
    }
  }
`;

