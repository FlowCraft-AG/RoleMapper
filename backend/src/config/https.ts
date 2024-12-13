/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable security/detect-non-literal-fs-filename */
import chalk from 'chalk';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { VOLUMES_DIR } from './app.js';

const KEYS_DIR = path.resolve(VOLUMES_DIR, 'keys');
// console.debug(chalk.blue(`TLS Directory: ${KEYS_DIR}`));

if (!VOLUMES_DIR || typeof VOLUMES_DIR !== 'string') {
    throw new Error(chalk.red('VOLUMES_DIR is not properly configured'));
}

if (!existsSync(KEYS_DIR)) {
    console.warn(chalk.yellow(`Keys directory not found: ${KEYS_DIR}`));
}

export const httpsOptions = {
    key: (() => {
        const keyPath = path.resolve(KEYS_DIR, 'key.pem');
        if (existsSync(keyPath)) {
            // console.debug(chalk.green(`Loading key from: ${keyPath}`));
            return readFileSync(keyPath);
        }
        if (process.env.KEY === undefined) {
            console.warn(chalk.yellow('TLS key.pem missing, falling back to process.env.KEY'));
            return process.env.KEY;
        }
        throw new Error(chalk.red('TLS key not found'));
    })(),
    cert: (() => {
        const certPath = path.resolve(KEYS_DIR, 'certificate.crt');
        if (existsSync(certPath)) {
            // console.debug(chalk.green(`Loading certificate from: ${certPath}`));
            return readFileSync(certPath);
        }
        if (process.env.CERTIFICATE === undefined) {
            console.warn(
                chalk.yellow(
                    'TLS certificate.crt missing, falling back to process.env.CERTIFICATE',
                ),
            );
            return process.env.CERTIFICATE;
        }
        throw new Error(chalk.red('TLS certificate not found'));
    })(),
};
