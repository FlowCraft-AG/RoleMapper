/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
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
import { EntityCategoryType } from '../model/entity/entities.entity.js';
import { FilterInput } from '../model/input/filter.input.js';
import { DataPayload, DataResult } from '../model/payload/data.payload.js';
import { RolePayload } from '../model/payload/role-payload.type.js';
import { FilterField, FilterOperator } from '../model/types/filter.type.js';
import { Link, Links } from '../model/types/link.type.js';
import { ReadService } from '../service/read.service.js';
import { getBaseUri } from '../utils/uri-helper.js';

const DEFAULT_LIMIT = 10;

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
 * @param {string} collection - Die Ziel-Entität (z. B. USERS, MANDATES).
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

        // Abrufen der Rollen
        const rolePayload: RolePayload = await this.#service.findProcessRoles(processId, userId);

        // HATEOAS-Links hinzufügen
        rolePayload._links = this.#createHateoasLinks(baseUri, rolePayload, processId, userId);
        return rolePayload;
    }

    /**
     * Dynamische Abfrage für beliebige Entitäten mit flexiblen Filtern.
     * @param {string} entityType - Die Ziel-Entität (z. B. USERS, MANDATES).
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
        description: 'Die Ziel-Entität, z. B. USERS, MANDATES, PROCESSES.',
        example: 'USERS',
    })
    async getData(
        @Req() request: Request,
        @Param('entity') entityType: EntityCategoryType,
        @Query('field') field?: FilterField,
        @Query('operator') operator?: FilterOperator,
        @Query('value') value?: string,
        @Query('limit') limit = DEFAULT_LIMIT, // Standardwert für limit
        @Query('offset') offset = 0, // Standardwert für offset
    ): Promise<DataPayload> {
        const baseUri = getBaseUri(request);
        this.#logger.debug('getData: baseUri=%s', baseUri);
        this.#logger.debug(
            'getEntityData: entity=%s, field=%s, operator=%s, value=%s, limit=%s, offset=%s',
            entityType,
            field,
            operator,
            value,
            limit,
            offset,
        );

        if (!entityType) {
            throw new BadRequestException('Entity parameter is required.');
        }

        // Erstellen von Filtern, wenn field, operator und value angegeben sind
        // Filter erstellen, falls notwendig
        // eslint-disable-next-line @stylistic/operator-linebreak
        const filters: FilterInput[] =
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            field && operator && value ? [{ field, operator, value }] : [];

        const pagination = { limit, offset };

        // Abrufen der Daten
        const rawData = await this.#service.findData(entityType, filters, pagination);

        // Prüfen, ob Daten vorhanden sind
        if (rawData === undefined || rawData.length === 0) {
            this.#logger.warn('Keine Daten gefunden für die Anfrage.');
            return { datas: [], totalCount: 0 };
        }

        // Erstellen von Self-Links für jedes Objekt
        // Strukturierte Ergebnisse mit Self-Links erstellen
        const dataWithLinks: DataResult[] = rawData.map((item) => ({
            data: item,
            _links: {
                self: {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    href: `${baseUri}?field=_id&operator=EQ&value=${item._id}`,
                } as Link,
            },
        }));

        this.#logger.debug('getData: data=%o, totalCount=%s', dataWithLinks, rawData.length);

        return {
            datas: dataWithLinks,
            totalCount: rawData.length,
        };
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
        this.#logger.debug(
            '#createHateoasLinks: baseUri=%s, processId=%s, userId=%s',
            baseUri,
            processId,
            userId,
        );
        const links: Links = {
            self: {
                href: `${baseUri}/process-roles?processId=${processId}&userId=${userId}`,
            },
        };

        // Iteriere über alle Rollen im Payload
        for (const role of rolePayload.roles) {
            const roleLinkName = role.roleName;
            this.#logger.debug('#createHateoasLinks: roleLinkName=%s', roleLinkName);
            // Erstelle den Link für die gesamte Rolle
            if (!links[roleLinkName]) {
                links[roleLinkName] = {};
            }

            // Iteriere über alle Benutzer in der Rolle
            for (const user of role.users) {
                this.#logger.debug('#createHateoasLinks: user=%o', user);
                const userLinkName = user.user?.userId; // Verwende die userId als Schlüssel
                this.#logger.debug('#createHateoasLinks: userLinkName=%s', userLinkName);
                // Füge den Link für den Benutzer hinzu
                if (!(links[roleLinkName] as Record<string, Link>)[userLinkName]) {
                    (links[roleLinkName] as Record<string, Link>)[userLinkName] = {
                        href: `${baseUri}/USERS/data?field=userId&operator=EQ&value=${user.user?.userId}`,
                    };
                }
            }
        }
        return links;
    }
}
