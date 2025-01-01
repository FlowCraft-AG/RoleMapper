'use server';

import { ADD_FUNCTIONS } from '../../graphql/functions/mutation/add-to-function';
import {
  CREATE_EXPLICITE_FUNCTIONS,
  CREATE_IMPLICITE_FUNCTIONS,
} from '../../graphql/functions/mutation/create-function';
import { DELETE_FUNCTIONS } from '../../graphql/functions/mutation/delete-function';
import { REMOVE_FUNCTIONS } from '../../graphql/functions/mutation/remove-to-function';
import { UPDATE_FUNCTIONS } from '../../graphql/functions/mutation/update-function';
import {
  FUNCTIONS_BY_ORG_UNIT,
  GET_ANCESTORS,
  GET_FUNCTION_BY_ID,
  GET_SAVED_DATA,
  HAS_SINGLE_USERS,
} from '../../graphql/functions/query/get-functions';
import { GET_ALL_ORG_UNITS } from '../../graphql/orgUnits/query/get-orgUnits';
import { GET_USERS_BY_FUNCTION } from '../../graphql/users/query/get-users';
import { FunctionString, FunctionUser } from '../../types/function.type';
import { handleGraphQLError } from '../../utils/graphqlHandler.error';
import { getLogger } from '../../utils/logger';
import client from '../apolloClient';

// Initialisiert den Logger mit dem spezifischen Kontext 'user.api.ts'
const logger = getLogger('function.api.ts');

/**
 * Prüft, ob Funktionen für eine Organisationseinheit existieren.
 * @param orgUnitId Die ID der Organisationseinheit
 * @returns {Promise<boolean>} True, wenn Funktionen existieren, sonst False
 */
export async function checkForFunctions(orgUnitId: string): Promise<boolean> {
  try {
    logger.debug('Prüfe Funktionen für Organisationseinheit: %o', orgUnitId);
    const { data } = await client.query({
      query: FUNCTIONS_BY_ORG_UNIT,
      variables: { orgUnitId },
    });
    return data.getData.data.length > 0;
  } catch (error) {
    handleGraphQLError(
      error,
      'Fehler beim Prüfen der Funktionen für die Organisationseinheit.',
    );
  }
}

/**
 * Ruft Funktionen für eine Organisationseinheit ab.
 * @param orgUnitId Die ID der Organisationseinheit
 * @returns {Promise<FunctionString[]>} Liste der Funktionen
 */
export async function fetchFunctionsByOrgUnit(
  orgUnitId: string,
): Promise<FunctionString[]> {
  try {
    logger.debug('Lade Funktionen für Organisationseinheit: %o', orgUnitId);
    const { data } = await client.query({
      query: FUNCTIONS_BY_ORG_UNIT,
      variables: { orgUnitId },
    });

    return data.getData.data || [];
  } catch (error) {
    handleGraphQLError(
      error,
      'Fehler beim Laden der Funktionen für die Organisationseinheit.',
    );
  }
}

export async function fetchFunctionById(
  functionId: string,
): Promise<FunctionString> {
  try {
    logger.debug('Lade Funktion mit der id: %o', functionId);
    const { data } = await client.query({
      query: GET_FUNCTION_BY_ID,
      variables: { functionId },
    });

    logger.debug('Funktion mit der id: %o', data.getData.data[0]);
    return data.getData.data[0] || [];
  } catch (error) {
    handleGraphQLError(
      error,
      `Fehler beim Laden der Funktion mit der id ${functionId}.`,
    );
  }
}

/**
 * Erstellt eine implizite Funktion.
 * @param params Parameter für die Funktionserstellung
 * @returns {Promise<FunctionString[]>} Liste der aktualisierten Funktionen
 */
export async function createImpliciteFunction({
  functionName,
  field,
  value,
  orgUnitId,
}: {
  functionName: string;
  field: string;
  value: string;
  orgUnitId: string;
}): Promise<FunctionString[]> {
  try {
    logger.debug('Erstelle implizite Funktion: %o', {
      functionName,
      orgUnitId,
    });
    await client.mutate({
      mutation: CREATE_IMPLICITE_FUNCTIONS,
      variables: { functionName, field, value, orgUnitId },
      refetchQueries: [
        { query: FUNCTIONS_BY_ORG_UNIT, variables: { orgUnitId } },
        { query: GET_ALL_ORG_UNITS },
      ],
      awaitRefetchQueries: true,
    });
    return await fetchFunctionsByOrgUnit(orgUnitId);
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Erstellen der impliziten Funktion.');
  }
}

/**
 * Erstellt eine explizite Funktion.
 *
 * @param params Parameter für die Funktionserstellung
 * @returns {Promise<FunctionString[]>} Liste der aktualisierten Funktionen
 */
export async function createExplicitFunction({
  functionName,
  orgUnitId,
  users,
  isSingleUser,
}: {
  functionName: string;
  orgUnitId: string;
  users: string[];
  isSingleUser: boolean;
}): Promise<FunctionString[]> {
  try {
    logger.debug('Erstelle explizite Funktion: %o', {
      functionName,
      orgUnitId,
    });
    await client.mutate({
      mutation: CREATE_EXPLICITE_FUNCTIONS,
      variables: { functionName, orgUnitId, users, isSingleUser },
      refetchQueries: [
        { query: FUNCTIONS_BY_ORG_UNIT, variables: { orgUnitId } },
      ],
      awaitRefetchQueries: true,
    });
    return await fetchFunctionsByOrgUnit(orgUnitId);
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Erstellen der expliziten Funktion.');
  }
}

/**
 * Ruft Benutzer einer Funktion ab.
 *
 * @param functionId Die ID der Funktion
 * @returns {Promise<FunctionUser>} Informationen über die Benutzer in der Funktion
 */
export async function fetchUsersByFunction(
  functionId: string,
): Promise<FunctionUser> {
  try {
    logger.debug('Lade Benutzer für Funktion: %o', functionId);
    const { data } = await client.query({
      query: GET_USERS_BY_FUNCTION,
      variables: { id: functionId },
    });

    // Klone das empfangene Objekt, um es änderbar zu machen
    const shortFunction: FunctionUser = {
      ...data.getUsersByFunction,
      _id: functionId, // Füge die `_id`-Eigenschaft hinzu
    };

    logger.debug('Benutzer für Funktion: %o', shortFunction);

    return shortFunction;
  } catch (error) {
    handleGraphQLError(
      error,
      'Fehler beim Abrufen der Benutzer für die Funktion.',
    );
  }
}

/**
 * Entfernt eine Funktion aus einer Organisationseinheit.
 *
 * @param {string} functionId - Die ID der zu entfernenden Funktion.
 * @param {string} orgUnitId - Die ID der Organisationseinheit, aus der die Funktion entfernt wird.
 * @returns {Promise<boolean>} - True, wenn die Funktion erfolgreich gelöscht wurde.
 * @throws {ApolloError} - Wird geworfen, wenn die Mutation fehlschlägt.
 */
export async function removeFunction(
  functionId: string,
  orgUnitId: string,
): Promise<boolean> {
  try {
    logger.debug('Lösche Funktion: %o', { functionId, orgUnitId });

    // Mutation zum Entfernen der Funktion
    await client.mutate({
      mutation: DELETE_FUNCTIONS,
      variables: { functionId },
      refetchQueries: [
        { query: FUNCTIONS_BY_ORG_UNIT, variables: { orgUnitId } },
      ],
      awaitRefetchQueries: true, // Wartet auf Abschluss der Refetch-Abfragen
    });

    return true;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Löschen der Funktion.');
  }
}

/**
 * Aktualisiert eine bestehende Funktion.
 *
 * @param { object } params - Parameter für die Aktualisierung der Funktion.
 * @param { string } params.functionName - Der neue Name der Funktion.
 * @param { string } params.newOrgUnitId - Die neue Organisationseinheit der Funktion.
 * @param { boolean } params.isSingleUser - Gibt an, ob die Funktion auf einen Benutzer beschränkt ist.
 * @param { string } params.oldFunctionName - Der alte Name der Funktion.
 * @param { string } params.orgUnitId - Die ID der aktuellen Organisationseinheit.
 * @returns { Promise<FunctionString[]> } - Die aktualisierte Liste der Funktionen.
 * @throws { ApolloError } - Wird geworfen, wenn die Mutation fehlschlägt.
 */
export async function updateFunction({
    functionId,
  functionName,
  newOrgUnitId,
  isSingleUser,
  oldFunctionName,
  orgUnitId,
}: {
    functionId: string;
  functionName: string;
  newOrgUnitId: string;
  isSingleUser: boolean;
  oldFunctionName: string;
  orgUnitId: string;
}): Promise<FunctionString[]> {
  try {
    logger.debug('Aktualisiere Funktion: %o', {
      oldFunctionName,
      functionName,
      orgUnitId,
    });

    // Mutation zur Aktualisierung der Funktion
    await client.mutate({
      mutation: UPDATE_FUNCTIONS,
      variables: {
        value: oldFunctionName,
        newFunctionName: functionName,
        newOrgUnit: newOrgUnitId,
        newIsSingleUser: isSingleUser,
      },
      refetchQueries: [
        { query: FUNCTIONS_BY_ORG_UNIT, variables: { orgUnitId } },
          { query: GET_ALL_ORG_UNITS },
          {
              query: GET_USERS_BY_FUNCTION,
              variables: { id: functionId },
          }
      ],
      awaitRefetchQueries: true, // Wartet auf Abschluss der Refetch-Abfragen
    });

    // Aktualisierte Funktionsliste abrufen
    return await fetchFunctionsByOrgUnit(orgUnitId);
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Aktualisieren der Funktion.');
  }
}

/**
 * Ruft die gespeicherten Daten einer Funktion ab.
 *
 * @param {string} functionId - Die ID der Funktion, deren Daten abgerufen werden sollen.
 * @returns {Promise<FunctionUser>} - Die gespeicherten Informationen der Funktion.
 * @throws {ApolloError} - Wird geworfen, wenn die Query fehlschlägt.
 */
export async function fetchSavedData(
  functionId: string,
): Promise<FunctionUser> {
  try {
    logger.debug('Lade gespeicherte Daten für Funktion: %o', functionId);

    // Query zum Abrufen der gespeicherten Daten
    const { data } = await client.query({
      query: GET_SAVED_DATA,
      variables: { id: functionId },
    });

    return data.getSavedData;
  } catch (error) {
    handleGraphQLError(
      error,
      'Fehler beim Abrufen der gespeicherten Daten der Funktion.',
    );
  }
}

/**
 * Fügt einen Benutzer zu einer Funktion hinzu.
 * Diese Funktion führt eine Mutation aus, um einen Benutzer einer Funktion zuzuordnen,
 * und aktualisiert anschließend die Daten durch Refetch der zugehörigen Queries.
 *
 * @param {string} functionName - Der Name der Funktion, zu der der Benutzer hinzugefügt wird.
 * @param {string} userId - Die ID des Benutzers, der hinzugefügt werden soll.
 * @param {string} functionId - Die ID der Funktion, die aktualisiert wird.
 * @returns {Promise<FunctionUser>} - Die aktualisierten Informationen der Funktion.
 * @throws {ApolloError} - Wird geworfen, wenn die Mutation fehlschlägt.
 */
export async function addUserToFunction(
  functionName: string,
  userId: string,
  functionId: string,
  orgUnitId: string,
): Promise<FunctionUser> {
  try {
    logger.debug('Füge Benutzer zu Funktion hinzu: %o', {
      functionName,
      userId,
      functionId,
      orgUnitId,
    });

    // Mutation zum Hinzufügen eines Benutzers zu einer Funktion
    await client.mutate({
      mutation: ADD_FUNCTIONS,
      variables: { functionName, userId },
      refetchQueries: [
        { query: FUNCTIONS_BY_ORG_UNIT, variables: { orgUnitId } },
        {
          query: GET_USERS_BY_FUNCTION,
          variables: { id: functionId },
        },
      ],
      awaitRefetchQueries: true, // Wartet, bis Refetch abgeschlossen ist
    });

    // Abrufen der aktualisierten Funktionsdaten nach der Mutation
    const updatedFunction = await fetchUsersByFunction(functionId);
    logger.debug('Aktualisierte Funktion: %o', updatedFunction.users);
    return updatedFunction;
  } catch (error) {
    handleGraphQLError(
      error,
      'Fehler beim Hinzufügen eines Benutzers zur Funktion.',
    );
  }
}

/**
 * Entfernt einen Benutzer aus einer Funktion.
 *
 * @param {string} functionName - Der Name der Funktion.
 * @param {string} userId - Die ID des Benutzers, der entfernt werden soll.
 * @param {string} functionId - Die ID der Funktion.
 * @returns {Promise<any>} - Die aktualisierten Daten nach dem Entfernen.
 * @throws {ApolloError} - Wird geworfen, wenn die Mutation fehlschlägt.
 */
export async function removeUserFromFunction(
  functionName: string,
  userId: string,
  functionId: string,
): Promise<void> {
  try {
    logger.debug('Entferne Benutzer aus Funktion: %o', {
      functionName,
      userId,
      functionId,
    });

    // Mutation zum Entfernen eines Benutzers aus der Funktion
    const { data } = await client.mutate({
      mutation: REMOVE_FUNCTIONS,
      variables: { functionName, userId },
      refetchQueries: [
        { query: GET_FUNCTION_BY_ID, variables: { functionId } },
      ],
      awaitRefetchQueries: true, // Wartet auf Abschluss der Refetch-Abfragen
    });
  } catch (error) {
    handleGraphQLError(
      error,
      'Fehler beim Entfernen des Benutzers aus der Funktion.',
    );
  }
}

/**
 * Überprüft, welche SingleUser-Funktionen keine Benutzer haben.
 * @returns Promise<{ id: string; functionName: string }[]> - Liste der Funktionen ohne Benutzer mit Name und ID.
 */
export async function getFunctionsWithoutUsers(): Promise<
  { id: string; functionName: string, orgUnit: string }[]
> {
  try {
    logger.debug('Prüfe, welche SingleUser-Funktionen keine Benutzer haben');

    // GraphQL-Abfrage
    const { data } = await client.query({
      query: HAS_SINGLE_USERS,
    });

    // Validierung der API-Antwort
    const functions = data?.getData?.data;
    if (!Array.isArray(functions)) {
      throw new Error('Unerwartetes Datenformat von der API');
    }

    // Filtern der Funktionen ohne Benutzer
    const noUserFunctions = functions
      .filter(
        (func: { isSingleUser: boolean; users: any[] }) =>
          func.isSingleUser && func.users.length === 0,
      )
      .map((func: FunctionString) => ({
        id: func._id,
          functionName: func.functionName,
        orgUnit: func.orgUnit,
      }));

    // Logging, wenn keine Benutzer vorhanden sind
    if (noUserFunctions.length > 0) {
      logger.warn(
        `Folgende SingleUser-Funktionen haben keine Benutzer: ${noUserFunctions
          .map((func) => func.functionName)
          .join(', ')}`,
      );
    } else {
      logger.info('Alle SingleUser-Funktionen haben Benutzer.');
    }

      logger.debug('Funktionen ohne Benutzer: %o', noUserFunctions);
    return noUserFunctions; // Liste der Funktionen ohne Benutzer (Name und ID)
  } catch (error) {
    handleGraphQLError(
      error,
      'Fehler beim Prüfen, welche SingleUser-Funktionen keine Benutzer haben.',
    );
  }
}

// Funktion zum Abrufen der Ancestors
export async function fetchAncestors(nodeId: string) {
    try {
        const { data } = await client.query({
            query: GET_ANCESTORS,
            variables: { id: nodeId },
        });

        return data.getAncestors;
    } catch (error) {
        console.error('Fehler beim Abrufen der Ancestors:', error);
        throw error;
    }
}
