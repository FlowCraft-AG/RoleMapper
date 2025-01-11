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
import getApolloClient from '../apolloClient2';

const logger = getLogger('camunda-api');

/**
 * Ruft das XML einer Prozessdefinition anhand des Schlüssels ab.
 *
 * @param processDefinitionKey - Der Schlüssel der Prozessdefinition.
 * @param token - Das Authentifizierungs-Token.
 * @returns Ein Promise mit dem XML der Prozessdefinition oder `null` bei Fehlern.
 */
export async function fetchProcessDefinitionXml(
  processDefinitionKey: string,
  token: string,
): Promise<string | null> {
  try {
    const client = getApolloClient(token);
    const { data } = await client.query({
      query: GET_PROCESS_DEFINITION_XML_BY_PROCESS_DEFINITION_KEY,
      variables: { processDefinitionKey },
    });
    return data.getProcessDefinitionXmlByKey;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Abrufen des Prozess-XML.');
  }
}

/**
 * Ruft alle Prozessinstanzen ab.
 *
 * @param token - Das Authentifizierungs-Token.
 * @param activeOnly - Wenn `true`, werden nur aktive Instanzen abgerufen.
 * @returns Ein Promise mit einer Liste von Prozessinstanzen.
 */
export async function fetchProcessInstances(
  token: string,
  activeOnly = false,
): Promise<ProcessInstance[]> {
  try {
    const client = getApolloClient(token);
    const { data } = await client.query({
      query: GET_ALL_PROCESS_INSTANCES,
      variables: { activeOnly },
    });
    return data.getCamundaProcesses || [];
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Abrufen der Prozessinstanzen.');
  }
}

/**
 * Ruft Details zu einer spezifischen Prozessinstanz ab.
 *
 * @param key - Der Schlüssel der Prozessinstanz.
 * @param token - Das Authentifizierungs-Token.
 * @returns Ein Promise mit den Details der Prozessinstanz oder `null` bei Fehlern.
 */
export async function fetchProcessInstanceDetails(
  key: string,
  token: string,
): Promise<ProcessInstance | null> {
  try {
    const client = getApolloClient(token);
    const { data } = await client.query({
      query: GET_PROCESS_INSTANCE_BY_PROCESS_INSTANCE_KEY,
      variables: { key },
    });
    return data.getCamundaProcesses?.[0] || null;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Abrufen der Prozessinstanzdetails.');
  }
}

/**
 * Ruft die Variablen einer spezifischen Prozessinstanz ab.
 *
 * @param processInstanceKey - Der Schlüssel der Prozessinstanz.
 * @param token - Das Authentifizierungs-Token.
 * @returns Ein Promise mit einer Liste von Prozessvariablen.
 */
export async function fetchVariablesByProcessInstance(
  processInstanceKey: string,
  token: string,
): Promise<ProcessVariable[]> {
  try {
    const client = getApolloClient(token);
    const { data } = await client.query({
      query: GET_PROCESS_VARIABLE_BY_PROCESS_INSTANCE_KEY,
      variables: { processInstanceKey },
    });
    return data.searchTaskVariables || [];
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Abrufen der Prozessvariablen.');
  }
}

/**
 * Ruft die aktive Element-ID einer Prozessinstanz ab.
 *
 * @param processInstanceKey - Der Schlüssel der Prozessinstanz.
 * @param token - Das Authentifizierungs-Token.
 * @returns Ein Promise mit der aktiven Element-ID oder `null` bei Fehlern.
 */
export async function fetchActiveElementId(
  processInstanceKey: string,
  token: string,
): Promise<string | null> {
  try {
    const client = getApolloClient(token);
    const { data } = await client.query({
      query: GET_ACTIVE_ELEMENT,
      variables: { processInstanceKey },
    });
    return data.getTasks?.[0]?.taskDefinitionId || null;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Abrufen des aktiven Elements.');
  }
}

/**
 * Ruft alle Aufgaben einer Prozessinstanz ab.
 *
 * @param processInstanceKey - Der Schlüssel der Prozessinstanz.
 * @param token - Das Authentifizierungs-Token.
 * @returns Ein Promise mit einer Liste von Aufgaben.
 */
export async function fetchAllTasksByProcessInstance(
  processInstanceKey: string,
  token: string,
): Promise<ProcessTask[]> {
  try {
    const client = getApolloClient(token);
    const { data } = await client.query({
      query: GET_TASKS_BY_PROCESS_INSTANCE_KEY,
      variables: { processInstanceKey },
    });
    return data.getTasks || [];
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Abrufen der Aufgaben.');
  }
}
