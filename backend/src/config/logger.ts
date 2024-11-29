import path from 'node:path';
import pino from 'pino';
import { type PrettyOptions } from 'pino-pretty';
import { config } from './app.js';
import { env } from './env.js';

const logDirDefault = 'log';
const logFileNameDefault = 'server.log';
const logFileDefault = path.resolve(logDirDefault, logFileNameDefault);

const { log } = config;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const logDir: string | undefined =
    (log?.dir as string | undefined) === undefined
        ? undefined
        : log.dir.trimEnd(); // eslint-disable-line @typescript-eslint/no-unsafe-call
const logFile =
    logDir === undefined
        ? logFileDefault
        : path.resolve(logDir, logFileNameDefault);
const pretty = log?.pretty === true;

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
let logLevelTmp: LogLevel = 'info';
if (env.LOG_LEVEL !== undefined) {
    logLevelTmp = env.LOG_LEVEL as LogLevel;
} else if (log?.level !== undefined) {
    logLevelTmp = log?.level as LogLevel;
}
export const logLevel = logLevelTmp;

console.debug(
    `logger config: logLevel=${logLevel}, logFile=${logFile}, pretty=${pretty}`,
);

const fileOptions = {
    level: logLevel,
    target: 'pino/file',
    options: { destination: logFile },
};
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

const options: pino.TransportMultiOptions | pino.TransportSingleOptions = pretty
    ? { targets: [fileOptions, prettyTransportOptions] }
    : { targets: [fileOptions] };
const transports = pino.transport(options); // eslint-disable-line @typescript-eslint/no-unsafe-assignment

export const parentLogger: pino.Logger<string> =
    logLevel === 'info'
        ? pino(pino.destination(logFileDefault))
        : pino({ level: logLevel }, transports); // eslint-disable-line @typescript-eslint/no-unsafe-argument