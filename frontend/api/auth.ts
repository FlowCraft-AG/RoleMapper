import { gql, GraphQLClient } from 'graphql-request';
import { unstable_noStore as noStore } from 'next/cache';
import dotenv from 'dotenv';
import { Token } from '../lib/interfaces';
import { handleGraphQLError } from './graphqlError';
import { AUTH } from './mutation/login';
import { REFRESH_TOKEN } from './mutation/refresh';

dotenv.config();
const client = new GraphQLClient(
    process.env.NEXT_PUBLIC_BACKEND_CLIENT_URL ||
        'https://localhost:3000/graphql',
);

export async function getAuth(username: string, password: string) {
    noStore();
    try {
        const data = await client.request<{ login: Token }>(AUTH, {
            username,
            password,
        });
        console.log(data);
        return data.login;
    } catch (error: any) {
        console.error('Fehler beim Ausführen der GraphQL-Anfrage:', error);
        await handleGraphQLError(
            error,
            'Ein unbekannter Fehler beim Login ist aufgetreten.',
        );
    }
}

export async function refreshToken() {
    const refresh_token = localStorage.getItem('refreshToken');
    console.log(`Refreshing token: ${refresh_token}`);

    if (!refresh_token) {
        console.error('Kein Refresh-Token gefunden');
        alert('Kein Refresh-Token gefunden');
        throw new Error('Kein Refresh-Token gefunden');
    }

    try {
        const data = await client.request<{ refresh: Token }>(REFRESH_TOKEN, {
            refresh_token,
        });
        if (!data || !data.refresh) {
            console.error('Ungültige Antwortstruktur:', data);
            throw new Error('Ungültige Antwortstruktur');
        }

        console.log(data.refresh);
        localStorage.setItem('token', data.refresh.access_token);
        localStorage.setItem('refreshToken', data.refresh.refresh_token);
        localStorage.setItem('expires_in', data.refresh.expires_in);
        localStorage.setItem(
            'token_timestamp',
            Math.floor(Date.now() / 1000).toString(),
        );

        return data.refresh;
    } catch (error: any) {
        console.error('Fehler beim Ausführen der GraphQL-Anfrage:', error);
        await handleGraphQLError(
            error,
            'Unbekannter Fehler beim Aktualisieren des Tokens',
        );
    }
}
