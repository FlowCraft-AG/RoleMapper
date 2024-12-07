/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @stylistic/indent */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { EntityDocument } from '../model/entity/entities.entity.js';
import { DataInput, GetData } from '../model/input/data.input.js';
import { DataPayload } from '../model/payload/data.payload.js';
import { EntityCategory } from '../model/types/entity-category.type.js';
import { ReadService } from '../service/read.service.js';
import { HttpExceptionFilter } from '../utils/http-exception.filter.js';

/**
 * Resolver für die `RoleMapper`-Entität, der GraphQL-Abfragen verarbeitet und die entsprechenden Daten
 * vom `ReadService` an den Client zurückgibt.
 *
 * Verwendet Filter und Interceptoren für Fehlerbehandlung und Zeitprotokollierung.
 */
@Resolver('RoleMapper')
@UseFilters(HttpExceptionFilter) // Fehlerbehandlung über HttpExceptionFilter
@UseInterceptors(ResponseTimeInterceptor) // Interceptor für Antwortzeitmessung
export class QueryResolver {
    readonly #service: ReadService; // Service, der für die Datenabfragen zuständig ist
    readonly #logger = getLogger(QueryResolver.name); // Logger für den Resolver

    /**
     * Konstruktor für den QueryResolver, der den ReadService injiziert.
     *
     * @param service - Der Service, der für die Datenabfragen zuständig ist.
     */
    constructor(service: ReadService) {
        this.#service = service;
    }

    /**
     * Führt eine Abfrage aus, um die Rollen eines Prozesses zu erhalten.
     *
     * Diese Methode ruft die Methode `findProcessRoles` des `ReadService` auf, um die Rollen
     * eines bestimmten Prozesses und die zugehörigen Benutzer zu erhalten.
     *
     * @param {string} processId - Die ID des Prozesses.
     * @param {string} userId - Die ID des Benutzers, der die Anfrage stellt.
     * @returns {Promise<any>} - Die Rollen des Prozesses.
     * @throws {NotFoundException} - Wenn der Prozess oder der Benutzer nicht gefunden werden kann.
     */
    @Query('getProcessRoles')
    @Public() // Kennzeichnet die Abfrage als öffentlich zugänglich
    async getRole(
        @Args('processId') processId: string, // Prozess-ID aus den GraphQL-Argumenten
        @Args('userId') userId: string, // Benutzer-ID aus den GraphQL-Argumenten
    ): Promise<any> {
        this.#logger.debug(`getRole: processId=${processId}, userId=${userId}`);
        return this.#service.findProcessRoles(processId, userId); // Aufruf der Service-Methode
    }

    /**
     * Führt eine dynamische Abfrage für beliebige Entitäten mit flexiblen Filtern aus.
     *
     * Diese Methode verwendet das `ReadService`, um Entitätsdaten basierend auf den angegebenen
     * Filtern und der Paginierung abzufragen. Sie unterstützt die flexible Abfrage von
     * verschiedenen Entitäten wie Benutzer, Prozesse, Rollen usw.
     *
     * @param {DataInput<T>} input - Die Eingabedaten, die die Entität, Filter und Paginierung enthalten.
     * @returns {Promise<DataPayload<GetData<T>>>} - Die gefilterten und paginierten Daten.
     * @throws {BadRequestException} - Wenn die angeforderte Entität nicht unterstützt wird.
     */
    @Query('getData')
    @Public() // Kennzeichnet die Abfrage als öffentlich zugänglich
    async getEntityData<T extends EntityCategory>(
        @Args('input') input: DataInput<T>, // Eingabedaten, die die Entität, Filter und Paginierung enthalten
    ): Promise<DataPayload<GetData<T>>> {
        this.#logger.debug('getEntityData: input=%o', input);

        const { entity, filters, pagination } = input; // Extrahiere Eingabewerte

        // Abruf der Rohdaten mit den angegebenen Filtern und Paginierung
        const rawData = await this.#service.findData(entity, filters, pagination);
        if (rawData === undefined || rawData.length === 0) {
            this.#logger.warn('Keine Daten gefunden für die Anfrage.');
            return {
                data: [],
                totalCount: 0,
            };
        }

        // Typensicherheit verbessern und den Zugriff auf Dokumente verfeinern
        const data = rawData.map((item) => {
            // Typprüfung auf ein Mongoose-Dokument durchführen
            if ('_doc' in item && Boolean(item._doc)) {
                // Hier wird das Mongoose-Dokument sicher ausgelesen
                const sanitizedItem = item._doc as EntityDocument;
                return {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    __typename: this.resolveTypeName(entity),
                    ...sanitizedItem,
                };
            }

            // Falls '_doc' nicht vorhanden ist, direkt das Item zurückgeben
            return {
                typeName: this.resolveTypeName(entity),
                ...(item as EntityDocument),
            };
        });

        // Anwendung der Paginierung, wenn angegeben
        const paginatedData = pagination
            ? data.slice(
                  (pagination.offset ?? 0) || 0,
                  ((pagination.offset ?? 0) || 0) + (pagination.limit ?? 0),
              )
            : data;

        // Rückgabe der strukturierten Daten mit Paginierung und Gesamtzahl
        return {
            data: paginatedData as unknown as GetData<T>[], // Typumwandlung
            totalCount: rawData.length,
        };
    }

    /**
     * Bestimmt den richtigen Typnamen basierend auf der Entität.
     *
     * Diese Methode gibt den entsprechenden Typnamen für eine bestimmte Entität zurück,
     * um diesen in der GraphQL-Antwort zu verwenden.
     *
     * @param {EntityCategory} entity - Die Entität (z. B. `USERS`, `FUNCTIONS`).
     * @returns {string} - Der entsprechende Typname für die Entität.
     * @throws {Error} - Wenn eine unbekannte Entität angegeben wird.
     */
    private resolveTypeName(entity: EntityCategory): string {
        switch (entity) {
            case 'USERS': {
                return 'User';
            }
            case 'FUNCTIONS': {
                return 'Function';
            }
            case 'PROCESSES': {
                return 'Process';
            }
            case 'ORG_UNITS': {
                return 'OrgUnit';
            }
            case 'ROLES': {
                return 'Role';
            }
        }
    }
}
