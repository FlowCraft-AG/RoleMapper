import fs from 'fs-extra';
import { resolve } from 'path';
import pino from 'pino';
import pretty from 'pino-pretty';
import { ENV } from './env';

// Singleton Logger-Instanz
let loggerInstance: pino.Logger | undefined = undefined;

/**
 * Initialisiert den Logger und erstellt eine Singleton-Instanz.
 * Der Logger unterstützt sowohl Pretty Print (für Entwicklungsumgebungen) als auch
 * die Speicherung von Logs in Dateien (für Produktionsumgebungen).
 *
 * @returns {pino.Logger} - Die Logger-Instanz.
 */
function initializeLogger(): pino.Logger {
  if (loggerInstance) {
    console.info('Logger existiert bereits.');
    return loggerInstance;
  }

  console.info('Logger wird initialisiert...');

  // Umgebungsvariablen
  const {
    NEXT_PUBLIC_LOG_LEVEL = 'info',
    NEXT_PUBLIC_LOG_DIR = 'logs',
    NEXT_PUBLIC_PINO_PRETTY = 'true',
  } = ENV;

  // Verzeichnisse und Dateien für Logs
  const logDir = resolve(process.cwd(), NEXT_PUBLIC_LOG_DIR);
  const logFile = resolve(logDir, 'server.log');
  const logLevel = NEXT_PUBLIC_LOG_LEVEL;
  const prettyEnabled = NEXT_PUBLIC_PINO_PRETTY === 'true';

  // Sicherstellen, dass das Log-Verzeichnis existiert
  fs.ensureDirSync(logDir);

  // Backup alte Logs
  if (fs.existsSync(logFile)) {
    const backupDir = resolve(logDir, new Date().toISOString().split('T')[0]);
    fs.ensureDirSync(backupDir);

    const backupFile = resolve(backupDir, `log-${Date.now()}.log`);
    fs.renameSync(logFile, backupFile);
  }

  // Stream-Konfiguration: Pretty Print in der Entwicklung oder Datei-Stream in Produktion
  const stream = prettyEnabled
    ? pretty({
        translateTime: 'SYS:standard', // Zeitformat: Systemstandard
        singleLine: true, // Einzeilige Logs
        colorize: true, // Farbausgabe im Terminal
        ignore: 'pid,hostname', // Ignorierte Felder
        messageFormat: '{msg}', // Format der Nachrichten
      })
    : fs.createWriteStream(logFile); // Log in Datei schreiben

  // Erstellen der Logger-Instanz
  loggerInstance = pino(
    {
      level: logLevel,
    },
    stream,
  );

  loggerInstance.info('Logger erfolgreich initialisiert.', {
    logFile,
    logLevel,
  });
  return loggerInstance;
}

/**
 * Gibt eine Logger-Instanz zurück, die um einen Kontext erweitert ist.
 * Wenn der Logger noch nicht initialisiert wurde, wird er automatisch erstellt.
 *
 * @param {string} context - Der Kontext, in dem der Logger verwendet wird (z. B. der Modulname).
 * @returns {pino.Logger} - Der Logger mit dem angegebenen Kontext.
 */
export const getLogger = (context: string): pino.Logger => {
  if (!loggerInstance) {
    initializeLogger();
  }
  return loggerInstance!.child({ context }); // Kontext hinzufügen
};

// Initialisiere den Logger beim ersten Import
initializeLogger();
