/**
 * @file
 * Modul zur Konfiguration des Node.js-Servers.
 *
 * @module NodeConfig
 * @description
 * Dieses Modul stellt die Konfigurationsparameter für den Node.js-Server bereit. 
 * Es umfasst Informationen wie den Hostnamen, den Port, die Ressourcenverzeichnisse, 
 * HTTPS-Optionen und die Datenbankkonfiguration. 
 * Die Einstellungen basieren auf Umgebungsvariablen und der App-Konfiguration.
 */

import { hostname } from 'node:os';
import { RESOURCES_DIR, config } from './app.js';
import { environment } from './environment.js';
import { httpsOptions } from './https.js';
import { database } from './mongo-database.js';

// Umgebungsvariablen und Datenbankkonfiguration extrahieren
const { NODE_ENV } = environment;
const { databaseName } = database;

// Den Hostnamen des aktuellen Computers abrufen
const computername = hostname();

/**
 * Standardport für den Node.js-Server, wenn keiner in der Konfiguration definiert ist.
 *
 * @constant {number}
 * @default 3000
 */
const port = (config.node?.port as number | undefined) ?? 3000; // eslint-disable-line @typescript-eslint/no-magic-numbers

/**
 * @constant
 * @type {object}
 * @description
 * Konfigurationsobjekt für den Node.js-Server.
 *
 * @property {string} host - Der Hostname des Servers, basierend auf dem aktuellen Rechnernamen.
 * @property {number} port - Der Port, auf dem der Server lauscht. Standard ist 3000, 
 *                           falls nicht anders konfiguriert.
 * @property {string} resourcesDir - Pfad zum Ressourcenverzeichnis der Anwendung.
 * @property {object} httpsOptions - Konfigurationsobjekt für HTTPS, basierend auf den TLS-Optionen.
 * @property {'development' | 'PRODUCTION' | 'production' | 'test' | undefined} nodeEnv - Die aktuelle Umgebung (z. B. Entwicklung, Produktion, Test).
 * @property {string} databaseName - Der Name der verbundenen Datenbank.
 *
 * @example
 * import { nodeConfig } from './node-config.js';
 * console.log(`Server läuft auf ${nodeConfig.host}:${nodeConfig.port}`);
 */
export const nodeConfig = {
    host: computername,
    port,
    resourcesDir: RESOURCES_DIR,
    httpsOptions,
    nodeEnv: NODE_ENV as 'development' | 'PRODUCTION' | 'production' | 'test' | undefined,
    databaseName,
} as const;
