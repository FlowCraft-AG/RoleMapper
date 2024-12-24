// next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    access_token?: string;
    id_token?: string;
    expires_in?: number;
    refresh_token?: string;
    refresh_expires_in?: number;
    user: {
      name?: string;
      email?: string;
      username?: string;
    } & DefaultSession['user'];
    role?: string;
    isAdmin?: boolean;
  }

  interface User extends DefaultUser {
    access_token: string;
    id_token: string;
    refresh_token: string;
    refresh_expires_in: number;
    expires_in: number;
    isAdmin: boolean;
    username: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token?: string;
    id_token?: string;
    provider?: string;
    expires_in?: number;
    name?: string;
    email?: string;
    username?: string;
    isAdmin?: boolean;
    refresh_token?: string;
    refresh_expires_in?: number;
  }
}
