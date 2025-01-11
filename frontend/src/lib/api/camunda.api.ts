/**
 * @file camunda-api.ts
 * @description Enthält Funktionen zur Interaktion mit der Camunda Platform API, einschließlich des Abrufs von Prozessdefinitionen, Instanzdetails, Variablen und Aufgaben.
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
  GET_INCIDENT_FLOW_NODE,
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
 * Ruft das XML einer Prozessdefinition von der Camunda API ab.
 *
 * @param processDefinitionKey - Der eindeutige Schlüssel der Prozessdefinition.
 * @param token - Das Authentifizierungs-Token für die API.
 * @returns Das XML der Prozessdefinition als `string` oder `undefined`, wenn ein Fehler auftritt.
 */
export async function getProcessDefinitionXml(
  processDefinitionKey: string,
  token: string,
): Promise<string | undefined> {
  logger.debug(
    'getProcessDefinitionXml: key=%s, token=%s',
    processDefinitionKey,
    token,
  );

  try {
    const client = getApolloClient(token);
    const { data } = await client.query({
      query: GET_PROCESS_DEFINITION_XML_BY_PROCESS_DEFINITION_KEY,
      variables: { processDefinitionKey },
    });

    logger.debug(
      'getProcessDefinitionXml: xml=%o',
      data.getProcessDefinitionXmlByKey,
    );
    return data.getProcessDefinitionXmlByKey;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Abrufen des Prozess-XML.');
  }
}

/**
 * Ruft eine Liste aller Prozessinstanzen von der Camunda API ab.
 *
 * @param token - Das Authentifizierungs-Token für die API.
 * @param activeOnly - Gibt an, ob nur aktive Instanzen zurückgegeben werden sollen (Standard: `false`).
 * @returns Eine Liste von Prozessinstanzen oder eine leere Liste bei Fehlern.
 */
export async function getAllProcessInstances(
  token: string,
  activeOnly = false,
): Promise<ProcessInstance[]> {
  logger.debug('getAllProcessInstances: token=%s', token);

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
 * Ruft Details zu einer spezifischen Prozessinstanz von der Camunda API ab.
 *
 * @param instanceKey - Der eindeutige Schlüssel der Prozessinstanz.
 * @param token - Das Authentifizierungs-Token für die API.
 * @returns Die Details der Prozessinstanz als Objekt oder `undefined`, wenn ein Fehler auftritt.
 */
export async function getProcessInstanceDetails(
  instanceKey: string,
  token: string,
): Promise<ProcessInstance> {
  logger.debug(
    'getProcessInstanceDetails: key=%s, token=%s',
    instanceKey,
    token,
  );
  try {
    const client = getApolloClient(token);
    const { data } = await client.query({
      query: GET_PROCESS_INSTANCE_BY_PROCESS_INSTANCE_KEY,
      variables: { key: instanceKey },
    });

    logger.debug('getProcessInstanceDetails: data=%o', data);
    return data.getCamundaProcesses?.[0];
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Abrufen der Prozessinstanzdetails.');
  }
}

/**
 * Ruft die Variablen einer spezifischen Prozessinstanz von der Camunda API ab.
 *
 * @param instanceKey - Der eindeutige Schlüssel der Prozessinstanz.
 * @param token - Das Authentifizierungs-Token für die API.
 * @returns Eine Liste von Variablen der Prozessinstanz oder eine leere Liste bei Fehlern.
 */
export async function getProcessInstanceVariables(
  instanceKey: string,
  token: string,
): Promise<ProcessVariable[]> {
  try {
    const client = getApolloClient(token);
    const { data } = await client.query({
      query: GET_PROCESS_VARIABLE_BY_PROCESS_INSTANCE_KEY,
      variables: { processInstanceKey: instanceKey },
    });
    return data.searchTaskVariables || [];
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Abrufen der Prozessvariablen.');
    return [];
  }
}

/**
 * Ruft die aktive Element-ID einer Prozessinstanz von der Camunda API ab.
 *
 * @param instanceKey - Der eindeutige Schlüssel der Prozessinstanz.
 * @param token - Das Authentifizierungs-Token für die API.
 * @returns Die aktive Element-ID als `string` oder `undefined`, wenn ein Fehler auftritt.
 */
export async function getActiveElementId(
  instanceKey: string,
  token: string,
): Promise<string | undefined> {
  logger.debug('getActiveElementId: key=%s, token=%s', instanceKey, token);

  try {
    const client = getApolloClient(token);
    const { data } = await client.query({
      query: GET_ACTIVE_ELEMENT,
      variables: { processInstanceKey: instanceKey },
    });
    logger.debug('getActiveElementId: data=%o', data.getTasks);
    return data.getTasks?.[0]?.taskDefinitionId || undefined;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Abrufen des aktiven Elements.');
    return undefined;
  }
}

/**
 * Ruft alle Aufgaben einer spezifischen Prozessinstanz von der Camunda API ab.
 *
 * @param instanceKey - Der eindeutige Schlüssel der Prozessinstanz.
 * @param token - Das Authentifizierungs-Token für die API.
 * @returns Eine Liste von Aufgaben der Prozessinstanz oder eine leere Liste bei Fehlern.
 */
export async function getTasksByProcessInstance(
  instanceKey: string,
  token: string,
): Promise<ProcessTask[]> {
  try {
    const client = getApolloClient(token);
    const { data } = await client.query({
      query: GET_TASKS_BY_PROCESS_INSTANCE_KEY,
      variables: { processInstanceKey: instanceKey },
    });
    return data.getTasks || [];
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Abrufen der Aufgaben.');
    return [];
  }
}

export async function getIncidentFlowNode(
  processInstanceKey: string,
  token: string,
): Promise<string> {
  try {
    const client = getApolloClient(token);
    const { data } = await client.query({
      query: GET_INCIDENT_FLOW_NODE,
      variables: { processInstanceKey },
    });
    return data.getIncidentFlowNodeByProcessInstanceKey;
  } catch (error) {
    handleGraphQLError(error, 'Fehler beim Abrufen der Aufgaben.');
  }
}
