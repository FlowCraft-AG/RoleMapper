import { UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { BadUserInputError } from '../../role-mapper/error/errors.js';
import { KeycloakService } from './keycloak.service.js';

/** Typdefinition für Token-Daten bei GraphQL */
export type TokenInput = {
    /** Benutzername */
    readonly username: string;
    /** Passwort */
    readonly password: string;
};

/** Typdefinition für Refresh-Daten bei GraphQL */
export type RefreshInput = {
    /** Refresh Token */
    readonly refreshToken: string;
};

@Resolver()
@UseInterceptors(ResponseTimeInterceptor)
export class TokenResolver {
    readonly #keycloakService: KeycloakService;

    readonly #logger = getLogger(TokenResolver.name);

    constructor(keycloakService: KeycloakService) {
        this.#keycloakService = keycloakService;
    }

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
