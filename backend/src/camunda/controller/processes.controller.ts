/**
 * @file processes.controller.ts
 * @module ProcessesController
 * @description Enthält den Controller für Prozessoperationen, der HTTP-Endpunkte bereitstellt, um Zeebe-Prozesse zu starten.
 */

import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ZeebeService } from '../service/zeebe.service.js';

/**
 * @class ProcessesController
 * @description Controller-Klasse zur Bereitstellung von HTTP-Endpunkten für Prozessoperationen. Kommuniziert mit dem ZeebeService, um Prozesse zu starten.
 */
@Controller('processes') // Basis-Route für Prozessoperationen.
export class ProcessesController {
    /**
     * @private
     * @property {Logger} #logger - Logger-Instanz zur Protokollierung von Controller-Operationen.
     */
    readonly #logger = getLogger(ProcessesController.name);

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
     * @description Startet eine neue Prozessinstanz über einen HTTP-POST-Request.
     * 
     * @param {Object} body - Der Körper der HTTP-Anfrage, der den Prozessschlüssel und die Variablen enthält.
     * @param {string} body.processKey - Der eindeutige Schlüssel, der die Prozessdefinition in Zeebe identifiziert.
     * @param {Record<string, any>} body.variables - Ein Objekt, das die Variablen für die Prozessinstanz enthält.
     * @returns {Promise<any>} Ein Promise, das das Ergebnis des Prozessstarts zurückgibt.
     */
    @Post('start') // HTTP-POST-Endpunkt, um einen Prozess zu starten.
    @Public() // Macht diesen Endpunkt öffentlich und ohne Authentifizierung zugänglich.
    async startProcess(
        @Body() body: { processKey: string; variables: Record<string, any> }, // Liest den HTTP-Anfragekörper.
    ) {
        const { processKey, variables } = body; // Extrahiert die Prozessdaten aus dem Anfragekörper.

        // Startet den Prozess über den ZeebeService.
        const result = this.#zeebeService.startProcess(processKey, variables);

        // Protokolliert das Ergebnis des gestarteten Prozesses.
        this.#logger.debug('Prozess gestartet:', result);

        // Gibt das Ergebnis des Prozessstarts zurück.
        return result;
    }
}

