import { NextResponse } from 'next/server';
import { REFRESH_TOKEN } from '../../../../graphql/auth/auth';
import getApolloClient from '../../../../lib/apolloClient';

/**
 * POST-Handler für das Aktualisieren eines Authentifizierungstokens.
 *
 * Diese Funktion verarbeitet Anfragen, um ein neues Zugriffstoken mithilfe eines übergebenen 
 * Refresh-Tokens zu generieren. Sie nutzt GraphQL-Mutationen über den Apollo-Client, um das Token zu aktualisieren.
 *
 * @param req - Das eingehende `Request`-Objekt, das die HTTP-Anfrage repräsentiert.
 * Es erwartet einen JSON-Body mit einem `refreshToken`.
 *
 * @returns Eine JSON-Antwort, die das aktualisierte Token oder eine Fehlermeldung enthält.
 *
 * @throws Gibt eine Fehlermeldung zurück, wenn der `refreshToken` fehlt oder die Mutation fehlschlägt.
 *
 * @example
 * **Anfrage:**
 * ```http
 * POST /api/auth/refresh-token
 * Content-Type: application/json
 *
 * {
 *   "refreshToken": "your-refresh-token"
 * }
 * ```
 *
 * **Antwort (Erfolgreich):**
 * ```json
 * {
 *   "accessToken": "new-access-token",
 *   "expiresIn": "3600"
 * }
 * ```
 *
 * **Antwort (Fehler):**
 * ```json
 * {
 *   "message": "Missing refresh token"
 * }
 * ```
 */


export async function POST(req: Request) {
  try {
    // Den Body der Anfrage auslesen
    const client = getApolloClient(undefined);
    const body = await req.json();
    const { refreshToken } = body;
  
    // Überprüfen, ob das Refresh-Token bereitgestellt wurd
    if (!refreshToken) {
      return NextResponse.json(
        { message: 'Missing refresh token' },
        { status: 400 }, // HTTP 400 Bad Request
      );
    }

    // GraphQL-Mutation ausführen, um das Token zu aktualisieren
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables: { refreshToken },
    });

    // GraphQL-Mutation ausführen, um das Token zu aktualisieren
    return NextResponse.json(data.refreshToken);
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Fehlerantwort zurückgeben
    return NextResponse.json(
      { message: 'Failed to refresh token' },
      { status: 500 }, // HTTP 500 Internal Server Error
    );
  }
}
