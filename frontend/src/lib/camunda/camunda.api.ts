'use server';

import { ProcessTask } from '../../types/process.type';
import { fetchAuthToken } from '../operate';

const CAMUNDA_API_URL = 'http://localhost:8081/v1';

export const fetchActiveProcessInstances = async () => {
  const token = await fetchAuthToken(); // Auflösen der Promise
  try {
    const response = await fetch(
      `${CAMUNDA_API_URL}/process-instances/search`,
      {
        method: 'POST', // Hier muss die Methode explizit angegeben werden
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            state: 'ACTIVE',
          },
          sort: [
            {
              field: 'bpmnProcessId',
              order: 'ASC',
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('alle Prozessinstanzen', result);
    return await result; // Die Antwort als JSON parsen
  } catch (error) {
    console.error('Fehler beim Abrufen der Prozessinstanzen:', error);
    throw error;
  }
};

export const fetchAllProcessInstances = async () => {
  const token = await fetchAuthToken(); // Auflösen der Promise
  try {
    const response = await fetch(
      `${CAMUNDA_API_URL}/process-instances/search`,
      {
        method: 'POST', // Hier muss die Methode explizit angegeben werden
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sort: [
            {
              field: 'bpmnProcessId',
              order: 'ASC',
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('alle Prozessinstanzen', result);
    return await result; // Die Antwort als JSON parsen
  } catch (error) {
    console.error('Fehler beim Abrufen der Prozessinstanzen:', error);
    throw error;
  }
};

export const fetchProcessInstanceDetails = async (key: string) => {
  const token = await fetchAuthToken(); // Auflösen der Promise
  const response = await fetch(
    `http://localhost:8081/v1/process-instances/${key}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    console.log('fetchProcessInstanceDetails', response);
    throw new Error(`Fehler beim Abrufen der Details: ${response.statusText}`);
  }

  return await response.json();
};

export const fetchVariablesByProcessInstance = async (
  processInstanceKey: string,
) => {
  const token = await fetchAuthToken(); // Auflösen der Promise
  const response = await fetch(`http://localhost:8081/v1/variables/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: {
        processInstanceKey,
      },
    }),
  });

  if (!response.ok) {
    console.log('fetchProcessInstanceDetails', response);
    throw new Error(`Fehler beim Abrufen der Details: ${response.statusText}`);
  }

  return await response.json();
};

export const fetchActiveElementId = async (
  processInstanceKey: string,
): Promise<string | null> => {
  const token = await fetchAuthToken(); // Auflösen der Promise
  try {
    const response = await fetch('http://localhost:8082/v1/tasks/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        processInstanceKey,
        state: 'CREATED',
      }),
    });

    if (!response.ok) {
      console.log('fetchActiveElementId Response:', response);
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();

    // Suche nach der aktiven Aufgabe (Status: CREATED)
    const activeTask = tasks.find(
      (task: ProcessTask) => task.taskState === 'CREATED',
    );
    console.log('Active Task:', activeTask);
    return activeTask?.taskDefinitionId || null;
  } catch (error) {
    console.error('Error fetching active element ID:', error);
    return null;
  }
};

export const fetchAllTasksByProcessInstance = async (
  processInstanceKey: string,
): Promise<ProcessTask[]> => {
  const token = await fetchAuthToken(); // Auflösen der Promise
  try {
    const response = await fetch('http://localhost:8082/v1/tasks/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        processInstanceKey,
      }),
    });

    if (!response.ok) {
      console.log('fetchActiveElementId Response:', response);
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();

    // Suche nach der aktiven Aufgabe (Status: CREATED)
    return tasks;
  } catch (error) {
    console.error('Error fetching active element ID:', error);
    throw new Error('Failed to fetch tasks');
  }
};
