/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable security-node/detect-unhandled-async-errors */
/* eslint-disable security/detect-non-literal-fs-filename */
import { Injectable, type OnApplicationBootstrap } from '@nestjs/common';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { getLogger } from '../../logger/logger.js';
import { zbClient } from './zeebe-client.config.js';

const logger = getLogger('DeploymentService');

const CAMUNDA_BASE_PATH = path.resolve(
    import.meta.dirname,
    '..',
    '..',
    '..',
    '..',
    '.extras',
    'camunda',
);

async function deployFilesInFolder(folderPath: string) {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isFile()) {
            const fileContent = fs.readFileSync(filePath);
            try {
                await zbClient.deployProcess({
                    definition: fileContent,
                    name: file,
                });
                logger.info(
                    `${chalk.green('✔')} ${chalk.cyan('Datei bereitgestellt:')} ${chalk.yellow(file)}`,
                );
            } catch (error) {
                logger.error(
                    `${chalk.red('✖')} ${chalk.cyan('Fehler beim Bereitstellen der Datei:')} ${chalk.yellow(file)}`,
                );
                logger.error(`${chalk.redBright('Details:')} ${(error as Error).message}`);
            }
        }
    }
}

export async function deployCamundaResources() {
    try {
        logger.info(chalk.green('=== Start der Ressourcendeployment ==='));

        logger.info(chalk.cyan('Bereitstellung der BPMN-Dateien...'));
        await deployFilesInFolder(path.join(CAMUNDA_BASE_PATH, 'bpmn'));

        logger.info(chalk.cyan('Bereitstellung der DMN-Dateien...'));
        await deployFilesInFolder(path.join(CAMUNDA_BASE_PATH, 'dmn'));

        logger.info(chalk.cyan('Bereitstellung der Formulare...'));
        await deployFilesInFolder(path.join(CAMUNDA_BASE_PATH, 'form'));

        logger.info(chalk.green('✔ Alle Ressourcen wurden erfolgreich bereitgestellt.'));
    } catch (error) {
        logger.error(`${chalk.red('✖ Fehler beim Bereitstellen der Ressourcen:')}`);
        logger.error(`${chalk.redBright('Details:')} ${(error as Error).message}`);
    } finally {
        await zbClient.close();
        // logger.info(chalk.cyan('Zeebe-Client geschlossen.'));
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
