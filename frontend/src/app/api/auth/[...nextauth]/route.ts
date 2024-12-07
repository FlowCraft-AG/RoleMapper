import { GraphQLClient } from 'graphql-request';
import jwt from 'jsonwebtoken';
import NextAuth, { AuthOptions } from 'next-auth';
import { type JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import KeycloakProvider, {
  KeycloakProfile,
} from 'next-auth/providers/keycloak';
import { OAuthConfig } from 'next-auth/providers/oauth';
import { AUTH } from '../../../../api/mutations/auth';
import { getAuth, refreshToken } from '../../../../api/authorization';
import { getRefreshingStatus, setRefreshingStatus } from '../refresh-token/route';
import { getLogger } from '../../../../utils/logger';
import { handleGraphQLError } from '../../../../api/graphqlError';

const authOptionsLogger = getLogger('authOptions');
let expires = -1;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 1;
let accessToken: string | undefined;

const backendServerURL =
  process.env.NEXT_PUBLIC_BACKEND_CLIENT_URL ||
  'https://localhost:8080/graphql';
const client = new GraphQLClient(backendServerURL);

declare module 'next-auth' {
  interface Session {
    access_token?: string;
    id_token?: string;
    expires_in?: number;
    refresh_token?: string;
    refresh_expires_in?: number;
    user: {
      name?: string;
      email?: string;
      username?: string;
    };
    role?: string;
    isAdmin?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token?: string;
    id_token?: string;
    provider?: string;
    expires_in?: number;
    refresh_token?: string;
    refresh_expires_in?: number;
    user: {
      name?: string;
      email?: string;
      username?: string;
    };
    isAdmin?: boolean;
  }
}

// Erweiterung der Typen für `User`
declare module 'next-auth' {
  interface User {
    accessToken: string;
    idToken: string;
    refreshToken: string;
    refreshExpiresIn: number;
    expiresIn: number;
    isAdmin: boolean;
  }
}


export const authOptions: AuthOptions = {
  // pages: {
  //   signIn: '/auth/signin',
  // },
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID as string,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),

    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'caleb' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied

        const { username, password } = credentials
          ? credentials
          : { username: 'admin', password: 'p' };

        try {

          // const data = await getAuth(username, password)

          // if (data) {
          //   data.username = username;
          //   return data;
          // }
          const data = await client.request<{ login: any }>(AUTH, {
            username,
            password,
          });
          data.login.username = username;

          return data.login;

        } catch (error) {
          await handleGraphQLError(
            error,
            'Ein unbekannter Fehler beim Login ist aufgetreten.',
          );
          authOptionsLogger.fatal('Invalid username or password.')
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      const nowTimeStamp = Math.floor(Date.now() / 1000);
      const refreshing = getRefreshingStatus();
      authOptionsLogger.debug('TOKEN STATUS: %o', { refreshingStatus: refreshing, errors: token.error })

      if (expires > 0) {
        token.expires_in = expires;
      }

      if (
        token.error === 'RefreshAccessTokenError' ||
        token.error === 'MaxRefreshAttemptsReached'
      ) {
        return token;
      }

      if (account && account.provider === 'keycloak') {
        authOptionsLogger.trace('ACCOUNT-LogIn');
        token = {
          ...token,
          access_token: account.access_token,
          id_token: account.id_token,
          provider: account.provider,
          expires_in: Number(account.expires_at),
          refresh_expires_in: Number(account.refresh_token_expires_at),
          refresh_token: account.refresh_token,
        };
        const decodedToken = jwt.decode(account.access_token as string) as any;
        token.isAdmin =
          decodedToken.realm_access?.roles?.includes('kunde-admin');
        //return token;
      }

      if (user) {
        authOptionsLogger.trace('USER-LogIn');
        const decodedToken = decodeToken(user.idToken);
        const decodedAccessToken = jwt.decode(
          user.accessToken as string,
        ) as any;

        token.isAdmin =
          decodedAccessToken.realm_access?.roles?.includes('ADMIN');
        if (decodedToken) {
          const { name, email, preferred_username } = decodedToken;
          token = {
            ...token,
            access_token: user.accessToken,
            id_token: user.idToken,
            provider: 'Credentials',
            expires_in: Number(user.expiresIn + nowTimeStamp),
            refresh_expires_in: Number(user.refreshExpiresIn + nowTimeStamp),
            user: {
              name,
              email,
              username: preferred_username,
            },
            refresh_token: user.refreshToken,
          };
          //return token;
        }
      }

      if ((token.expires_in && token.expires_in < nowTimeStamp) || refreshing) {
        authOptionsLogger.debug('Refreshing token....')
        if (refreshAttempts > 0) {
          authOptionsLogger.debug('oder auch nicht🥲')
          refreshAttempts = 0;
          return token;
        }

        if (token.refresh_expires_in && token.refresh_expires_in < nowTimeStamp) {
          throw new Error('Refresh token expired!')
        }

        try {
          setRefreshingStatus(false)
            const refreshedToken = await refreshAccessToken(token);
          if (typeof refreshedToken.expires_in === 'number') {
            expires = refreshedToken.expires_in;
          } else if (typeof refreshedToken.expires_in === 'string') {
            expires = parseFloat(refreshedToken.expires_in);
          } else {
            // Fallback oder Standardwert für den Fall, dass `result` `undefined` ist
            expires = 0; // oder ein anderer Standardwert
          }
          authOptionsLogger.debug('Refreshed token: %s', refreshedToken.access_token);

            accessToken = refreshedToken.access_token;

          return refreshedToken;
        } catch (error) {
          return { ...token, error: 'RefreshAccessTokenError' };
        }
      } else {
        return token;
      }
    },
    async session({ session, token }) {
      const logger = getLogger('sessionCallback');
      //logger.debug('Session Token: %s', token.access_token);
      logger.debug('Session Token: %o', token);

      if (token.user) {
        session.user = {
          name: token.user.name,
          email: token.user.email,
          username: token.user.username || token.user.name,
        };
      } else {
        session.user = {
          name: token.name as string,
          email: token.email as string,
          username: token.name as string,
        };
      }
      session.role = token.isAdmin ? 'Admin' : 'User';
      session.isAdmin = token.isAdmin;
      session.access_token = accessToken? accessToken : token.access_token
      session.id_token = token.id_token;
      session.expires_in = token.expires_in
        ? token.expires_in
        : undefined;
      session.refresh_token = token.refresh_token;
      session.refresh_expires_in = token.refresh_expires_in ? token.refresh_expires_in : undefined;
      return session;
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

  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

interface DecodedToken {
  name: string;
  preferred_username: string;
  email: string;
}

function decodeToken(token: string): DecodedToken | null {
  const logger = getLogger(decodeToken.name);

  try {
    const decoded = jwt.decode(token) as DecodedToken | null;

    if (!decoded) {
      throw new Error('Invalid token');
    }

    const { name, email, preferred_username } = decoded;
    logger.trace('Decoded token username: ' + preferred_username);

    return decoded;
  } catch (error) {
    logger.error('Fehler beim Decodieren des Tokens:', (error as Error).message);
    return null;
  }
}



async function refreshAccessToken(token: JWT) : Promise<JWT>  {
    const logger = getLogger(refreshAccessToken.name);

    // Check if the token has a refresh token before proceeding
  if (!token.refresh_token) {
    logger.error('No refresh token available.');
    return { ...token, error: 'NoRefreshTokenAvailable' };
  }

  if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
    logger.error('Max refresh attempts reached.');
    refreshAttempts = 0;
    return { ...token, error: 'MaxRefreshAttemptsReached' };
  }

  try {
    ++refreshAttempts;
      const refreshedToken = await refreshToken(token.refresh_token);

      // If refreshToken returns undefined, handle it
    if (!refreshedToken) {
      throw new Error('Refreshed token is undefined.');
    }

    refreshAttempts = 0;
    logger.debug('Token is refreshed.\n');

    return {
      ...token,
      access_token: refreshedToken.accessToken,
      expires_in: (Math.floor(Date.now() / 1000) + parseInt(refreshedToken.expiresIn)),
      refresh_token: refreshedToken.refreshToken ?? token.refresh_token,
      refresh_expires_in: (Math.floor(Date.now() / 1000) + parseInt(refreshedToken.refreshExpires_in)),
    };
  } catch (error) {
    logger.error('Failed to refresh access token:', error);
    // Mark token as failed to prevent further attempts
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}



