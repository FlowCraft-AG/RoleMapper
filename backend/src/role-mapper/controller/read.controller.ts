// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable security/detect-object-injection */
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
import { type FilterInputDTO } from '../model/dto/filter.dto.js';
import { SUPPORTED_ENTITIES, SupportedEntities } from '../model/entity/entities.entity.js';
import { Link, Links } from '../model/types/link.type.js';
import { RolePayload } from '../model/types/role-payload.type.js';
import { ReadService } from '../service/read.service.js';
import { getBaseUri } from '../utils/uri-helper.js';

/**
 * Controller für Leseoperationen.
 */
/**
 * @class ReadController
 * @description Controller für das Lesen von Rollen und Daten in der Role Mapper REST-API.
 *
 * @constructor
 * @param {ReadService} readService - Der Service, der für das Lesen von Rollen und Daten verwendet wird.
 *
 * @method getProcessRoles
 * @description Führt eine Abfrage aus, um die Rollen eines Prozesses zu erhalten.
 * @param {string} processId - Die ID des Prozesses.
 * @param {string} userId - Die ID des Benutzers.
 * @param {Request} request - Das HTTP-Request-Objekt.
 * @returns {Promise<RolePayload>} - Die Rollen des Prozesses.
 *
 * @method getData
 * @description Dynamische Abfrage für beliebige Entitäten mit flexiblen Filtern.
 * @param {string} collection - Die Ziel-Entität (z. B. USERS, FUNCTIONS).
 * @param {FilterInputDTO} filter - Die Filterbedingungen.
 * @returns {Promise<any[]>} - Die gefilterten Daten.
 * @throws {BadRequestException} - Wenn die Entität nicht unterstützt wird.
 *
 * @method validateEntity
 * @description Validiert, ob die angegebene Entität unterstützt wird.
 * @param {string} collection - Die zu validierende Entität.
 * @throws {BadRequestException} - Wenn die Entität nicht unterstützt wird.
 *
 * @method #createHateoasLinks
 * @description Diese Funktion erstellt HATEOAS-Links basierend auf den RoleNames im RolePayload.
 * Sie fügt Links für jede Rolle in _links hinzu, um die Navigation zu ermöglichen.
 * @param {string} baseUri - Die Basis-URL, die zur Erstellung der Links verwendet wird.
 * @param {RolePayload} rolePayload - Die Payload mit den Rollen und Benutzerdaten.
 * @param {string} processId - Die Prozess-ID, die zur Erstellung der Links verwendet wird.
 * @param {string} userId - Die Benutzer-ID, die zur Erstellung der Links verwendet wird.
 * @returns {Links} - Ein RolePayload-Objekt mit hinzugefügten HATEOAS-Links.
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
        @Req() request: Request,
    ): Promise<RolePayload> {
        const baseUri = getBaseUri(request);
        this.#logger.debug('getProcessRoles: processId=%s, userId=%s', processId, userId);

        const rolePayload: RolePayload = await this.#service.findProcessRoles(processId, userId);
        rolePayload._links = this.#createHateoasLinks(baseUri, rolePayload, processId, userId);
        return rolePayload;
    }

    /**
     * Dynamische Abfrage für beliebige Entitäten mit flexiblen Filtern.
     * @param {string} collection - Die Ziel-Entität (z. B. USERS, FUNCTIONS).
     * @param {FilterInputDTO} filter - Die Filterbedingungen.
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
    async getData(@Param('entity') collection: string, @Query() filter: FilterInputDTO) {
        this.validateEntity(collection);
        this.#logger.debug('getData: collection=%s, filter=%o', collection, filter);

        // return await this.#service.findData(collection, filter);
        return [];
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

    /**
     * Diese Funktion erstellt HATEOAS-Links basierend auf den RoleNames im RolePayload.
     * Sie fügt Links für jede Rolle in _links hinzu, um die Navigation zu ermöglichen.
     * @param baseUri Die Basis-URL, die zur Erstellung der Links verwendet wird.
     * @param rolePayload Die Payload mit den Rollen und Benutzerdaten.
     * @param processId Die Prozess-ID, die zur Erstellung der Links verwendet wird.
     * @param userId Die Benutzer-ID, die zur Erstellung der Links verwendet wird.
     * @returns Ein RolePayload-Objekt mit hinzugefügten HATEOAS-Links.
     */
    #createHateoasLinks(
        baseUri: string,
        rolePayload: RolePayload,
        processId: string,
        userId: string,
    ): Links {
        const links: Links = {
            self: {
                href: `${baseUri}/process-roles?processId=${processId}&userId=${userId}`,
            },
        };

        // Iteriere über alle Rollen im Payload
        for (const role of rolePayload.roles) {
            const roleLinkName = role.roleName.toLowerCase();
            this.#logger.debug('roleLinkName=%s', roleLinkName);

            // Erstelle den Link für die gesamte Rolle
            if (!links[roleLinkName]) {
                links[roleLinkName] = {};
            }
            this.#logger.debug('roleLinkName=%s', roleLinkName);

            // Iteriere über alle Benutzer in der Rolle
            for (const user of role.users) {
                const userLinkName = user.userId; // Verwende die userId als Schlüssel
                this.#logger.debug('userLinkName=%s', userLinkName);

                // Füge den Link für den Benutzer hinzu
                if (!(links[roleLinkName] as Record<string, Link>)[userLinkName]) {
                    (links[roleLinkName] as Record<string, Link>)[userLinkName] = {
                        href: `${baseUri}/USERS/data?field=userId&operator=EQ&value=${user.userId}`,
                    };
                }
            }
        }

        return links;
    }
}
