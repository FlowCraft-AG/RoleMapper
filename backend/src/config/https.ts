/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable security/detect-non-literal-fs-filename */

/**
 * @file
 * TLS-Konfigurationsmodul für die Anwendung.
 *
 * @module TLSConfig
 * @description
 * Dieses Modul enthält die Konfigurationsoptionen für die TLS-Integration eines HTTPS-Servers.
 * Es wird sichergestellt, dass die benötigten Zertifikate und Schlüssel entweder aus Dateien
 * oder aus Umgebungsvariablen geladen werden.
 */

import chalk from 'chalk';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { VOLUMES_DIR } from './app.js';

// Pfad zum Verzeichnis, in dem die TLS-Schlüssel gespeichert sind
const KEYS_DIR = path.resolve(VOLUMES_DIR, 'keys');
// console.debug(chalk.blue(`TLS Directory: ${KEYS_DIR}`));

if (!VOLUMES_DIR || typeof VOLUMES_DIR !== 'string') {
    throw new Error(chalk.red('VOLUMES_DIR is not properly configured'));
}

if (!existsSync(KEYS_DIR)) {
    console.warn(chalk.yellow(`Keys directory not found: ${KEYS_DIR}`));
}

/**
 * TLS-Konfigurationsoptionen für HTTPS-Server.
 *
 * @constant
 * @type {object}
 * @property {string | Buffer} key - Der private Schlüssel für TLS. Wird zuerst aus der Datei `key.pem` geladen,
 *                                   fällt jedoch auf `process.env.KEY` zurück, wenn die Datei fehlt.
 * @property {string | Buffer} cert - Das Zertifikat für TLS. Wird zuerst aus der Datei `certificate.crt` geladen,
 *                                    fällt jedoch auf `process.env.CERTIFICATE` zurück, wenn die Datei fehlt.
 *
 * @throws {Error} Falls weder die Datei noch die Umgebungsvariablen für den Schlüssel oder das Zertifikat gefunden werden.
 *
 * @example
 * // Beispiel zur Verwendung von `httpsOptions`:
 * const httpsServer = https.createServer(httpsOptions, app);
 * httpsServer.listen(443, () => {
 *   console.log('HTTPS-Server läuft auf Port 443');
 * });
 */
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
