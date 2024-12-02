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

/** Entity-Klasse für Token-Daten. */
export class TokenData {
    @ApiProperty({ example: 'admin', type: String })
    username: string | undefined;

    @ApiProperty({ example: 'p', type: String })
    password: string | undefined;
}

export class Refresh {
    /** Refresh Token */
    @ApiProperty({ example: 'alg.payload.signature', type: String })
    refresh_token: string | undefined; // eslint-disable-line @typescript-eslint/naming-convention, camelcase
}

@Controller(paths.auth)
@UseInterceptors(ResponseTimeInterceptor)
@ApiTags('Authentifizierung und Autorisierung')
export class TokenController {
    readonly #keycloakService: KeycloakService;

    readonly #logger = getLogger(TokenController.name);

    constructor(keycloakService: KeycloakService) {
        this.#keycloakService = keycloakService;
    }

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
