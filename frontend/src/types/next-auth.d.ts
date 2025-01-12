import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  /**
   * Erweiterte Session-Typdefinition.
   * Fügt zusätzliche Felder hinzu, die in der Anwendung für erweiterte Authentifizierungs- und Autorisierungsfunktionen benötigt werden.
   */
  interface Session extends DefaultSession {
    access_token?: string; // Zugriffstoken für API-Authentifizierung
    id_token?: string; // ID-Token für die Authentifizierung (z. B. OpenID Connect)
    expires_in?: number; // Zeit in Sekunden bis zum Ablauf des Tokens
    refresh_token?: string; // Token zur Erneuerung des Zugriffstokens
    refresh_expires_in?: number; // Zeit in Sekunden bis zum Ablauf des Refresh-Tokens
    user: {
      name?: string; // Name des Benutzers
      email?: string; // E-Mail-Adresse des Benutzers
      username?: string; // Benutzername des Benutzers
      roles?: string[]; // Benutzerrollen (z. B. "Admin", "User")
    } & DefaultSession['user']; // Enthält alle Felder aus der Standard-User-Definition von `next-auth`
    role?: string; // Benutzerrolle (z. B. "Admin", "User")
  }

  /**
   * Erweiterte User-Typdefinition.
   * Enthält zusätzliche Felder, die bei der Authentifizierung zurückgegeben werden.
   */
  interface User extends DefaultUser {
    access_token: string; // Zugriffstoken für API-Authentifizierung
    id_token: string; // ID-Token (z. B. für OpenID Connect)
    refresh_token: string; // Token zur Erneuerung des Zugriffstokens
    refresh_expires_in: number; // Zeit in Sekunden bis zum Ablauf des Refresh-Tokens
    expires_in: number; // Zeit in Sekunden bis zum Ablauf des Tokens
    isAdmin: boolean; // Gibt an, ob der Benutzer Administratorrechte hat
    username: string; // Benutzername des Benutzers
  }
}

declare module 'next-auth/jwt' {
  /**
   * Erweiterte JWT-Typdefinition.
   * Definiert zusätzliche Eigenschaften, die im JWT gespeichert werden können.
   */
  interface JWT {
    access_token?: string; // Zugriffstoken für API-Authentifizierung
    id_token?: string; // ID-Token (z. B. für OpenID Connect)
    provider?: string; // Name des Authentifizierungsproviders (z. B. "Google", "GitHub")
    expires_in?: number; // Zeit in Sekunden bis zum Ablauf des Tokens
    name?: string; // Name des Benutzers
    email?: string; // E-Mail-Adresse des Benutzers
    username?: string; // Benutzername des Benutzers
    isAdmin?: boolean; // Gibt an, ob der Benutzer Administratorrechte hat
    refresh_token?: string; // Token zur Erneuerung des Zugriffstokens
    refresh_expires_in?: number; // Zeit in Sekunden bis zum Ablauf des Refresh-Tokens
  }
}
