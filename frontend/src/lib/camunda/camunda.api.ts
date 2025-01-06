/**
 * @file camunda-api.ts
 * @description Stellt Funktionen zur Interaktion mit der Camunda Platform API bereit, einschließlich des Abrufens von Prozessdefinitionen, Instanzdetails, Variablen und Aufgaben.
 *
 * @module camunda-api
 */

'use server';

import {
  ProcessInstance,
  ProcessTask,
  ProcessVariable,
} from '../../types/process.type';
import { ENV } from '../../utils/env';
import { getLogger } from '../../utils/logger';

const logger = getLogger('camunda-api');

const CAMUNDA_OPERATE_API_URL = ENV.CAMUNDA_OPERATE_API_URL;
const CAMUNDA_TASKLIST_API_URL = ENV.CAMUNDA_TASKLIST_API_URL;
const CAMUNDA_KEYCLOAK_API_URL = ENV.CAMUNDA_KEYCLOAK_API_URL;
const CAMUNDA_KEYCLOAK_CLIENT_SECRET = ENV.CAMUNDA_KEYCLOAK_CLIENT_SECRET;

/**
 * Führt eine HTTP-Anfrage aus und behandelt Fehler zentral.
 *
 * @param {string} url - Die URL der Anfrage.
 * @param {RequestInit} options - Optionen für die Anfrage.
 * @param {'json' | 'text'} [responseType='json'] - Der erwartete Antworttyp.
 * @returns {Promise<any>} Die Antwort als JSON oder Text.
 * @throws {Error} Wenn die Anfrage fehlschlägt.
 */
async function httpRequest(
  url: string,
  options: RequestInit,
  responseType: 'json' | 'text' = 'json',
) {
  logger.debug(`Sende Anfrage an: ${url}`);
  const response = await fetch(url, options);

  if (!response.ok) {
    logger.error(`HTTP-Fehler: ${response.statusText}`);
    throw new Error(`HTTP-Fehler: ${response.statusText}`);
  }

  logger.debug(`Erfolgreiche Antwort von: ${url}`);

  if (responseType === 'json') {
    return await response.json(); // JSON-Daten verarbeiten
  }

  return await response.text(); // Textdaten (z. B. XML) verarbeiten
}

/**
 * Ruft ein Authentifizierungstoken von Keycloak ab.
 *
 * @returns {Promise<string>} Das JWT-Token.
 */

export async function fetchAuthToken() {
  const formData = new URLSearchParams({
    username: 'demo',
    password: 'demo',
    grant_type: 'password',
    client_id: 'camunda-identity',
    client_secret: CAMUNDA_KEYCLOAK_CLIENT_SECRET,
    scope: 'openid',
  });

  const tokenResponse = await httpRequest(CAMUNDA_KEYCLOAK_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  return tokenResponse.access_token;
}

/**
 * Ruft das XML einer Prozessdefinition ab.
 *
 * @param {string} processDefinitionKey - Der Schlüssel der Prozessdefinition.
 * @returns {Promise<string>} Das XML der Prozessdefinition.
 */
export async function fetchProcessDefinitionXml(
  processDefinitionKey: string,
): Promise<string> {
  const token = await fetchAuthToken();

  const result = await httpRequest(
    `${CAMUNDA_OPERATE_API_URL}/process-definitions/${processDefinitionKey}/xml`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    },
    'text', // Gib an, dass die Antwort im Textformat erwartet wird);
  );

  logger.debug(
    'XML der Prozessdefinition erfolgreich abgerufen: %s',
    result.length,
  );
  return result;
}

/**
 * Ruft alle Prozessinstanzen ab.
 *
 * @param {boolean} [activeOnly=false] - Gibt an, ob nur aktive Instanzen abgerufen werden sollen.
 * @returns {Promise<ProcessInstance[]>} Die Liste der Prozessinstanzen.
 */
export async function fetchProcessInstances(
  activeOnly = false,
): Promise<ProcessInstance[]> {
  logger.debug('Prozessinstanzen abrufen (nur aktive: %s)', activeOnly);
  const token = await fetchAuthToken();
  const body = {
    filter: activeOnly ? { state: 'ACTIVE' } : undefined,
    sort: [{ field: 'bpmnProcessId', order: 'ASC' }],
  };

  const result = await httpRequest(
    `${CAMUNDA_OPERATE_API_URL}/process-instances/search`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );
  return result.items;
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
  const token = await fetchAuthToken();
  const instanz = await httpRequest(
    `${CAMUNDA_OPERATE_API_URL}/process-instances/${key}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  logger.debug('Details der Prozessinstanz erfolgreich abgerufen: %o', instanz);
  return instanz;
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
  const token = await fetchAuthToken();
  const variables = await httpRequest(
    `${CAMUNDA_OPERATE_API_URL}/variables/search`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: { processInstanceKey },
      }),
    },
  );
  logger.debug(
    'Variablen der Prozessinstanz erfolgreich abgerufen: %o',
    variables,
  );
  return variables.items;
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

  const token = await fetchAuthToken();
  const tasks = await httpRequest(`${CAMUNDA_TASKLIST_API_URL}/tasks/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      processInstanceKey,
      state: 'CREATED',
    }),
  });

  const activeTask = tasks.find(
    (task: ProcessTask) => task.taskState === 'CREATED',
  );

  return activeTask ? activeTask.taskDefinitionId : null;
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
  const token = await fetchAuthToken();
  return await httpRequest(`${CAMUNDA_TASKLIST_API_URL}/tasks/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      processInstanceKey,
    }),
  });
}
