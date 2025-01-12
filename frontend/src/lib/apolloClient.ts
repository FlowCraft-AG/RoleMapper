import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ENV } from '../utils/env';

// Globale Variable für die Apollo Client Instanz
let client: ApolloClient<NormalizedCacheObject> | null = null;

// Aktuell verwendeter Token
let currentToken: string | undefined = undefined;

/**
 * Erstellt oder gibt eine existierende Apollo Client Instanz zurück.
 * @param {string} token - Der Authentifizierungstoken.
 * @returns {ApolloClient<NormalizedCacheObject>} Die Singleton Apollo Client Instanz.
 */
const getApolloClient = (
  token: string | undefined,
): ApolloClient<NormalizedCacheObject> => {
  if (client && currentToken === token) {
    return client; // Gibt die existierende Instanz zurück, wenn der Token gleich ist
  }

  const uri = ENV.NEXT_PUBLIC_BACKEND_SERVER_URL;

  if (!uri) {
    throw new Error(
      'Die URI des GraphQL-Servers ist nicht definiert. Bitte prüfen Sie die Umgebungsvariablen.',
    );
  }

  /**
   * HTTP-Link für den Apollo Client.
   */
  const httpLink = createHttpLink({
    uri, // GraphQL-Endpunkt
  });

  /**
   * Middleware für den Authorization Header.
   * Fügt den Bearer-Token-Header hinzu.
   */
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '', // Auth-Header nur hinzufügen, wenn ein Token vorhanden ist
    },
  }));

  // Apollo Client erstellen
  client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      addTypename: false, // Verhindert die automatische Hinzufügung von "__typename"
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache', // Verhindert das Caching
      },
      query: {
        fetchPolicy: 'no-cache', // Immer direkte Abfrage
      },
    },
  });

  // Aktualisiere den aktuellen Token
  currentToken = token;

  return client;
};

export default getApolloClient;
