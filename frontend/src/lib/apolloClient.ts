import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ENV } from '../utils/env';

/**
 * Die URI des GraphQL-Servers wird aus den Umgebungsvariablen geladen.
 * Wenn keine URI definiert ist, wird ein Fehler ausgelöst.
 */

const uri = ENV.NEXT_PUBLIC_BACKEND_SERVER_URL as string;

if (!uri || uri === 'N/A') {
  throw new Error(
    'GraphQL-Server-URI ist nicht definiert. Überprüfe die Umgebungsvariable "NEXT_PUBLIC_BACKEND_SERVER_URL".',
  );
}

/**
 * HTTP-Link für den Apollo Client.
 * Konfiguriert die Verbindung zum GraphQL-Server mit Fetch-Optionen.
 */
const serverHttpLink = createHttpLink({
  uri, // Die URL des GraphQL-Endpunkts
  fetchOptions: {
    mode: 'cors', // CORS-Optionen für Anfragen (z. B. wenn der Server auf einer anderen Domain läuft)
  },
});

/**
 * Apollo Client-Instanz.
 * Verwendet `InMemoryCache` für die lokale Datenverwaltung und
 * `createHttpLink` für die Verbindung zum Server.
 */
const client = new ApolloClient({
  link: serverHttpLink, // Verbindung zum GraphQL-Server
  cache: new InMemoryCache(), // Cache-Implementierung
});

export default client;
