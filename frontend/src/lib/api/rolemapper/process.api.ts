'use server';

import {
  CREATE_PROCESS,
  CREATE_PROCESS_COLLECTION,
} from '../../../graphql/processes/mutation/create-process';
import { DELETE_PROCESS } from '../../../graphql/processes/mutation/delete-process';
import {
  UPDATE_PROCESS,
  UPDATE_PROCESS_COLLECTION,
  UPDATE_PROCESS_ROLES,
} from '../../../graphql/processes/mutation/update-process';
import {
  GET_ALL_PROCESSES,
  GET_PROCESS_BY_ID,
  GET_PROCESS_COLLECTIONS,
  GET_PROCESSES_SHORT,
} from '../../../graphql/processes/query/get-processes.query';
import { GET_ROLES_BY_PROCESS } from '../../../graphql/processes/query/get-roles';
import { Process, ShortProcess } from '../../../types/process.type';
import { handleGraphQLError } from '../../../utils/graphqlHandler.error';
import { getLogger } from '../../../utils/logger';
import getApolloClient from '../../apolloClient';

// Initialisiert den Logger mit dem spezifischen Kontext 'processes.api.ts'
const logger = getLogger('processes.api.ts');
const client = getApolloClient(undefined);

/**
 * Ruft alle Prozesse ab.
 * Diese Funktion führt eine Query aus, um eine Liste aller Prozesse aus dem Backend zu laden.
 *
 * @returns {Promise<Process[]>} - Eine Liste von Prozessen.
 * @throws {ApolloError} - Wird geworfen, wenn die Query fehlschlägt.
 */
export async function fetchAllProcesses(): Promise<Process[]> {
  try {
    logger.debug('Lade alle Prozesse');

    const { data } = await client.query({
      query: GET_ALL_PROCESSES,
    });

    return data.getData.data || [];
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Laden der Prozesse.');
  }
}

export async function fetchAllProcessCollections() {
  logger.debug('Lade alle Prozesse Sammlungen');
  try {
    const { data } = await client.query({
      query: GET_PROCESS_COLLECTIONS,
    });

    return data.getProcessCollectionList || [];
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Laden der Prozesse.');
  }
}

/**
 * Ruft einen Prozess anhand seiner ID ab.
 *
 * @param {string} processId - Die ID des Prozesses.
 * @returns {Promise<Process>} - Der Prozess.
 * @throws {ApolloError} - Wird geworfen, wenn die Query fehlschlägt.
 */
export async function getProcessById(processId: string): Promise<Process> {
  try {
    logger.debug('getProcessById: processIs=%s', processId);

    const { data } = await client.query({
      query: GET_PROCESS_BY_ID,
      variables: { id: processId },
    });

    return data.getData.data[0];
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Laden des Prozesses.');
  }
}

/**
 * Erstellt einen neuen Prozess.
 *
 * @param {string} name - Der Name des Prozesses.
 * @param {string | undefined} parentId - Die ID des übergeordneten Prozesses.
 * @param {object[]} roles - Die Rollen des Prozesses.
 * @returns {Promise<Process[]>} - Die aktualisierte Liste der Prozesse.
 * @throws {ApolloError} - Wird geworfen, wenn die Mutation fehlschlägt.
 */
export async function createProcess(
  name: string,
  parentId: string | undefined,
  roles: { roleName: string; roleId: string }[],
): Promise<Process[]> {
  try {
    logger.debug('Erstelle neuen Prozess: %o', { name, parentId, roles });

    if (roles.length === 0) {
      // Ohne Rollen
      await client.mutate({
        mutation: CREATE_PROCESS,
        variables: { name, parentId },
        refetchQueries: [{ query: GET_ALL_PROCESSES }],
        awaitRefetchQueries: true,
      });
    } else {
      // Mit Rollen
      await client.mutate({
        mutation: CREATE_PROCESS,
        variables: { name, parentId, roles },
        refetchQueries: [{ query: GET_ALL_PROCESSES }],
        awaitRefetchQueries: true,
      });
    }

    return await fetchAllProcesses();
  } catch (error) {
    handleGraphQLError(
      error,
      `Fehler beim Erstellen des neuen Prozesses: ${name}`,
    );
  }
}

/**
 * Aktualisiert einen bestehenden Prozess.
 *
 * @param {string} processId - Die ID des Prozesses.
 * @param {string} name - Der neue Name des Prozesses.
 * @param {string | undefined} parentId - Die neue übergeordnete Prozess-ID.
 * @param {object[]} roles - Die neuen Rollen des Prozesses.
 * @returns {Promise<Process[]>} - Die aktualisierte Liste der Prozesse.
 * @throws {ApolloError} - Wird geworfen, wenn die Mutation fehlschlägt.
 */
export async function updateProcess(
  processId: string,
  name: string,
  parentId: string | undefined,
  roles: { roleName: string; roleId: string }[] | undefined,
): Promise<Process[]> {
  try {
    logger.debug('Aktualisiere Prozess: %o', {
      processId,
      name,
      parentId,
      roles,
    });

    await client.mutate({
      mutation: UPDATE_PROCESS,
      variables: { id: processId, name, parentId, roles },
      refetchQueries: [{ query: GET_ALL_PROCESSES }],
      awaitRefetchQueries: true,
    });

    return await fetchAllProcesses();
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Aktualisieren des Prozesses.');
  }
}

export async function deleteProcess(processId: string): Promise<Process[]> {
  try {
    logger.debug('deleteProcess: id=%s', {
      processId,
    });

    await client.mutate({
      mutation: DELETE_PROCESS,
      variables: { id: processId },
      refetchQueries: [{ query: GET_ALL_PROCESSES }],
      awaitRefetchQueries: true,
    });

    return await fetchAllProcesses();
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Aktualisieren des Prozesses.');
  }
}

/**
 * Holt die bestehenden Rollen eines Prozesses.
 *
 * @param {string} processId - Die ID des Prozesses.
 * @returns {Promise<{ roleName: string; roleId: string }[]>} - Die Rollen des Prozesses.
 */
async function fetchRolesByProcess(
  processId: string,
): Promise<{ roleName: string; roleId: string }[]> {
  try {
    const { data } = await client.query({
      query: GET_ROLES_BY_PROCESS,
      variables: { id: processId },
    });
    return data?.roles || [];
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Abrufen der Rollen des Prozesses.');
    return [];
  }
}

/**
 * Fügt neue Rollen zu einem bestehenden Prozess hinzu, ohne die bestehenden Rollen zu überschreiben.
 *
 * @param {string} processId - Die ID des Prozesses.
 * @param {object[]} newRoles - Die neuen Rollen, die hinzugefügt werden sollen.
 * @returns {Promise<Process[]>} - Die aktualisierte Liste der Prozesse.
 * @throws {ApolloError} - Wird geworfen, wenn die Mutation fehlschlägt.
 */
export async function addRolesToProcess(
  processId: string,
  newRoles: { roleName: string; roleId: string }[],
): Promise<Process[]> {
  try {
    // Bestehende Rollen des Prozesses abrufen
    const existingRoles = await fetchRolesByProcess(processId);

    // Nur neue Rollen hinzufügen, die noch nicht existieren
    const combinedRoles = [
      ...existingRoles,
      ...newRoles.filter(
        (newRole) =>
          !existingRoles.some(
            (existingRole) => existingRole.roleId === newRole.roleId,
          ),
      ),
    ];

    logger.debug('Füge Rollen zum Prozess hinzu: %o', {
      processId,
      combinedRoles,
    });

    // Mutation ausführen, um die kombinierten Rollen zu speichern
    await client.mutate({
      mutation: UPDATE_PROCESS_ROLES,
      variables: { id: processId, roles: combinedRoles },
      refetchQueries: [{ query: GET_ALL_PROCESSES }],
      awaitRefetchQueries: true,
    });

    return await fetchAllProcesses(); // Aktualisierte Prozesse abrufen
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Hinzufügen der Rollen zum Prozess.');
  }
}

/**
 * Löscht einen Prozess.
 *
 * @param {string} processId - Die ID des Prozesses, der gelöscht werden soll.
 * @returns {Promise<Process[]>} - Die aktualisierte Liste der Prozesse.
 * @throws {ApolloError} - Wird geworfen, wenn die Mutation fehlschlägt.
 */
export async function removeProcess(processId: string): Promise<Process[]> {
  try {
    logger.debug('Lösche Prozess mit ID: %o', processId);

    await client.mutate({
      mutation: DELETE_PROCESS,
      variables: { id: processId },
      refetchQueries: [{ query: GET_ALL_PROCESSES }],
      awaitRefetchQueries: true,
    });

    return await fetchAllProcesses();
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Löschen des Prozesses.');
  }
}

/**
 * Ruft die IDs aller Prozesse ab.
 *
 * @returns {Promise<ShortProcess[]>} - Eine Liste von IDs und Namen der Prozesse.
 * @throws {ApolloError} - Wird geworfen, wenn die Query fehlschlägt.
 */
export async function fetchProcessIds(): Promise<ShortProcess[]> {
  try {
    logger.debug('Lade IDs aller Prozesse');

    const { data } = await client.query({
      query: GET_PROCESSES_SHORT,
    });

    return data.getData.data;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Laden der Prozess-IDs.');
  }
}

export async function createProcessCollection(
  name: string,
  parentId: string | undefined,
): Promise<string> {
  try {
    logger.debug(
      'createProcessCollection: name=%s, parentId=%s',
      name,
      parentId,
    );

    const { data } = await client.query({
      query: CREATE_PROCESS_COLLECTION,
      variables: { name, parentId },
    });

    return data.createEntity.result._id;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Laden der Prozess-IDs.');
  }
}

export async function updateProcessCollection(
  id: string,
  name: string,
  parentId: string | undefined,
): Promise<Process[]> {
  try {
    logger.debug(
      'createProcessCollection: name=%s, parentId=%s',
      name,
      parentId,
    );

    const { data } = await client.query({
      query: UPDATE_PROCESS_COLLECTION,
      variables: { id, name, parentId },
    });

    logger.debug('Prozess-Sammlung erfolgreich aktualisiert:', data);
    return fetchAllProcesses();
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Laden der Prozess-IDs.');
  }
}
