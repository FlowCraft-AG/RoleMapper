/**
 * @file
 * Modul zur Konfiguration der Health-Checks.
 *
 * @module HealthConfig
 * @description
 * Dieses Modul definiert die Konfiguration für Health-Checks der Anwendung. 
 * Es bietet eine Einstellung, ob die Ausgabe formatiert werden soll, basierend auf der `config.health.prettyPrint`-Einstellung.
 */

import { config } from './app.js';
import { logLevel } from './logger.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const prettyPrint: string | undefined = config.health?.prettyPrint;

/**
 * Konfigurationsobjekt für die Health-Checks.
 *
 * @constant
 * @type {object}
 * @property {boolean} prettyPrint - Gibt an, ob die Health-Check-Ausgabe formatiert werden soll. 
 *                                   Die Einstellung basiert auf der Konfiguration in `config.health.prettyPrint`. 
 *                                   Nur gültig, wenn der Wert `"true"` (case-insensitive) ist.
 *
 * @example
 * // Beispiel für die Verwendung von `healthConfig`:
 * if (healthConfig.prettyPrint) {
 *   console.log('Formatiertes Health-Check-Logging ist aktiviert.');
 * }
 */
export const healthConfig = {
    prettyPrint: prettyPrint !== undefined && prettyPrint.toLowerCase() === 'true',
} as const;

// Debug-Ausgabe der Health-Konfiguration im Entwicklungsmodus
if (logLevel === 'debug') {
    console.debug('healthConfig: %o', healthConfig);
}
