/**
 * @file token.controller.ts
 * @description Controller für die Authentifizierung und Autorisierung mit Keycloak. 
 * Beinhaltet Endpunkte für die Generierung und Aktualisierung von Tokens.
 * @module TokenController
 */

import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseInterceptors } from '@nestjs/common';
import {
    ApiConsumes,
    ApiOkResponse,
    ApiOperation,
    ApiProperty,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'nest-keycloak-connect';
import { paths } from '../../config/paths.js';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { KeycloakService } from './keycloak.service.js';

/**
 * @class TokenData
 * @description Datenstruktur für die Übergabe von Benutzerdaten zur Token-Generierung.
 */
export class TokenData {
    /**
     * Der Benutzername für die Authentifizierung.
     * @example 'admin'
     */
    @ApiProperty({ example: 'admin', type: String })
    username: string | undefined;

    /**
     * Das Passwort für die Authentifizierung.
     * @example 'p'
     */
    @ApiProperty({ example: 'p', type: String })
    password: string | undefined;
}

/**
 * @class Refresh
 * @description Datenstruktur für die Übergabe eines Refresh-Tokens.
 */
export class Refresh {
    /**
     * Das Refresh-Token, um ein Zugriffstoken zu erneuern.
     * @example 'alg.payload.signature'
     */
    @ApiProperty({ example: 'alg.payload.signature', type: String })
    refresh_token: string | undefined; // eslint-disable-line @typescript-eslint/naming-convention, camelcase
}

/**
 * @class TokenController
 * @description Controller für Endpunkte zur Authentifizierung und Autorisierung.
 */
@Controller(paths.auth)
@UseInterceptors(ResponseTimeInterceptor)
@ApiTags('Authentifizierung und Autorisierung')
export class TokenController {
    /** Instanz des KeycloakService zur Verarbeitung von Token-Operationen. */
    readonly #keycloakService: KeycloakService;

    /** Logger für Debugging und Fehlerprotokollierung. */
    readonly #logger = getLogger(TokenController.name);

    constructor(keycloakService: KeycloakService) {
        this.#keycloakService = keycloakService;
    }

    /**
     * Endpunkt für die Generierung eines Zugriffstokens basierend auf Benutzername und Passwort.
     * 
     * @param {TokenData} param0 - Objekt mit Benutzername und Passwort.
     * @param {Response} response - Die HTTP-Antwort.
     * @returns {Promise<Response>} Die generierte Token-Antwort oder ein Fehlerstatus.
     */
    @Post(paths.token)
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
    @ApiOperation({ summary: 'Access Token zu Benutzername und Passwort' })
    @ApiOkResponse({ description: 'Erfolgreich eingeloggt.' })
    @ApiUnauthorizedResponse({
        description: 'Benutzername oder Passwort sind falsch.',
    })
    async token(@Body() { username, password }: TokenData, @Res() response: Response) {
        this.#logger.debug('token: username=%s', username);

        const result = await this.#keycloakService.token({
            username,
            password,
        });
        if (result === undefined) {
            return response.sendStatus(HttpStatus.UNAUTHORIZED);
        }

        return response.json(result).send();
    }

    /**
     * Endpunkt zur Erneuerung eines Zugriffstokens mithilfe eines Refresh-Tokens.
     * 
     * @param {Refresh} body - Objekt mit dem Refresh-Token.
     * @param {Response} response - Die HTTP-Antwort.
     * @returns {Promise<Response>} Die aktualisierte Token-Antwort oder ein Fehlerstatus.
     */
    @Post(paths.refresh)
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
    @ApiOperation({ summary: 'Refresh für vorhandenen Token' })
    @ApiOkResponse({ description: 'Erfolgreich aktualisiert.' })
    @ApiUnauthorizedResponse({ description: 'Ungültiger Token.' })
    async refresh(@Body() body: Refresh, @Res() response: Response) {
        // eslint-disable-next-line camelcase, @typescript-eslint/naming-convention
        const { refresh_token } = body;
        this.#logger.debug('refresh: refresh_token=%s', refresh_token);

        const result = await this.#keycloakService.refresh(refresh_token);
        if (result === undefined) {
            return response.sendStatus(HttpStatus.UNAUTHORIZED);
        }

        return response.json(result).send();
    }
}
