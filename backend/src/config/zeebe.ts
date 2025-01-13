/**
 * @file
 * Modul zur Konfiguration und Initialisierung des Zeebe-Clients.
 *
 * @module ZeebeClient
 * @description
 * Dieses Modul initialisiert den Zeebe-Client zur Kommunikation mit einem Zeebe-Broker.
 * Die Konfiguration des Clients basiert auf den App-Einstellungen. Falls keine URL konfiguriert ist,
 * wird eine Standard-URL verwendet.
 */

import { ZBClient } from 'zeebe-node';
import { config } from './app.js';

const { zeebe } = config;

/**
 * Initialisierte Instanz des Zeebe-Clients.
 *
 * @constant {ZBClient}
 * @description
 * Erstellt einen neuen Zeebe-Client basierend auf der konfigurierten URL in der App-Konfiguration.
 * Wenn keine URL angegeben ist, wird standardmäßig `localhost:26500` verwendet.
 *
 * @example
 * import { zbClient } from './zeebe-client.js';
 * zbClient.createWorkflowInstance('my-process', { key: 'value' });
 */
export const zbClient = new ZBClient((zeebe?.url as string | undefined) ?? 'localhost:26500'); // URL zum Zeebe-Broker
