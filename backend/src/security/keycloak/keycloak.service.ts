/**
 * @file keycloak.service.ts
 * @description Implementierung eines Keycloak-Services für die Integration von Keycloak in eine NestJS-Anwendung.
 * Der Service umfasst Methoden zur Token-Generierung, Token-Aktualisierung und Log-Ausgabe des Payloads.
 * @module KeycloakService
 */

import { Injectable } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse, type RawAxiosRequestHeaders } from 'axios';
import {
    type KeycloakConnectOptions,
    type KeycloakConnectOptionsFactory,
} from 'nest-keycloak-connect';
import { keycloakConnectOptions, paths } from '../../config/keycloak.js';
import { getLogger } from '../../logger/logger.js';

const { authServerUrl, clientId, secret } = keycloakConnectOptions;

/** 
 * Typdefinition für Eingabedaten zu einem Token.
 * 
 * @typedef {Object} TokenData
 * @property {string | undefined} username - Der Benutzername für die Authentifizierung.
 * @property {string | undefined} password - Das Passwort für die Authentifizierung.
 */
export type TokenData = {
    readonly username: string | undefined;
    readonly password: string | undefined;
};

/**
 * @class KeycloakService
 * @implements {KeycloakConnectOptionsFactory}
 * @description Diese Klasse stellt Methoden zur Kommunikation mit dem Keycloak-Server bereit, einschließlich
 * Token-Erstellung, Token-Aktualisierung und Optionen für die KeycloakConnect-Integration.
 */
@Injectable()
export class KeycloakService implements KeycloakConnectOptionsFactory {
    /** Header für Token-Anfragen ohne Authentifizierung. */
    readonly #headers: RawAxiosRequestHeaders;
    /** Header für Token-Anfragen mit Basic Authentifizierung. */
    readonly #headersAuthorization: RawAxiosRequestHeaders;

    /** Axios-Instanz für HTTP-Anfragen an den Keycloak-Server. */
    readonly #keycloakClient: AxiosInstance;

    /** Logger-Instanz zur Ausgabe von Debug- und Warnmeldungen. */
    readonly #logger = getLogger(KeycloakService.name);

    constructor() {
        this.#headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const encoded = btoa(`${clientId}:${secret}`);
        this.#headersAuthorization = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${encoded}`,
        };

        this.#keycloakClient = axios.create({
            baseURL: authServerUrl!,
        });
    }

    /**
     * Erstellt und gibt die KeycloakConnect-Optionen zurück.
     * 
     * @returns {KeycloakConnectOptions} Die Konfigurationsoptionen für Keycloak.
     */
    createKeycloakConnectOptions(): KeycloakConnectOptions {
        return keycloakConnectOptions;
    }

    /**
     * Generiert ein Zugriffstoken basierend auf dem Benutzernamen und Passwort.
     * 
     * @param {TokenData} param0 - Die Eingabedaten für die Token-Generierung.
     * @returns {Promise<Record<string, number | string> | undefined>} Die Antwortdaten des Keycloak-Servers oder undefined im Fehlerfall.
     */
    async token({ username, password }: TokenData) {
        this.#logger.debug('token: username=%s', username);
        if (username === undefined || password === undefined) {
            return;
        }

        const body = `username=${username}&password=${password}&grant_type=password&client_id=${clientId}&client_secret=${secret}&scope=openid`;
        let response: AxiosResponse<Record<string, number | string>>;
        try {
            response = await this.#keycloakClient.post(paths.accessToken, body, {
                headers: this.#headers,
            });
        } catch {
            this.#logger.warn('token: Fehler bei %s', paths.accessToken);
            return;
        }

        this.#logPayload(response);
        this.#logger.debug('token: response.data=%o', response.data);
        return response.data;
    }

    /**
     * Aktualisiert ein Zugriffstoken mithilfe eines Refresh-Tokens.
     * 
     * @param {string | undefined} refresh_token - Das Refresh-Token.
     * @returns {Promise<Record<string, number | string> | undefined>} Die Antwortdaten des Keycloak-Servers oder undefined im Fehlerfall.
     */
    async refresh(refresh_token: string | undefined) {
        this.#logger.debug('refresh: refresh_token=%o', refresh_token);
        if (refresh_token === undefined) {
            return;
        }

        const body = `refresh_token=${refresh_token}&grant_type=refresh_token`;
        let response: AxiosResponse<Record<string, number | string>>;
        try {
            response = await this.#keycloakClient.post(
                paths.accessToken,
                body,
                { headers: this.#headersAuthorization },
            );
        } catch (error) {
            this.#logger.warn('err=%o', error);
            this.#logger.warn(
                'refresh: Fehler bei POST-Request: path=%s, body=%o',
                paths.accessToken,
                body,
            );
            return;
        }
        this.#logger.debug('refresh: response.data=%o', response.data);
        return response.data;
    }

    /**
     * Loggt den Payload eines Tokens.
     * 
     * @param {AxiosResponse<Record<string, string | number>>} response - Die Antwort des Keycloak-Servers mit dem Token-Payload.
     */
    #logPayload(response: AxiosResponse<Record<string, string | number>>) {
        const { access_token } = response.data;
        const [, payloadString] = (access_token as string).split('.');

        if (payloadString === undefined) {
            return;
        }
        const payloadDecoded = atob(payloadString);
        const payload = JSON.parse(payloadDecoded);

        const { exp, realm_access } = payload;
        this.#logger.debug('#logPayload: exp=%s', exp);

        const { roles } = realm_access;
        this.#logger.debug('#logPayload: roles=%o', roles);
    }
}
