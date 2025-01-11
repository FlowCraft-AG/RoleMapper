'use server';

import { CREATE_PROCESS } from '../../../graphql/processes/mutation/create-process';
import { DELETE_PROCESS } from '../../../graphql/processes/mutation/delete-process';
import { UPDATE_PROCESS } from '../../../graphql/processes/mutation/update-process';
import {
  GET_ALL_PROCESSES,
  GET_PROCESS_BY_ID,
  GET_PROCESSES_SHORT,
} from '../../../graphql/processes/query/get-processes.query';
import { Process, ShortProcess } from '../../../types/process.type';
import { handleGraphQLError } from '../../../utils/graphqlHandler.error';
import { getLogger } from '../../../utils/logger';
import client from '../../apolloClient';

// Initialisiert den Logger mit dem spezifischen Kontext 'processes.api.ts'
const logger = getLogger('processes.api.ts');

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

/**
 * Ruft einen Prozess anhand seiner ID ab.
 *
 * @param {string} processId - Die ID des Prozesses.
 * @returns {Promise<Process>} - Der Prozess.
 * @throws {ApolloError} - Wird geworfen, wenn die Query fehlschlägt.
 */
export async function getProcessById(processId: string): Promise<Process> {
  try {
    logger.debug('Lade Prozess mit ID: %o', processId);

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

    await client.mutate({
      mutation: CREATE_PROCESS,
      variables: { name, parentId, roles },
      refetchQueries: [{ query: GET_ALL_PROCESSES }],
      awaitRefetchQueries: true,
    });

    return await fetchAllProcesses();
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Erstellen des Prozesses.');
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
  roles: { roleName: string; roleId: string }[],
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
