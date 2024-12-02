import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Query,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from 'nest-keycloak-connect';
import { paths } from '../../config/paths.js';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { type FilterDTO } from '../model/dto/filter.dto.js';
import { SUPPORTED_ENTITIES, SupportedEntities } from '../model/entity/entities.entity.js';
import { User } from '../model/entity/user.entity.js';
import { ReadService } from '../service/read.service.js';
import { getBaseUri } from '../utils/getBaseUri.js';

/** href-Link für HATEOAS */
export type Link = {
    /** href-Link für HATEOAS-Links */
    readonly href: string;
};

/** Links für HATEOAS */
export type Links = {
    /** self-Link */
    readonly self: Link;
    /** Optionaler Linke für list */
    readonly list?: Link;
    /** Optionaler Linke für add */
    readonly add?: Link;
    /** Optionaler Linke für update */
    readonly update?: Link;
    /** Optionaler Linke für remove */
    readonly remove?: Link;
    readonly antragsteller?: Link;
    readonly vorgesetzter?: Link;
};

export interface RolePayload {
    roles: RoleResult[];
    _links?: Links;
}

/**
 * Interface für die Rückgabe einzelner Rollen und deren Benutzer.
 */
export interface RoleResult {
    /**
     * Dynamischer Rollenname (z.B. "Antragssteller").
     */
    roleName: string;
    /**
     * Benutzer, die dieser Rolle zugeordnet sind.
     */
    users: User[];
}

/**
 * Interface für die Rückgabe einzelner Rollen und deren Benutzer.
 */
export interface RoleResult {
    /**
     * Dynamischer Rollenname (z.B. "Antragssteller").
     */
    roleName: string;
    /**
     * Benutzer, die dieser Rolle zugeordnet sind.
     */
    users: User[];
}

/**
 * Controller für Leseoperationen.
 */
@ApiTags('Role Mapper REST-API')
@Controller(paths.roleMapper)
@ApiBearerAuth()
@UseInterceptors(ResponseTimeInterceptor)
export class ReadController {
    readonly #logger = getLogger(ReadService.name);
    readonly #service: ReadService;

    constructor(readService: ReadService) {
        this.#service = readService;
    }

    /**
     * Führt eine Abfrage aus, um die Rollen eines Prozesses zu erhalten.
     * @param {string} processId - Die ID des Prozesses.
     * @param {string} userId - Die ID des Benutzers.
     * @returns {Promise<RolePayload>} - Die Rollen des Prozesses.
     */
    @Get(paths.processRoles)
    @Public()
    @ApiOperation({
        summary: 'Lese die Rollen eines Prozesses.',
        description:
            'Gibt die Rollen zurück, die einem Benutzer in einem spezifischen Prozess zugeordnet sind.',
    })
    @ApiOkResponse({
        description: 'Die Rollen wurden erfolgreich gefunden.',
        schema: {
            example: {
                roles: [
                    {
                        roleName: 'Antragssteller',
                        users: [{ userId: 'DA0001', name: 'Max Mustermann' }],
                    },
                ],
            },
        },
    })
    @ApiBadRequestResponse({ description: 'Ungültige Parameter.' })
    @ApiQuery({
        name: 'processId',
        required: true,
        description: 'Die ID des Prozesses.',
        example: 'DA0001',
    })
    @ApiQuery({
        name: 'userId',
        required: true,
        description: 'Die ID des Benutzers.',
        example: 'muud0001',
    })
    async getProcessRoles(
        @Query('processId') processId: string,
        @Query('userId') userId: string,
        @Req() req: Request,
    ): Promise<RolePayload> {
        const baseUri = getBaseUri(req);
        this.#logger.debug('getProcessRoles: processId=%s, userId=%s', processId, userId);

        const rolePayload: RolePayload = await this.#service.findProcessRoles(processId, userId);

        return {
            ...rolePayload,
            _links: {
                self: {
                    href: `${baseUri}/${paths.processRoles}?processId=${processId}&userId=${userId}`,
                },
                antragsteller: {
                    href: `${baseUri}/${SUPPORTED_ENTITIES[0]}/${paths.data}?field=userId&operator=EQ&value=${userId}`,
                },
            },
        };
    }

    /**
     * Dynamische Abfrage für beliebige Entitäten mit flexiblen Filtern.
     * @param {string} collection - Die Ziel-Entität (z. B. USERS, FUNCTIONS).
     * @param {FilterDTO} filter - Die Filterbedingungen.
     * @returns {Promise<any[]>} - Die gefilterten Daten.
     * @throws {BadRequestException} - Wenn die Entität nicht unterstützt wird.
     */
    @Get(`:entity/${paths.data}`)
    @Public()
    @ApiOperation({
        summary: 'Führt eine Abfrage für eine Collection mit Filtern aus.',
        description: 'Liest Daten aus einer angegebenen Collection mit optionalen Filtern.',
    })
    @ApiResponse({
        status: 200,
        description: 'Die Daten wurden erfolgreich abgefragt.',
        schema: {
            example: [
                {
                    _id: '6740a584f3e876cdd20d8654',
                    functionName: 'Dekan IWI',
                    type: 'dekan',
                    orgUnit: '6745da29a586857aa17d76d0',
                    users: ['nefr0002'],
                },
            ],
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Nicht unterstützte Entität oder ungültige Filterparameter.',
    })
    @ApiParam({
        name: 'collection',
        required: true,
        description: 'Die Ziel-Entität, z. B. USERS, FUNCTIONS, PROCESSES.',
        example: 'USERS',
    })
    async getData(@Param('entity') collection: string, @Query() filter: FilterDTO): Promise<any[]> {
        this.validateEntity(collection);
        this.#logger.debug('getData: collection=%s, filter=%o', collection, filter);

        return await this.#service.findData(collection, filter);
    }

    /**
     * Validiert, ob die angegebene Entität unterstützt wird.
     * @param {string} collection - Die zu validierende Entität.
     * @throws {BadRequestException} - Wenn die Entität nicht unterstützt wird.
     */
    private validateEntity(collection: string): void {
        if (!SUPPORTED_ENTITIES.includes(collection as SupportedEntities)) {
            throw new BadRequestException(
                `Nicht unterstützte Entität: ${collection}. Unterstützte Entitäten sind: ${SUPPORTED_ENTITIES.join(', ')}`,
            );
        }
    }
}
