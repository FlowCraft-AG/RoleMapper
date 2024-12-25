import { AuthOptions } from 'next-auth';
import { type JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import KeycloakProvider, {
  KeycloakProfile,
} from 'next-auth/providers/keycloak';
import { OAuthConfig } from 'next-auth/providers/oauth';
import { LOGIN, REFRESH_TOKEN } from '../graphql/mutations/auth';
import {
  ENV,
  logEnvironmentVariables,
  validateEnvironmentVariables,
} from '../utils/env';
import { getLogger } from '../utils/logger';
import { serverClient } from './apolloClient';

const logger = getLogger('authOptions');

logEnvironmentVariables();
// validateEnvironmentVariables();

export const authOptions: AuthOptions = {
  secret: ENV.NEXTAUTH_SECRET || 'development-secret',
  providers: [
    KeycloakProvider({
      clientId: ENV.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
      clientSecret: ENV.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET as string,
      issuer: ENV.NEXT_PUBLIC_KEYCLOAK_ISSUER,
    }),
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
          const { data } = await serverClient.mutate({
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

  callbacks: {
    async jwt({ token, user, account, trigger }) {
      const nowTimeStamp = Math.floor(Date.now() / 1000);
      logger.debug('JWT: %o', token);

      if (user && account?.provider !== 'keycloak') {
        logger.trace('USER-LogIn');
        logger.debug('USER: %o', user);
        token = {
          ...token,
          access_token: user.access_token,
          id_token: user.id_token,
          provider: 'Credentials',
          expires_in: user.expires_in + nowTimeStamp,
          refresh_expires_in: user.refresh_expires_in + nowTimeStamp,
          refresh_token: user.refresh_token,
          user: {
            name: user.name,
            email: user.email,
            username: user.username,
          },
        };
      }

      if (account && account.provider && account.provider === 'keycloak') {
        logger.trace('ACCOUNT-LogIn');
        logger.debug('ACCOUNT: %s', account.access_token);

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

      // Trigger für manuelle oder automatische Aktualisierung
      if (
        trigger === 'update' || // expliziter Refresh-Trigger
        (token.expires_in && token.expires_in - nowTimeStamp < 60) // automatische Aktualisierung
      ) {
        try {
          const { data } = await serverClient.mutate({
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
    async session({ session, token }) {
      logger.debug('Session Token: %o', token);

      session.user = token.user || {
        name: token.name as string,
        email: token.email as string,
        username: token.name as string,
      };
      session.role = token.isAdmin ? 'Admin' : 'User';
      session.isAdmin = token.isAdmin;
      session.access_token = token.access_token;
      session.id_token = token.id_token;
      session.expires_in = token.expires_in || undefined;
      session.refresh_token = token.refresh_token;
      session.refresh_expires_in = token.refresh_expires_in || undefined;

      return session;
    },
    redirect({ url, baseUrl }) {
      logger.debug('Redirect URL: %s', url);
      logger.debug('Base URL: %s', baseUrl);

      return url.startsWith(baseUrl) ? url : `${baseUrl}/startseite`;
    },
  },

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
