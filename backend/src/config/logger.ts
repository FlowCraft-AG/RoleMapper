/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @stylistic/operator-linebreak */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import path from 'node:path';
import pino from 'pino';
import { type PrettyOptions } from 'pino-pretty';
import { config } from './app.js';
import { environment } from './environment.js';

const logDirectoryDefault = 'log';
const logFileNameDefault = 'server.log';
const logFileDefault = path.resolve(logDirectoryDefault, logFileNameDefault);

const { log } = config;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const logDirectory: string | undefined =
    (log?.dir as string | undefined) === undefined ? undefined : log.dir.trimEnd(); // eslint-disable-line @typescript-eslint/no-unsafe-call
const logFile =
    logDirectory === undefined ? logFileDefault : path.resolve(logDirectory, logFileNameDefault);
const pretty = log?.pretty === true;

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
let logLevelTemporary: LogLevel = 'info';
if (environment.LOG_LEVEL !== undefined) {
    logLevelTemporary = environment.LOG_LEVEL as LogLevel;
} else if (log?.level !== undefined) {
    logLevelTemporary = log?.level as LogLevel;
}
export const logLevel = logLevelTemporary;

// console.debug(`logger config: logLevel=${logLevel}, logFile=${logFile}, pretty=${pretty}`);

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
