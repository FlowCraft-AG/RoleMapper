'use server';

import { ApolloError } from '@apollo/client';
import { ADD_FUNCTIONS } from '../../graphql/mutations/add-to-function';
import {
  CREATE_EXPLICITE_FUNCTIONS,
  CREATE_IMPLICITE_FUNCTIONS,
} from '../../graphql/mutations/create-function';
import { CREATE_ORG_UNIT } from '../../graphql/mutations/create-org-unit';
import { DELETE_FUNCTIONS } from '../../graphql/mutations/delete-function';
import { DELETE_ORG_UNIT } from '../../graphql/mutations/delete-org-unit';
import { UPDATE_ORG_UNIT } from '../../graphql/mutations/org-unit.mutation';
import { REMOVE_FUNCTIONS } from '../../graphql/mutations/remove-to-function';
import { UPDATE_FUNCTIONS } from '../../graphql/mutations/update-function';
import {
  FUNCTIONS_BY_ORG_UNIT,
  GET_SAVED_DATA,
  USERS_BY_FUNCTION,
} from '../../graphql/queries/get-functions';
import { ORG_UNITS, ORG_UNITS_IDS } from '../../graphql/queries/get-orgUnits';
import {
  GET_EMPLOYEES,
  MITGLIEDER,
  USER_DETAILS,
  USER_IDS,
} from '../../graphql/queries/get-users';
import client from '../../lib/apolloClient';
import { Function } from '../../types/function.type';
import { OrgUnit, OrgUnitInfo } from '../../types/orgUnit.type';
import { User } from '../../types/user.type';
import { getLogger } from '../../utils/logger';

const logger = getLogger('fetchkp.tsx');
// Serverseitige Datenabfrage
export async function fetchMitgliederIds(
  alias: string | null,
  kostenstelleNr: string | null,
) {
  try {
    const { data } = await client.query({
      query: MITGLIEDER,
      variables: { alias, kostenstelleNr },
    });
    return data.getData.data.map((user: { userId: string }) => user.userId);
  } catch (error) {
    console.error('Error fetching Mitglieder:', error);
    return [];
  }
}

export async function fetchOrgUnits(): Promise<OrgUnit[]> {
  try {
    const { data } = await client.query({
      query: ORG_UNITS,
    });

    // Rückgabe der Organisationseinheiten als Array
    return data.getData.data;
  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error);
    return [];
  }
}

// Funktion zum Abrufen der Benutzer
export async function fetchEmployees() {
  try {
    const { data } = await client.query({
      query: GET_EMPLOYEES,
    });
    return data.getData.data; // Rückgabe der Benutzerliste
  } catch (error) {
    console.error('Fehler beim Laden der Benutzer:', error);
    throw new ApolloError({ errorMessage: 'Fehler beim Laden der Benutzer' });
  }
}

// Funktion zum Erstellen der Organisationseinheit
export async function createOrgUnit(
  name: string,
  supervisor: string | null,
  parentId: string,
): Promise<OrgUnit[]> {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_ORG_UNIT,
      variables: { name, supervisor, parentId },
      refetchQueries: [{ query: ORG_UNITS }], // Refetch die ORG_UNITS-Abfrage, um die neuesten Daten zu holen
      awaitRefetchQueries: true, // Wartet darauf, dass die Refetch-Abfragen abgeschlossen sind
    });
    // Nach der Erstellung führen wir den Refetch durch, um die neuesten Daten zu holen
    const updatedOrgUnits = await fetchOrgUnits();
    logger.debug('neue liste %o', updatedOrgUnits);
    //     return updatedOrgUnits; // Gibt die neueste Liste zurück
    return updatedOrgUnits; // Rückgabe der neuen Organisationseinheit
  } catch (error) {
    console.error('Fehler beim Erstellen der Organisationseinheit:', error);
    throw new ApolloError({
      errorMessage: 'Fehler beim Erstellen der Organisationseinheit',
    });
  }
}

export async function updateOrgUnit(
  orgUnitId: string,
  name: string,
  supervisor: string | null,
): Promise<OrgUnit[]> {
  try {
    // Mutation zum Bearbeiten der Organisationseinheit
    const { data } = await client.mutate({
      mutation: UPDATE_ORG_UNIT,
      variables: { id: orgUnitId, name, supervisor },
      refetchQueries: [{ query: ORG_UNITS }], // Refetch die ORG_UNITS-Abfrage, um die neuesten Daten zu holen
      awaitRefetchQueries: true, // Wartet darauf, dass die Refetch-Abfragen abgeschlossen sind
    });

    // Nach der Bearbeitung führen wir den Refetch durch, um die neuesten Daten zu holen
    const updatedOrgUnits = await fetchOrgUnits();
    return updatedOrgUnits; // Gibt die neuesten Organisationseinheiten zurück
  } catch (error) {
    console.error('Fehler beim Bearbeiten der Organisationseinheit:', error);
    throw new ApolloError({
      errorMessage: 'Fehler beim Bearbeiten der Organisationseinheit',
    });
  }
}

export async function removeOrgUnit(orgUnitId: string): Promise<OrgUnit[]> {
  try {
    // Mutation zum Löschen der Organisationseinheit
    await client.mutate({
      mutation: DELETE_ORG_UNIT,
      variables: { value: orgUnitId },
      refetchQueries: [{ query: ORG_UNITS }], // Refetch die ORG_UNITS-Abfrage, um die neuesten Daten zu holen
      awaitRefetchQueries: true, // Wartet darauf, dass die Refetch-Abfragen abgeschlossen sind
    });

    // Nach dem Löschen führen wir den Refetch durch, um die neuesten Daten zu holen
    const updatedOrgUnits = await fetchOrgUnits();
    return updatedOrgUnits; // Gibt die neuesten Organisationseinheiten zurück
  } catch (error) {
    console.error('Fehler beim Löschen der Organisationseinheit:', error);
    throw new ApolloError({
      errorMessage: 'Fehler beim Bearbeiten der Organisationseinheit',
    });
  }
}

export async function fetchFunctionsByOrgUnit(
  orgUnitId: string,
): Promise<Function[]> {
  try {
    logger.debug('orgUnitId %o', orgUnitId);
    const { data } = await client.query({
      query: FUNCTIONS_BY_ORG_UNIT,
      variables: { orgUnitId },
    });

    logger.debug('data %o', data);
    return data.getData.data || [];
  } catch (error) {
    console.error('Fehler beim Laden der Funktionen:', error);
    return [];
  }
}

// Funktion zum Erstellen der impliziten Funktionen
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
}): Promise<Function[]> {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_IMPLICITE_FUNCTIONS,
      variables: { functionName, field, value, orgUnitId },
      refetchQueries: [{ query: ORG_UNITS }], // Refetch die ORG_UNITS-Abfrage, um die neuesten Daten zu holen
      awaitRefetchQueries: true, // Wartet darauf, dass die Refetch-Abfragen abgeschlossen sind
    });
    // Nach der Erstellung führen wir den Refetch durch, um die neuesten Daten zu holen
    const updatedFunctionList = await fetchFunctionsByOrgUnit(orgUnitId);
    return updatedFunctionList; // Rückgabe der neuen Funktion
  } catch (error) {
    console.error('Fehler beim Erstellen der Funktion:', error);
    throw new ApolloError({
      errorMessage: (error as any).message,
    });
  }
}

// Funktion zum Löschen einer Funktion
export async function removeFunction(functionId: string): Promise<boolean> {
  try {
    await client.mutate({
      mutation: DELETE_FUNCTIONS,
      variables: { functionId },
      refetchQueries: [{ query: ORG_UNITS }], // Refetch die ORG_UNITS-Abfrage, um die neuesten Daten zu holen
      awaitRefetchQueries: true, // Wartet darauf, dass die Refetch-Abfragen abgeschlossen sind
    });
    return true;
  } catch (error) {
    console.error('Fehler beim Löschen der Funktion:', error);
    return false;
  }
}

// Funktion zum Erstellen einer expliziten Funktion
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
}): Promise<Function[]> {
  try {
    // Mutation zum Erstellen einer Funktion
    const { data } = await client.mutate({
      mutation: CREATE_EXPLICITE_FUNCTIONS,
      variables: {
        functionName,
        orgUnitId,
        users,
        isSingleUser,
      },
      refetchQueries: [{ query: ORG_UNITS }], // Refetch die ORG_UNITS-Abfrage, um die neuesten Daten zu holen
      awaitRefetchQueries: true, // Wartet darauf, dass die Refetch-Abfragen abgeschlossen sind
    });

    // Refetch der Funktionen für die Organisationseinheit nach der Erstellung
    const updatedFunctionList = await fetchFunctionsByOrgUnit(orgUnitId);
    return updatedFunctionList;
  } catch (error) {
    console.error('Fehler beim Erstellen der expliziten Funktion:', error);
    throw new ApolloError({
      errorMessage: (error as any).message,
    });
  }
}

// Funktion zum Abrufen der Benutzer
export async function Members(): Promise<string[]> {
  try {
    const { data } = await client.query({
      query: GET_EMPLOYEES,
    });
    return data.getData.data.map((user: { userId: string }) => user.userId); // Benutzer-IDs extrahieren
  } catch (error) {
    console.error('Fehler beim Laden der Benutzer-IDs:', error);
    throw new ApolloError({
      errorMessage: 'Fehler beim Laden der Benutzer-IDs',
    });
  }
}

// Function to update an existing function
export async function updateFunction({
  functionName,
  orgUnitId,
  isSingleUser,
  oldFunctionName,
}: {
  functionName: string;
  orgUnitId: string;
  isSingleUser: boolean;
  oldFunctionName: string;
}): Promise<Function[]> {
  try {
    logger.debug('functionName %o', functionName);
    logger.debug('orgUnitId %o', orgUnitId);
    logger.debug('isSingleUser %o', isSingleUser);
    logger.debug('oldFunctionName %o', oldFunctionName);
    // Perform mutation to update the function
    const { data } = await client.mutate({
      mutation: UPDATE_FUNCTIONS,
      variables: {
        value: oldFunctionName,
        newFunctionName: functionName,
        newOrgUnit: orgUnitId,
        newIsSingleUser: isSingleUser,
      },
      refetchQueries: [{ query: ORG_UNITS }], // Refetch die ORG_UNITS-Abfrage, um die neuesten Daten zu holen
      awaitRefetchQueries: true, // Wartet darauf, dass die Refetch-Abfragen abgeschlossen sind
    });

    // Refetch functions for the organization unit
    const updatedFunctionList = await fetchFunctionsByOrgUnit(orgUnitId);

    return updatedFunctionList; // Return the updated list of functions
  } catch (error) {
    console.error('Error updating function:', error);
    throw new ApolloError({
      errorMessage: 'Fehler beim Aktualisieren der Funktion.',
    });
  }
}

export async function fetchOrgUnitsIds(): Promise<OrgUnitInfo[]> {
  try {
    const { data } = await client.query({
      query: ORG_UNITS_IDS,
    });
    return data.getData.data; // Return the array of OrgUnit objects
  } catch (error) {
    console.error('Error fetching orgUnits:', error);
    return []; // Return an empty array if there's an error
  }
}

export async function fetchSavedData(functionId: string) {
  try {
    const { data } = await client.query({
      query: GET_SAVED_DATA,
      variables: { id: functionId },
    });

    return data.getSavedData;
  } catch (error) {
    console.error('Fehler beim Abrufen der gespeicherten Daten:', error);
    throw new ApolloError({
      errorMessage: 'Fehler beim Abrufen der gespeicherten Daten.',
    });
  }
}

export async function fetchUsersByFunction(functionId: string) {
  try {
    const { data } = await client.query({
      query: USERS_BY_FUNCTION,
      variables: { functionId },
    });

    // Die Funktion wird aus den Daten extrahiert
    return data.getData?.data?.[0];
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer für die Funktion:', error);
    throw new ApolloError({
      errorMessage: 'Fehler beim Abrufen der Benutzer für die Funktion.',
    });
  }
}

export async function removeUserFromFunction(
  functionName: string,
  userId: string,
) {
  try {
    const { data } = await client.mutate({
      mutation: REMOVE_FUNCTIONS,
      variables: {
        functionName,
        userId,
      },
      refetchQueries: [{ query: ORG_UNITS }], // Refetch die ORG_UNITS-Abfrage, um die neuesten Daten zu holen
      awaitRefetchQueries: true, // Wartet darauf, dass die Refetch-Abfragen abgeschlossen sind
    });

    return data;
  } catch (error) {
    console.error(
      'Fehler beim Entfernen des Benutzers aus der Funktion:',
      error,
    );
    throw new ApolloError({
      errorMessage: 'Fehler beim Entfernen des Benutzers aus der Funktion.',
    });
  }
}

export async function fetchUserIds(): Promise<string[]> {
  try {
    const response = await client.query({
      query: USER_IDS,
    });
    return response.data.getData.data.map(
      (user: { userId: string }) => user.userId,
    );
  } catch (error) {
    console.error('Fehler beim Laden der Benutzer-IDs:', error);
    throw new Error('Fehler beim Laden der Benutzer-IDs');
  }
}

export async function addUserToFunction(functionName: string, userId: string) {
  try {
    await client.mutate({
      mutation: ADD_FUNCTIONS,
      variables: { functionName, userId },
      refetchQueries: [{ query: ORG_UNITS }], // Refetch die ORG_UNITS-Abfrage, um die neuesten Daten zu holen
      awaitRefetchQueries: true, // Wartet darauf, dass die Refetch-Abfragen abgeschlossen sind
    });
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Benutzers:', error);
    throw new Error('Fehler beim Hinzufügen des Benutzers');
  }
}

export async function fetchUserDetails(userId: string): Promise<User> {
  try {
    const { data } = await client.query({
      query: USER_DETAILS,
      variables: { userId },
    });
    return data.getData.data[0]; // Annahme: Die Datenstruktur enthält die Details im ersten Eintrag
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzerdetails:', error);
    throw new Error('Fehler beim Abrufen der Benutzerdetails');
  }
}
