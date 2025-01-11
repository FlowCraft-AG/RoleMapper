/**
 * @file camunda-api.ts
 * @description Stellt Funktionen zur Interaktion mit der Camunda Platform API bereit, einschließlich des Abrufens von Prozessdefinitionen, Instanzdetails, Variablen und Aufgaben.
 *
 * @module camunda-api
 */

'use server';

import {
  GET_ALL_PROCESS_INSTANCES,
  GET_PROCESS_DEFINITION_XML_BY_PROCESS_DEFINITION_KEY,
  GET_PROCESS_INSTANCE_BY_PROCESS_INSTANCE_KEY,
} from '../../graphql/processes/query/get-process-instance.query';
import { GET_PROCESS_VARIABLE_BY_PROCESS_INSTANCE_KEY } from '../../graphql/processes/query/get-process-variable.query';
import {
  GET_ACTIVE_ELEMENT,
  GET_TASKS_BY_PROCESS_INSTANCE_KEY,
} from '../../graphql/processes/query/get-tasks.query';
import {
  ProcessInstance,
  ProcessTask,
  ProcessVariable,
} from '../../types/process.type';
import { handleGraphQLError } from '../../utils/graphqlHandler.error';
import { getLogger } from '../../utils/logger';
import client from '../apolloClient';

const logger = getLogger('camunda-api');

/**
 * Ruft das XML einer Prozessdefinition ab.
 *
 * @param {string} processDefinitionKey - Der Schlüssel der Prozessdefinition.
 * @returns {Promise<string>} Das XML der Prozessdefinition.
 */
export async function fetchProcessDefinitionXml(
  processDefinitionKey: string,
): Promise<string> {
  try {
    logger.debug('Lade alle Funktionen');
    const { data } = await client.query({
      query: GET_PROCESS_DEFINITION_XML_BY_PROCESS_DEFINITION_KEY,
    });
    return data.getProcessDefinitionXmlByKey;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Laden aller Funktionen.');
  }
}

/**
 * Ruft alle Prozessinstanzen ab.
 *
 * @param {boolean} [activeOnly=false] - Gibt an, ob nur aktive Instanzen abgerufen werden sollen.
 * @returns {Promise<ProcessInstance[]>} Die Liste der Prozessinstanzen.
 */
export async function fetchProcessInstances(
  token: string | undefined,
  activeOnly = false,
): Promise<ProcessInstance[]> {
  logger.debug('Prozessinstanzen abrufen (nur aktive: %s)', activeOnly);
  logger.trace('fetchProcessInstances: Token=%s', token);

  try {
    logger.debug('Lade alle Funktionen');
    const { data } = await client.query({
      query: GET_ALL_PROCESS_INSTANCES,
      variables: { activeOnly },
    });
    return data.getProcessDefinitionXmlByKey;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Laden aller Funktionen.');
  }
}

/**
 * Ruft Details zu einer spezifischen Prozessinstanz ab.
 *
 * @param {string} key - Der Schlüssel der Prozessinstanz.
 * @returns {Promise<ProcessInstance>} Die Details der Prozessinstanz.
 */
export async function fetchProcessInstanceDetails(
  key: string,
): Promise<ProcessInstance> {
  try {
    logger.debug('Lade alle Funktionen');
    const { data } = await client.query({
      query: GET_PROCESS_INSTANCE_BY_PROCESS_INSTANCE_KEY,
      variables: { key },
    });
    return data.getProcessDefinitionXmlByKey;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Laden aller Funktionen.');
  }
}

/**
 * Ruft die Variablen einer spezifischen Prozessinstanz ab.
 *
 * @param {string} processInstanceKey - Der Schlüssel der Prozessinstanz.
 * @returns {Promise<ProcessVariable[]>} Die Variablen der Prozessinstanz.
 */
export async function fetchVariablesByProcessInstance(
  processInstanceKey: string,
): Promise<ProcessVariable[]> {
  try {
    logger.debug('Lade alle Funktionen');
    const { data } = await client.query({
      query: GET_PROCESS_VARIABLE_BY_PROCESS_INSTANCE_KEY,
      variables: { processInstanceKey },
    });
    return data.getProcessDefinitionXmlByKey;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Laden aller Funktionen.');
  }
}

/**
 * Ruft die aktive Element-ID einer Prozessinstanz ab.
 *
 * @param {string} processInstanceKey - Der Schlüssel der Prozessinstanz.
 * @returns {Promise<string | null>} Die aktive Element-ID oder null.
 */
export async function fetchActiveElementId(
  processInstanceKey: string,
): Promise<string | null> {
  logger.debug(
    'Aktive Element-ID für Prozessinstanz abrufen: %s',
    processInstanceKey,
  );

  try {
    logger.debug('Lade alle Funktionen');
    const { data } = await client.query({
      query: GET_ACTIVE_ELEMENT,
      variables: { processInstanceKey },
    });
    return data.getTasks[0].taskDefinitionId;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Laden aller Funktionen.');
  }
}

/**
 * Ruft alle Aufgaben einer Prozessinstanz ab.
 *
 * @param {string} processInstanceKey - Der Schlüssel der Prozessinstanz.
 * @returns {Promise<ProcessTask[]>} Die Liste der Aufgaben.
 */
export async function fetchAllTasksByProcessInstance(
  processInstanceKey: string,
): Promise<ProcessTask[]> {
  try {
    logger.debug('Lade alle Funktionen');
    const { data } = await client.query({
      query: GET_TASKS_BY_PROCESS_INSTANCE_KEY,
      variables: { processInstanceKey },
    });
    return data.getTasks;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Laden aller Funktionen.');
  }
}
