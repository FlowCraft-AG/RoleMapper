import pino from 'pino';

// Singleton Logger-Instanz
let loggerInstance: pino.Logger | null = null;

function initializeLogger(): pino.Logger {
  if (loggerInstance) {
    return loggerInstance;
  }

  console.info('Logger wird initialisiert...');

  const { NEXT_PUBLIC_LOG_LEVEL = 'info' } = process.env;

  // Einfache Logger-Konfiguration ohne Worker
  loggerInstance = pino({
    level: NEXT_PUBLIC_LOG_LEVEL,
  });

  return loggerInstance;
}

export const getLogger = (context: string): pino.Logger => {
  if (!loggerInstance) {
    initializeLogger();
  }
  return loggerInstance!.child({ context });
};

// Initialisiere den Logger beim ersten Import
initializeLogger();
