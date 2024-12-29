import { ApolloError } from '@apollo/client';
import { getLogger } from './logger';

// Initialisiert den Logger mit dem spezifischen Kontext 'user.api.ts'
const logger = getLogger('function.api.ts');

/**
 * Allgemeine Fehlerbehandlung für GraphQL-Operationen.
 * @param error Der aufgetretene Fehler
 * @param message Benutzerfreundliche Fehlermeldung
 * @throws ApolloError
 */
export function handleGraphQLError(error: unknown, message: string): never {
  if (error instanceof ApolloError) {
    logger.error(`${message} - GraphQL-Fehler: ${error.message}`, error);
    throw new ApolloError({ errorMessage: error.message });
  } else if (error instanceof Error) {
    logger.error(`${message} - Fehler: ${error.message}`, error);
    throw new ApolloError({ errorMessage: message });
  } else {
    logger.error(`${message} - Unbekannter Fehler`, error);
    throw new ApolloError({
      errorMessage: 'Ein unbekannter Fehler ist aufgetreten.',
    });
  }
}
