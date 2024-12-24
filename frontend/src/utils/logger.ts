import fs from 'fs-extra';
import { resolve } from 'path';
import pino from 'pino';
import pretty from 'pino-pretty';

// Singleton Logger-Instanz
let loggerInstance: pino.Logger | null = null;

function initializeLogger(): pino.Logger {
  if (loggerInstance) {
    console.info('Logger existiert bereits.');
    return loggerInstance;
  }

  console.info('Logger wird initialisiert...');

  const {
    NEXT_PUBLIC_LOG_LEVEL = 'info',
    NEXT_PUBLIC_LOG_DIR = 'logs',
    NEXT_PUBLIC_PINO_PRETTY = 'true',
  } = process.env;

  const logDir = resolve(process.cwd(), 'src', NEXT_PUBLIC_LOG_DIR);
  const logFile = resolve(logDir, 'server.log');
  const logLevel = NEXT_PUBLIC_LOG_LEVEL;
  const prettyEnabled = NEXT_PUBLIC_PINO_PRETTY === 'true';

  fs.ensureDirSync(logDir);

  // Backup alte Logs
  if (fs.existsSync(logFile)) {
    const backupDir = resolve(logDir, new Date().toISOString().split('T')[0]);
    fs.ensureDirSync(backupDir);

    const backupFile = resolve(backupDir, `log-${Date.now()}.log`);
    fs.renameSync(logFile, backupFile);
  }

  // Pretty Print nur in der Entwicklungsumgebung
  const stream = prettyEnabled
    ? pretty({
        translateTime: 'SYS:standard',
        singleLine: true,
        colorize: true,
        ignore: 'pid,hostname',
        messageFormat: '{msg}',
      })
    : fs.createWriteStream(logFile);

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

// Exportiere eine Funktion, die den Logger zurückgibt
export const getLogger = (context: string): pino.Logger => {
  if (!loggerInstance) {
    initializeLogger();
  }
  return loggerInstance!.child({ context });
};

// Initialisiere den Logger beim ersten Import
initializeLogger();
