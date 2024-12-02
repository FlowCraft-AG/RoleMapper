/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type Options } from 'nodemailer/lib/smtp-transport';
import { config } from './app.js';
import { logLevel } from './logger.js';

const { mail } = config;

const activated = mail?.activated === undefined || mail?.activated === true;

// Hochschule Karlsruhe: smtp.h-ka.de
const host = (mail?.host as string | undefined) ?? 'smtp';
// Hochschule Karlsruhe:   25
const port = (mail?.port as number | undefined) ?? 25; // eslint-disable-line @typescript-eslint/no-magic-numbers
const logger = mail?.log === true;

export const options: Options = {
    host,
    port,
    secure: false,

    // Googlemail:
    // service: 'gmail',
    // auth: {
    //     user: 'Meine.Benutzerkennung@gmail.com',
    //     pass: 'mypassword'
    // }

    priority: 'normal',
    logger,
} as const;
export const mailConfig = {
    activated,
    options,
};
Object.freeze(options);
if (logLevel === 'debug') {
    console.debug('mailConfig = %o', mailConfig);
}
