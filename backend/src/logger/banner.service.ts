import { Injectable, type OnApplicationBootstrap } from '@nestjs/common';
import chalk from 'chalk';
import figlet from 'figlet';
import { release, type, userInfo } from 'node:os';
import process from 'node:process';
import { promisify } from 'node:util';
import { nodeConfig } from '../config/node.js';
import { getLogger } from './logger.js';

// figlet wird in eine Promise-Variante umgewandelt
const figletAsync = promisify(figlet);

/**
 * Beim Start ein Banner ausgeben durch `onApplicationBootstrap()`.
 */
@Injectable()
export class BannerService implements OnApplicationBootstrap {
    readonly #logger = getLogger(BannerService.name);

    /**
     * Beim Bootstrap der Anwendung Informationen und ein Banner ausgeben.
     */
    async onApplicationBootstrap() {
        const { host, nodeEnv, port } = nodeConfig;

        try {
            // Banner generieren und mit Farben ausgeben
            const banner = (await figletAsync('RoleMapper')) as string;
            this.#logger.info(chalk.blueBright(`\n${banner}`)); // Banner in Blau
        } catch (error) {
            this.#logger.error(chalk.red('Fehler beim Generieren des Banners mit figlet:'), error);
        }

        // Umgebungsinformationen mit Farben ausgeben
        this.#logger.info(chalk.green('=== Anwendungsinformationen ==='));
        this.#logger.info(chalk.cyan('Anwendungsname: ') + chalk.yellow('RoleMapper'));
        this.#logger.info(chalk.cyan('Node.js-Version: ') + chalk.yellow(process.version));
        this.#logger.info(chalk.cyan('Umgebung: ') + chalk.yellow(nodeEnv));
        this.#logger.info(chalk.cyan('Host: ') + chalk.yellow(host));
        this.#logger.info(chalk.cyan('Port: ') + chalk.yellow(port.toString()));
        this.#logger.info(chalk.cyan('Datenbank: ') + chalk.yellow('MongoDB'));
        this.#logger.info(
            chalk.cyan('Betriebssystem: ') + chalk.yellow(`${type()} (${release()})`),
        );
        this.#logger.info(chalk.cyan('Benutzer: ') + chalk.yellow(userInfo().username));
        this.#logger.info(chalk.cyan('Swagger UI: ') + chalk.yellowBright('/swagger'));
        this.#logger.info(chalk.green('==============================='));
    }
}
