import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ENV } from '../utils/env';

/**
 * Die URI des GraphQL-Servers wird aus den Umgebungsvariablen geladen.
 * Wenn keine URI definiert ist, wird ein Fehler ausgelöst.
 */

const uri = ENV.NEXT_PUBLIC_BACKEND_SERVER_URL as string;

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
 * `InMemoryCache` für die lokale Datenverwaltung
 * `createHttpLink` für die Verbindung zum Server.
 */
const client = new ApolloClient({
  link: serverHttpLink, // Verbindung zum GraphQL-Server
  //cache: new InMemoryCache(), // Cache-Implementierung
  cache: new InMemoryCache({ addTypename: false }), // Minimal konfiguriert
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache', // Verhindert, dass Anfragen gecached werden
    },
    query: {
      fetchPolicy: 'no-cache',
    },
  },
});

export default client;
