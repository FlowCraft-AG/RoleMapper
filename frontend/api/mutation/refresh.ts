import { gql } from 'graphql-request';

export const REFRESH_TOKEN = gql`
    mutation Refresh($refresh_token: String!) {
        refresh(refresh_token: $refresh_token) {
            access_token
            refresh_token
            expires_in
        }
    }
`;
