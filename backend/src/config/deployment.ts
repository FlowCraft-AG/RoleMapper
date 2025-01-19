/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable security/detect-non-literal-fs-filename */
import { Injectable, type OnApplicationBootstrap } from '@nestjs/common';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { getLogger } from '../logger/logger.js';
import { zbClient } from './zeebe.js';

const logger = getLogger('DeploymentService');

/**
 * Liste der Dateierweiterungen, die bereitgestellt werden dürfen.
 */
const VALID_EXTENSIONS = new Set(['.bpmn', '.dmn', '.form']);

/**
 * Prüft, ob eine Datei eine gültige Erweiterung hat.
 * @param filename - Der Name der Datei.
 * @returns {boolean} `true`, wenn die Datei eine gültige Erweiterung hat, sonst `false`.
 */
function isValidFile(filename: string): boolean {
    const extension = path.extname(filename).toLowerCase();
    return VALID_EXTENSIONS.has(extension);
}

const CAMUNDA_BASE_PATH = path.resolve(import.meta.dirname, '..', '..', '..', '.extras', 'camunda');

/**
 * Rekursive Funktion zum Bereitstellen von Dateien in einem Verzeichnis und dessen Unterverzeichnissen.
 * @param folderPath - Der Pfad zum Verzeichnis.
 */
async function deployFilesInFolderRecursive(folderPath: string) {
    logger.warn(`${chalk.cyan('Verarbeite Verzeichnis:')} ${chalk.yellow(folderPath)}`);
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });

    for (const entry of entries) {
        const entryPath = path.join(folderPath, entry.name);

        if (entry.isDirectory()) {
            // Rekursiver Aufruf für Unterverzeichnisse
            await deployFilesInFolderRecursive(entryPath);
        } else if (entry.isFile() && isValidFile(entry.name)) {
            // Verarbeitung der Datei
            const fileContent = fs.readFileSync(entryPath);
            try {
                await zbClient.deployProcess({
                    definition: fileContent,
                    name: entry.name,
                });
                logger.info(
                    `${chalk.green('✔')} ${chalk.cyan('Datei bereitgestellt:')} ${chalk.yellow(entry.name)}`,
                );
            } catch (error) {
                logger.error(
                    `${chalk.red('✖')} ${chalk.cyan('Fehler beim Bereitstellen der Datei:')} ${chalk.yellow(
                        entry.name,
                    )}`,
                );
                logger.error(`${chalk.redBright('Details:')} ${(error as Error).message}`);
            }
        } else if (entry.isFile()) {
            // Ignorierte Datei protokollieren
            logger.warn(
                `${chalk.yellow('⚠')} ${chalk.cyan('Ignoriere ungültige Datei:')} ${chalk.yellow(entry.name)}`,
            );
        }
    }
}

/**
 * Führt die Bereitstellung aller Ressourcen in der Camunda-Verzeichnisstruktur durch.
 */
export async function deployCamundaResources() {
    try {
        logger.info(chalk.green('=== Start der Ressourcendeployment ==='));

        logger.info(chalk.cyan('Bereitstellung der Prozessmodelle...'));
        await deployFilesInFolderRecursive(path.join(CAMUNDA_BASE_PATH));

        // logger.info(chalk.cyan('Bereitstellung der BPMN-Dateien...'));
        // await deployFilesInFolderRecursive(path.join(CAMUNDA_BASE_PATH, 'bpmn'));

        // logger.info(chalk.cyan('Bereitstellung der DMN-Dateien...'));
        // await deployFilesInFolderRecursive(path.join(CAMUNDA_BASE_PATH, 'dmn'));

        // logger.info(chalk.cyan('Bereitstellung der Formulare...'));
        // await deployFilesInFolderRecursive(path.join(CAMUNDA_BASE_PATH, 'form'));

        logger.info(chalk.green('✔ Alle Ressourcen wurden erfolgreich bereitgestellt.'));
    } catch (error) {
        logger.error(`${chalk.red('✖ Fehler beim Bereitstellen der Ressourcen:')}`);
        logger.error(`${chalk.redBright('Details:')} ${(error as Error).message}`);
    }
}

@Injectable()
export class BannerService implements OnApplicationBootstrap {
    readonly #logger = getLogger(BannerService.name);

    /**
     * Beim Bootstrap der Anwendung Informationen und ein Banner ausgeben.
     */
    async onApplicationBootstrap() {
        this.#logger.info(chalk.green('=== Anwendung wird gestartet ==='));

        this.#generateBanner();

        // Starte die Ressourcendeployment
        this.#logger.info(chalk.cyan('Starte Camunda-Ressourcendeployment...'));
        try {
            await deployCamundaResources();
            this.#logger.info(chalk.green('✔ Deployment abgeschlossen.'));
        } catch (error) {
            this.#logger.error(chalk.red('✖ Fehler beim Deployment der Ressourcen.'));
            this.#logger.error(`${chalk.redBright('Details:')} ${(error as Error).message}`);
        }

        this.#logger.info(chalk.green('=== Anwendung erfolgreich gestartet ==='));
    }

    /**
     * Banner generieren und ausgeben.
     */
    #generateBanner() {
        this.#logger.info(chalk.green('==============================='));
        this.#logger.info(chalk.cyan(' Anwendung: ') + chalk.yellow('RoleMapper'));
        this.#logger.info(chalk.cyan(' Node.js-Version: ') + chalk.yellow(process.version));
        this.#logger.info(
            chalk.cyan(' Umgebungsstatus: ') + chalk.yellow(process.env.NODE_ENV ?? 'Entwicklung'),
        );
        this.#logger.info(chalk.green('==============================='));
    }
}
