import { UseFilters, UseInterceptors } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
// import { FilterInputDTO } from '../model/dto/filter.dto.js';
// import { SupportedEntities } from '../model/entity/entities.entity.js';
import { MandateDocument } from '../model/entity/mandates.entity.js';
import { OrgUnitDocument } from '../model/entity/org-unit.entity.js';
import { ProcessDocument } from '../model/entity/process.entity.js';
import { RoleDocument } from '../model/entity/roles.entity.js';
import { UserDocument } from '../model/entity/user.entity.js';
import { DataInput, GetData } from '../model/input/data.input.js';
import { DataPayload } from '../model/payload/data.payload.js';
import { EntityCategory } from '../model/types/entity-category.type.js';
import { ReadService } from '../service/read.service.js';
import { HttpExceptionFilter } from '../utils/http-exception.filter.js';

export type MongooseDocument = {
    _doc?: any;
};

@Resolver('RoleMapper')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseTimeInterceptor)
export class QueryResolver {
    readonly #service: ReadService;
    readonly #logger = getLogger(QueryResolver.name);

    constructor(service: ReadService) {
        this.#service = service;
    }

    /**
     * Führt eine Abfrage aus, um die Rollen eines Prozesses zu erhalten.
     * @param {string} processId - Die ID des Prozesses.
     * @param {string} userId - Die ID des Benutzers.
     * @returns {Promise<any>} - Die Rollen des Prozesses.
     */
    @Query('getProcessRoles')
    @Public()
    async getRole(
        @Args('processId') processId: string,
        @Args('userId') userId: string,
    ): Promise<any> {
        this.#logger.debug(`getRole: processId=${processId}, userId=${userId}`);
        return this.#service.findProcessRoles(processId, userId);
    }

    /**
     * Dynamische Abfrage für beliebige Entitäten mit flexiblen Filtern.
     * @param {SupportedEntities} entity - Die Ziel-Entität (z. B. USERS, FUNCTIONS).
     * @param {FilterInputDTO} [filters] - Dynamische Filterkriterien.
     * @returns {Promise<any[]>} - Die gefilterten Daten.
     * @throws {BadRequestException} - Wenn die Entität nicht unterstützt wird.
     */
    // @Query(() => [Object])
    // @Public()
    // async getDataORIG(
    //     @Args('entity') entity: SupportedEntities,
    //     @Args('filters') filters: FilterInputDTO,
    // ): Promise<any[]> {
    //     try {
    //         this.#logger.debug('getData: entity=%s, filters=%o', entity, filters);
    //         return await this.#service.findData(entity, filters);
    //     } catch (error) {
    //         this.#logger.error(`getData: Fehler bei der Verarbeitung von ${entity}`, error);
    //         throw new BadRequestException(`Fehler bei der Verarbeitung von ${entity}`);
    //     }
    // }

    /**
     * Abfrage: Führt eine generische Entitätsabfrage aus.
     */
    @Query('getData')
    @Public()
    async getEntityData<T extends EntityCategory>(
        @Args('input') input: DataInput<T>,
    ): Promise<DataPayload<GetData<T>>> {
        this.#logger.debug('getEntityData: input=%o', input);

        // Extrahiere Eingabewerte
        const { entity, filters, pagination } = input;

        // Daten abfragen
        const rawData = await this.#service.findData(entity, filters, pagination);
        if (!rawData || rawData.length === 0) {
            this.#logger.warn('Keine Daten gefunden für die Anfrage.');
            return {
                data: [],
                totalCount: 0,
            };
        }

        // Füge `__typename` basierend auf der Entity hinzu
        const data = rawData.map(
            (
                item:
                    | UserDocument
                    | MandateDocument
                    | ProcessDocument
                    | RoleDocument
                    | OrgUnitDocument,
            ) => {
                // Extrahiere das `_doc`-Attribut, falls es existiert
                const sanitizedItem = '_doc' in item ? (item as any)._doc : item;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return {
                    __typename: this.resolveTypeName(entity),
                    ...sanitizedItem, // Nutze die gereinigten Daten
                };
            },
        );

        // Optional: Paginierung anwenden
        const paginatedData = pagination
            ? data.slice(
                  pagination.offset || 0,
                  (pagination.offset || 0) + (pagination.limit || 10),
              )
            : data;

        // Rückgabewert strukturieren
        return {
            data: paginatedData as unknown as GetData<T>[], // Explizites Typ-Casting
            totalCount: rawData.length,
        };
    }

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
            default: {
                this.#logger.error(`Unbekannte Entität: ${entity}`);
                throw new Error(`Unbekannte Entität: ${entity}`);
            }
        }
    }
}
