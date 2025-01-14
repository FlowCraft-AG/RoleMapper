/**
 * @file token.resolver.ts
 * @description GraphQL-Resolver für Authentifizierungs- und Autorisierungsfunktionen.
 * Beinhaltet Mutationen für die Authentifizierung und Token-Aktualisierung.
 * @module TokenResolver
 */

import { UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { BadUserInputError } from '../../role-mapper/error/errors.js';
import { KeycloakService } from './keycloak.service.js';

/**
 * @typedef TokenInput
 * @description Eingabedaten für die Authentifizierung via GraphQL.
 * @property {string} username - Der Benutzername für die Anmeldung.
 * @property {string} password - Das Passwort für die Anmeldung.
 */
export type TokenInput = {
    /** Benutzername */
    readonly username: string;
    /** Passwort */
    readonly password: string;
};

/**
 * @typedef RefreshInput
 * @description Eingabedaten für die Aktualisierung eines Tokens via GraphQL.
 * @property {string} refreshToken - Das Refresh-Token für die Token-Aktualisierung.
 */
export type RefreshInput = {
    /** Refresh Token */
    readonly refreshToken: string;
};

/**
 * @class TokenResolver
 * @description Resolver für Authentifizierungs- und Autorisierungsoperationen.
 */
@Resolver()
@UseInterceptors(ResponseTimeInterceptor)
export class TokenResolver {
    /** Instanz des KeycloakService zur Verarbeitung von Token-Operationen. */
    readonly #keycloakService: KeycloakService;

    /** Logger für Debugging und Fehlerprotokollierung. */
    readonly #logger = getLogger(TokenResolver.name);

    constructor(keycloakService: KeycloakService) {
        this.#keycloakService = keycloakService;
    }

    /**
     * Mutation zur Authentifizierung eines Benutzers mit Benutzername und Passwort.
     * 
     * @param {TokenInput} param0 - Objekt mit Benutzername und Passwort.
     * @returns {Promise<Record<string, unknown>>} Das generierte Token oder eine Fehlermeldung.
     * @throws {BadUserInputError} Wenn die Anmeldedaten ungültig sind.
     */
    @Mutation('authenticate')
    @Public()
    async token(@Args() { username, password }: TokenInput) {
        this.#logger.debug('token: username=%s', username);

        const result = await this.#keycloakService.token({
            username,
            password,
        });
        if (result === undefined) {
            throw new BadUserInputError('Falscher Benutzername oder falsches Passwort');
        }

        this.#logger.debug('token: result=%o', result);
        return result;
    }

    /**
     * Mutation zur Aktualisierung eines Zugriffstokens mithilfe eines Refresh-Tokens.
     * 
     * @param {RefreshInput} input - Objekt mit dem Refresh-Token.
     * @returns {Promise<Record<string, unknown>>} Das aktualisierte Token oder eine Fehlermeldung.
     * @throws {BadUserInputError} Wenn das Refresh-Token ungültig ist.
     */
    @Mutation('refreshToken')
    @Public()
    async refresh(@Args() input: RefreshInput) {
        this.#logger.debug('refresh: refreshToken=%o', input);

        const { refreshToken } = input;

        const result = await this.#keycloakService.refresh(refreshToken);
        if (result === undefined) {
            throw new BadUserInputError('Falscher Token');
        }

        this.#logger.debug('refresh: result=%o', result);
        return result;
    }
}
