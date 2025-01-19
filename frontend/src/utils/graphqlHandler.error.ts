import { ApolloError } from '@apollo/client';
import { getLogger } from './logger';

// Initialisiert den Logger mit dem spezifischen Kontext 'function.api.ts'
const logger = getLogger('function.api.ts');

/**
 * Allgemeine Fehlerbehandlung für GraphQL-Operationen.
 * @param error Der aufgetretene Fehler
 * @param message Benutzerfreundliche Fehlermeldung
 * @throws ApolloError
 */
export function handleGraphQLError(error: unknown, message: string): never {
  if (error instanceof ApolloError) {
    const graphqlError = error.graphQLErrors?.[0] as
      | GraphQLResponseError
      | undefined;

    const statusCode =
      graphqlError?.extensions?.status ||
      graphqlError?.extensions?.originalError?.statusCode ||
      'UNKNOWN';
    const originalMessage =
      graphqlError?.message ||
      graphqlError?.extensions?.originalError?.message ||
      error.message;

    // Loggen des Fehlers
    logger.error(
      `${message} - GraphQL-Fehler: ${originalMessage} (Status: ${statusCode})`,
    );

    // Benutzerfreundliche Rückmeldung
    throw new ApolloError({
      errorMessage: `${originalMessage} (Status: ${statusCode})`,
    });
  } else if (error instanceof Error) {
    logger.error(`${message} - Fehler: ${error.message}`);
    throw new ApolloError({ errorMessage: `${message}: ${error.message}` });
  } else {
    logger.error(`${message} - Unbekannter Fehler`);
    throw new ApolloError({
      errorMessage: 'Ein unbekannter Fehler ist aufgetreten.',
    });
  }
}

/**
 * Typ für GraphQL-Fehlerantworten
 */
interface GraphQLResponseError {
  message: string;
  locations?: {
    line: number;
    column: number;
  }[];
  path?: string[];
  extensions?: {
    code?: string;
    stacktrace?: string[];
    status?: number;
    originalError?: {
      message?: string;
      error?: string;
      statusCode?: number;
    };
  };
}

/**
 * Typ für vollständige GraphQL-Antworten
 */
// interface GraphQLResponse {
//   errors?: GraphQLResponseError[];
//   data?: unknown;
// }
