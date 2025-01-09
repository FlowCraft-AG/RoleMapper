/**
 * @file processes.resolver.ts
 * @module ProcessesResolver
 * @description Diese Datei enthält den GraphQL-Resolver für prozessbezogene Operationen, wie das Starten einer Zeebe-Prozessinstanz.
 */

import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ZeebeService } from '../service/zeebe.service.js';

/**
 * @class ProcessesResolver
 * @description Resolver-Klasse zur Verwaltung von Prozessen über GraphQL-Mutationen. Integriert die ZeebeService-Klasse zur Interaktion mit Prozessinstanzen.
 */
@Resolver()
export class ProcessesResolver {
    /**
     * @private
     * @property {Logger} #logger - Logger-Instanz für das Protokollieren von Resolver-Operationen.
     */
    readonly #logger = getLogger(ProcessesResolver.name);

    /**
     * @private
     * @property {ZeebeService} #zeebeService - Service zur Verwaltung der Interaktion mit Zeebe.
     */
    readonly #zeebeService: ZeebeService;

    /**
     * @constructor
     * @param {ZeebeService} zeebeService - Injected ZeebeService-Instanz zur Verwaltung von Zeebe-Operationen.
     */
    constructor(zeebeService: ZeebeService) {
        this.#zeebeService = zeebeService;
    }

    /**
     * @public
     * @method startProcess
     * @description Startet eine Zeebe-Prozessinstanz basierend auf dem angegebenen Prozessschlüssel und den Variablen.
     * 
     * @param {string} processKey - Der eindeutige Schlüssel, der die Prozessdefinition in Zeebe identifiziert.
     * @param {string} variables - Ein JSON-String, der die Variablen enthält, die für die Prozessinstanz erforderlich sind.
     * @returns {Promise<string>} Ein Promise, das eine Zeichenkette zurückgibt, die die erfolgreiche Prozessinitialisierung bestätigt.
     */
    @Public() // Macht diesen Resolver öffentlich und ohne Authentifizierung zugänglich.
    @Mutation() // Definiert eine GraphQL-Mutation.
    async startProcess(
        @Args('processKey') processKey: string, // GraphQL-Argument für den Prozessschlüssel.
        @Args('variables') variables: string,  // GraphQL-Argument für die Prozessvariablen.
    ): Promise<string> {
        // Bereitet die Prozessvariablen vor. Beispielstruktur zu Demonstrationszwecken.
        const kp = { eingabe: 'gyca1011', userId: variables, procesId: 'DA0001' };

        // Startet den Prozess mit dem ZeebeService.
        const result = await this.#zeebeService.startProcess(processKey, kp);

        // Protokolliert das Ergebnis der Prozessinitialisierung.
        this.#logger.debug('Prozess gestartet:', result);

        // Gibt eine Bestätigungsnachricht mit dem Prozessinstanz-Schlüssel zurück.
        return `Prozess gestartet mit Schlüssel: ${result.processInstanceKey}`;
    }
}
