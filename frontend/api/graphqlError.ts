//'use server'

import { GraphQLError } from 'graphql';
import { getLogger } from '../utils/logger';
import { signOut } from 'next-auth/react';

export async function handleGraphQLError(
  error: any,
  message?: string,
): Promise<string> {
  const logger = getLogger(handleGraphQLError.name);

  logger.fatal(error)
  // Log the request details for debugging purposes
  logger.error('Fehler bei der Anfrage: %o', {
    Request: error.request.query,
    Variables: error.request.variables,
  });

  // Handle GraphQL errors specifically
  if (error.response && error.response.errors && error.response.errors.length > 0) {
    // Extract the error message from the first error in the response
    const errorMessage = await extractErrorMessage(error.response.errors[0]);

    // Log the data returned with the error for further debugging
    logger.error('DIE ANFRAGE: %o', error.response.data);

    // Handle specific error messages
    if (errorMessage === 'Unauthorized') {
      // Example action: alert the user about token expiration
      //alert('Dein Token ist abgelaufen');
      logger.error('Dein Token ist abgelaufen');

    }

    if (errorMessage === 'Falscher Token') {
      // Alert the user and redirect to the login page if the token is incorrect
      //alert(errorMessage);
      logger.error('Falscher Token ist abgelaufen und kann nicht erneuert werden!');
    }

    // Throw a specific error based on the extracted message
    throw new Error(errorMessage);
  }

  // If no specific GraphQL error was found, log and throw a general error
  return message ? message : 'Ein unbekannter Fehler ist aufgetreten.';

}

// Function to extract error messages from GraphQL errors
export async function extractErrorMessage(
  error: GraphQLError,  // Use native GraphQLError type from graphql package
): Promise<string> {
  const logger = getLogger(extractErrorMessage.name);

  // Log the error message and the path where it occurred
  logger.error('%o', { MESSAGE: error.message, PATH: error.path });

  // Handle specific GraphQL error codes
  if (error.extensions?.code === 'BAD_USER_INPUT') {
    let stacktrace: string[] | undefined;

    // Check if stacktrace exists and is an array
    if (Array.isArray(error.extensions.stacktrace)) {
      stacktrace = error.extensions.stacktrace as string[];
    }

    // If a stacktrace exists and the message is undefined, extract it
    if (stacktrace && stacktrace.length > 0 && error.message === undefined) {
      const firstEntry = stacktrace[0];
      const errorMessage = firstEntry
        .substring(firstEntry.indexOf(':') + 1)
        .trim();

      // Log the specific BAD_USER_INPUT error for debugging
      logger.error('Unexpected BAD_USER_INPUTs error: %o', stacktrace[0]);
      return errorMessage;
    }

    // Log the stacktrace if available and return a user-friendly message
    logger.error('Unexpected BAD_USER_INPUT error: %s', error.extensions.stacktrace);
    logger.error(error.message);
    return (
      error.message || 'Ungültige Eingabe. Bitte überprüfen Sie Ihre Daten.'
    );
  }

  // Return a generic error message for other types of errors
  return 'Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
}
