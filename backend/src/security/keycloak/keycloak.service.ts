/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable camelcase, @typescript-eslint/naming-convention */

import { Injectable } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse, type RawAxiosRequestHeaders } from 'axios';
import {
    type KeycloakConnectOptions,
    type KeycloakConnectOptionsFactory,
} from 'nest-keycloak-connect';
import { keycloakConnectOptions, paths } from '../../config/keycloak.js';
import { getLogger } from '../../logger/logger.js';

const { authServerUrl, clientId, secret } = keycloakConnectOptions;

/** Typdefinition für Eingabedaten zu einem Token. */
export type TokenData = {
    readonly username: string | undefined;
    readonly password: string | undefined;
};

@Injectable()
export class KeycloakService implements KeycloakConnectOptionsFactory {
    readonly #headers: RawAxiosRequestHeaders;
    readonly #headersAuthorization: RawAxiosRequestHeaders;

    readonly #keycloakClient: AxiosInstance;

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
            // ggf. httpsAgent fuer HTTPS bei selbst-signiertem Zertifikat
        });
        // this.#logger.debug('keycloakClient=%o', this.#keycloakClient.defaults);
    }

    createKeycloakConnectOptions(): KeycloakConnectOptions {
        return keycloakConnectOptions;
    }

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
                // { headers: this.#headersBasic },
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

    #logPayload(response: AxiosResponse<Record<string, string | number>>) {
        const { access_token } = response.data;
        // Payload ist der mittlere Teil zwischen 2 Punkten und mit Base64 codiert
        const [, payloadString] = (access_token as string).split('.');

        // Base64 decodieren
        if (payloadString === undefined) {
            return;
        }
        const payloadDecoded = atob(payloadString);

        // JSON-Objekt fuer Payload aus dem decodierten String herstellen
        const payload = JSON.parse(payloadDecoded);

        /**
         *  Mit RoleMapper client ID
         */

        // const { azp, exp, resource_access } = payload;
        // this.#logger.debug('#logPayload: exp=%s', exp);
        // const { roles } = resource_access[azp]; // eslint-disable-line security/detect-object-injection

        /**
         *  Mit Camunda client ID
         */
        const { exp, realm_access } = payload;
        this.#logger.debug('#logPayload: exp=%s', exp);

        const { roles } = realm_access;
        this.#logger.debug('#logPayload: roles=%o', roles);
    }
}
/* eslint-enable camelcase, @typescript-eslint/naming-convention */
