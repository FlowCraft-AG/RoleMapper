import { AuthToken } from '../lib/interfaces';
import { handleGraphQLError } from './graphqlError';
import dotenv from 'dotenv';
import { GraphQLClient } from 'graphql-request';
import { unstable_noStore as noStore } from 'next/cache';
import { AUTH, REFRESH_TOKEN } from './mutations/auth';
import { getLogger } from '../utils/logger';

dotenv.config();
const client = new GraphQLClient(
  process.env.NEXT_PUBLIC_BACKEND_CLIENT_URL ||
  'https://localhost:8080/graphql',
);

export async function getAuth(username: string, password: string) {
  noStore();
  const logger = getLogger(getAuth.name);

  try {
    const data = await client.request<{ login: AuthToken }>(AUTH, {
      username,
      password,
    });
    return data.login;
  } catch (error: any) {
    logger.error('Fehler beim Ausführen der GraphQL-Anfrage:', error);
    await handleGraphQLError(
      error,
      'Ein unbekannter Fehler beim Login ist aufgetreten.',
    );
  }
}

export async function refreshToken(token: string) {
  const logger = getLogger(refreshToken.name);
  logger.debug('Refreshing token...');

  if (!token) {
    logger.error('Kein Refresh-Token gefunden');
    alert('Kein Refresh-Token gefunden');
    throw new Error('Kein Refresh-Token gefunden');
  }

  try {
    const data = await client.request<{ refresh: AuthToken }>(REFRESH_TOKEN, {
      refreshToken: token,
    });
    if (!data || !data.refresh) {
      logger.error('Ungültige Antwortstruktur:', data);
      throw new Error('Ungültige Antwortstruktur');
    }
    const { accessToken, refreshToken, expiresIn } = data.refresh;
    logger.debug('Token refreshed successfully, new token: %s', accessToken);

    return data.refresh;
  } catch (error: any) {
    logger.error('Fehler beim Ausführen der GraphQL-Anfrage:', error);
    await handleGraphQLError(
      error,
      'Unbekannter Fehler beim Aktualisieren des Tokens',
    );
  }
}
