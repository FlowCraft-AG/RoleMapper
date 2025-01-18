/**
 * @file deployment.service.ts
 * @module DeploymentService
 * @description Bereitstellungs- und Banner-Service für die Anwendung. 
 * Verwaltet die Bereitstellung von Camunda-Ressourcen und generiert Startinformationen.
 */

/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable security/detect-non-literal-fs-filename */

import { Injectable, type OnApplicationBootstrap } from '@nestjs/common';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { getLogger } from '../logger/logger.js';
import { zbClient } from './zeebe.js';

/**
 * Logger-Instanz für den Bereitstellungsservice.
 */
const logger = getLogger('DeploymentService');

/**
 * Basisverzeichnis für Camunda-Ressourcen.
 */
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
        } else if (entry.isFile()) {
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
        }
    }
}

/**
 * Bereitstellung von Camunda-Ressourcen.
 * @description Stellt BPMN-, DMN- und Formulardateien bereit.
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

/**
 * Service zum Generieren eines Start-Banners und zur Durchführung der Ressourcendeployment.
 */
@Injectable()
export class BannerService implements OnApplicationBootstrap {
    readonly #logger = getLogger(BannerService.name);

    /**
     * Startlogik der Anwendung ausführen.
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
     * Generiert ein Banner mit Informationen über die Anwendung und gibt es aus.
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

