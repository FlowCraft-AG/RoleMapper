import { gql } from 'graphql-request';

export const AUTH = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            access_token
            refresh_token
            expires_in
        }
    }
`;
