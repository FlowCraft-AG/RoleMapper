import { Injectable, type OnApplicationBootstrap } from '@nestjs/common';
import cFonts from 'cfonts';
import chalk from 'chalk';
import { release, type, userInfo } from 'node:os';
import process from 'node:process';
import { nodeConfig } from '../config/node.js';
import { getLogger } from './logger.js';

@Injectable()
export class BannerService implements OnApplicationBootstrap {
    readonly #logger = getLogger(BannerService.name);

    /**
     * Beim Bootstrap der Anwendung Informationen und ein Banner ausgeben.
     */
    onApplicationBootstrap() {
        const { host, nodeEnv, port, databaseName, httpsOptions } = nodeConfig;

        // Überprüfen, ob HTTPS oder HTTP verwendet wird
        const protocol = httpsOptions === undefined ? 'http' : 'https';

        // Banner generieren und ausgeben
        this.#generateBanner();

        // Umgebungsinformationen mit Farben ausgeben
        this.#logger.info(chalk.green('=== Anwendungsinformationen ==='));
        this.#logger.info(chalk.cyan('Anwendungsname: ') + chalk.yellow('RoleMapper'));
        this.#logger.info(chalk.cyan('Node.js-Version: ') + chalk.yellow(process.version));
        this.#logger.info(chalk.cyan('Umgebung: ') + chalk.yellow(nodeEnv!));
        this.#logger.info(chalk.cyan('Protokol: ') + chalk.yellow(protocol.toString()));
        this.#logger.info(chalk.cyan('Host: ') + chalk.yellow(host));
        this.#logger.info(chalk.cyan('Port: ') + chalk.yellow(port.toString()));
        this.#logger.info(chalk.cyan('Datenbank: ') + chalk.yellow(databaseName));
        this.#logger.info(
            chalk.cyan('Betriebssystem: ') + chalk.yellow(`${type()} (${release()})`),
        );
        this.#logger.info(chalk.cyan('Benutzer: ') + chalk.yellow(userInfo().username));
        this.#logger.info(chalk.cyan('Swagger UI: ') + chalk.yellowBright('/swagger'));
        this.#logger.info(chalk.green('==============================='));
    }

    /**
     * Banner generieren und ausgeben.
     */
    #generateBanner() {
        cFonts.say('RoleMapper', {
            font: 'block',
            align: 'left',
            gradient: ['white', 'black'],
            background: 'transparent',
            letterSpacing: 1,
            lineHeight: 1,
        });
    }
}
