import { AuthOptions } from 'next-auth';
import { type JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import KeycloakProvider, {
  KeycloakProfile,
} from 'next-auth/providers/keycloak';
import { OAuthConfig } from 'next-auth/providers/oauth';
import { LOGIN, REFRESH_TOKEN } from '../graphql/auth/auth';
import { ENV } from '../utils/env';
import { getLogger } from '../utils/logger';
import getApolloClient from './apolloClient';

const logger = getLogger('authOptions');
const client = getApolloClient(undefined);

export const authOptions: AuthOptions = {
  // Geheimnis für die Token-Generierung
  secret: ENV.NEXTAUTH_SECRET || 'development-secret',

  // Authentifizierungsanbieter
  providers: [
    /**
     * Keycloak-Provider:
     * Ermöglicht OAuth-basierte Authentifizierung über Keycloak.
     */
    KeycloakProvider({
      clientId: ENV.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
      clientSecret: ENV.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET as string,
      issuer: ENV.NEXT_PUBLIC_KEYCLOAK_ISSUER as string,
    }),
    /**
     * Credentials-Provider:
     * Ermöglicht benutzerdefinierte Anmeldung mit Benutzername und Passwort.
     *
     * (ebenfalls mit keycoak im Backend)
     */
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { username, password } = credentials || {
          username: '',
          password: '',
        };
        try {
          const { data } = await client.mutate({
            mutation: LOGIN,
            variables: { username, password },
          });

          return {
            ...data.authenticate,
            username,
          };
        } catch (error) {
          console.log('Login error:', (error as Error).message);
          throw new Error('Invalid username or password');
        }
      },
    }),
  ],

  // Callbacks für Token-Verarbeitung, Session-Management und Redirects
  callbacks: {
    /**
     * JWT-Callback:
     * Verarbeitet die JWT-Daten bei Anmeldung, Token-Erneuerung und Sitzungsverwaltung.
     */
    async jwt({ token, user, account, trigger }) {
      const nowTimeStamp = Math.floor(Date.now() / 1000);
      logger.debug('JWT: %o', token);

      if (user && account?.provider !== 'keycloak') {
        logger.trace('USER-LogIn');
        logger.trace('USER: %o', user);
        const userData = logPayload(user.access_token || '');
        token = {
          ...token,
          access_token: user.access_token,
          id_token: user.id_token,
          provider: 'Credentials',
          expires_in: user.expires_in + nowTimeStamp,
          refresh_expires_in: user.refresh_expires_in + nowTimeStamp,
          refresh_token: user.refresh_token,
          user: {
            name: userData?.name || user.name,
            email: userData?.email || user.email,
            username: userData?.preferred_username || user.username,
            roles: userData?.roles || [],
          },
        };
      }

      if (account && account.provider && account.provider === 'keycloak') {
        logger.trace('ACCOUNT-LogIn');
        logger.trace('ACCOUNT: %s', account.access_token);

        token = {
          ...token,
          access_token: account.access_token,
          id_token: account.id_token,
          provider: account.provider,
          expires_in: Number(account.expires_at),
          refresh_expires_in: Number(account.refresh_token_expires_at),
          refresh_token: account.refresh_token,
        };
      }

      // Token-Aktualisierung auslösen, wenn Ablaufzeit erreicht ist
      if (
        trigger === 'update' || // expliziter Refresh-Trigger
        (token.expires_in && token.expires_in - nowTimeStamp < 60) // automatische Aktualisierung
      ) {
        try {
          const { data } = await client.mutate({
            mutation: REFRESH_TOKEN,
            variables: { refreshToken: token.refresh_token },
          });

          const refreshToken = data.refreshToken;

          return {
            ...token,
            access_token: refreshToken.access_token,
            refresh_token: refreshToken.refresh_token,
            expires_in: nowTimeStamp + refreshToken.expires_in,
            refresh_expires_in: nowTimeStamp + refreshToken.refresh_expires_in,
          };
        } catch (error) {
          console.error('Token refresh failed:', error);
          return {
            ...token,
            error: 'RefreshAccessTokenError',
          };
        }
      }

      return token;
    },

    /**
     * Session-Callback:
     * Ergänzt die Session-Daten um Benutzer- und Token-Informationen.
     */
    async session({ session, token }) {
      logger.debug('Session Token: %o', token);

      session.user = token.user || {
        name: token.name as string,
        email: token.email as string,
        username: token.name as string,
      };
      session.role = token.isAdmin ? 'Admin' : 'User';
      session.access_token = token.access_token;
      session.id_token = token.id_token;
      session.expires_in = token.expires_in || undefined;
      session.refresh_token = token.refresh_token;
      session.refresh_expires_in = token.refresh_expires_in || undefined;

      return session;
    },
  },

  // Ereignishandler (z. B. für Abmeldung)
  events: {
    async signOut({ token }: { token: JWT }) {
      if (token.provider === 'keycloak') {
        const issuerUrl = (
          authOptions.providers.find(
            (p) => p.id === 'keycloak',
          ) as OAuthConfig<KeycloakProfile>
        ).options!.issuer!;
        const logOutUrl = new URL(
          `${issuerUrl}/protocol/openid-connect/logout`,
        );
        logOutUrl.searchParams.set('id_token_hint', token.id_token!);
        await fetch(logOutUrl.toString());
      }
    },
  },
};

/**
 * Decodiert und loggt den Payload eines JWT-Access-Tokens.
 *
 * @param {string} access_token - Der JWT-Access-Token.
 * @returns {object} Ein Objekt mit Payload-Daten wie Name, Benutzername und E-Mail.
 */
const logPayload = (
  access_token: string,
): {
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  roles?: string[];
} | null => {
  try {
    const [, payloadString] = access_token.split('.');

    if (!payloadString) {
      logger.warn('Ungültiges Access-Token-Format');
      return null;
    }

    const payloadDecoded = Buffer.from(payloadString, 'base64').toString(
      'utf-8',
    );
    const payload = JSON.parse(payloadDecoded);

    const {
      name,
      preferred_username,
      given_name,
      family_name,
      email,
      realm_access,
    } = payload;

    const roles = realm_access?.roles || [];
    logger.debug(
      'logPayload: name=%s, preferred_username=%s, given_name=%s, family_name=%s, email=%s',
      name,
      preferred_username,
      given_name,
      family_name,
      email,
    );

    logger.debug('logPayload: Rollen: %o', roles);

    return { name, preferred_username, given_name, family_name, email, roles };
  } catch (error) {
    logger.error('Fehler beim Decodieren des Access-Tokens:', error);
    return null;
  }
};
