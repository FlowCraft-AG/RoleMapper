/**
 * @file
 * Modul zur Konfiguration und Initialisierung des Loggers.
 *
 * @module LoggerConfig
 * @description
 * Dieses Modul stellt die Konfiguration und Erstellung eines Pino-Loggers bereit, 
 * der sowohl Datei-Logging als auch eine optional formatierte Konsolenausgabe unterstützt.
 */

import path from 'node:path';
import pino from 'pino';
import { type PrettyOptions } from 'pino-pretty';
import { config } from './app.js';
import { environment } from './environment.js';

const logDirectoryDefault = 'log';
const logFileNameDefault = 'server.log';
const logFileDefault = path.resolve(logDirectoryDefault, logFileNameDefault);

const { log } = config;

// Ermitteln des Log-Verzeichnisses, ggf. Standardwert verwenden
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const logDirectory: string | undefined =
    (log?.dir as string | undefined) === undefined ? undefined : log.dir.trimEnd(); // eslint-disable-line @typescript-eslint/no-unsafe-call
const logFile =
    logDirectory === undefined ? logFileDefault : path.resolve(logDirectory, logFileNameDefault);

// Option für formatierte Konsolenausgabe
const pretty = log?.pretty === true;

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
let logLevelTemporary: LogLevel = 'info';

// Bestimmen der Log-Stufe basierend auf Umgebungsvariablen oder Konfigurationswerten
if (environment.LOG_LEVEL !== undefined) {
    logLevelTemporary = environment.LOG_LEVEL as LogLevel;
} else if (log?.level !== undefined) {
    logLevelTemporary = log?.level as LogLevel;
}
export const logLevel = logLevelTemporary;

// console.debug(`logger config: logLevel=${logLevel}, logFile=${logFile}, pretty=${pretty}`);

// Datei-Logging-Optionen
const fileOptions = {
    level: logLevel,
    target: 'pino/file',
    options: { destination: logFile },
};

// Optionen für formatierte Ausgabe mit pino-pretty
const prettyOptions: PrettyOptions = {
    translateTime: 'SYS:standard',
    singleLine: true,
    colorize: true,
    ignore: 'pid,hostname',
};
const prettyTransportOptions = {
    level: logLevel,
    target: 'pino-pretty',
    options: prettyOptions,
};

// Kombinierte Transportoptionen
const options: pino.TransportMultiOptions | pino.TransportSingleOptions = pretty
    ? { targets: [fileOptions, prettyTransportOptions] }
    : { targets: [fileOptions] };

// Initialisieren der Pino-Transporte
const transports = pino.transport(options); // eslint-disable-line @typescript-eslint/no-unsafe-assignment

/**
 * Der Hauptlogger der Anwendung.
 *
 * @constant
 * @type {pino.Logger<string>}
 * @description
 * Stellt den konfigurierten Logger bereit, der basierend auf der Log-Stufe entweder eine Datei, 
 * die Konsole oder beides verwendet.
 *
 * @example
 * // Beispiel zur Verwendung des Loggers:
 * parentLogger.info('Anwendung gestartet');
 */
export const parentLogger: pino.Logger<string> =
    logLevel === 'info'
        ? pino(pino.destination(logFileDefault))
        : pino({ level: logLevel }, transports); // eslint-disable-line @typescript-eslint/no-unsafe-argumen

