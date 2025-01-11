// app/api/auth/error/route.ts
//'use client'

import { redirect } from 'next/navigation';

/**
 * Handler für GET-Anfragen an die Auth-Fehlerroute.
 *
 * Diese Funktion verarbeitet Fehler, die bei der Authentifizierung auftreten 
 * und leitet den Benutzer auf die Login-Seite weiter (Fehlermeldung als
 * Query-Parameter)
 *
 * @param request - Eingehendes `Request`-Objekt mit Details der HTTP-Anfrage.
 * @returns Eine Redirect-Aktion zur Login-Seite mit der entsprechenden Fehlermeldung.
 *
 * @example
 * Fehlermeldung in der URL: `/api/auth/error?error=InvalidCredentials`
 * Ergebnis: Der Benutzer wird weitergeleitet zu `/login?error=Invalid credentials provided.`
 */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const error = url.searchParams.get('error');

  /**
   * Definition von Fehlermeldungen.
   * Der Key repräsentiert den Fehlercode, der Value ist die entsprechende Fehlermeldung.
   */
  const errorMessages: { [key: string]: string } = {
    'Invalid credentials': 'Invalid username or password.',
    CredentialsSignin: 'Invalid username or password.',
    NoUser: 'No user found with the provided username.',
    InvalidCredentials: 'Invalid credentials provided.',
    default: 'An unknown error occurred.',
  };

  // Fehlermeldung ermitteln
  const errorMessage =
    errorMessages[error as string] || errorMessages['default'];

  //return NextResponse.json({ error: errorMessage });
  //return NextResponse.redirect(`/login?error=${errorMessage}}`);
  redirect(`/login?error=${errorMessage}`);
  //router.push(`/login?error=${errorMessage}`);
}
