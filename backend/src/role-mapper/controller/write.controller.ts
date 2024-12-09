import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Param,
    Post,
    Put,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Public } from 'nest-keycloak-connect';
import { paths } from '../../config/paths.js';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { UpdateEntityInput } from '../model/dto/update.dto.js';
import { EntityCategoryType } from '../model/entity/entities.entity.js';
import { CreateDataInput } from '../model/input/create.input.js';
import { FilterInput } from '../model/input/filter.input.js';
import { UpdateDataInput } from '../model/input/update.input.js';
import { MutationPayload } from '../model/payload/mutation.payload.js';
import { WriteService } from '../service/write.service.js';

@ApiTags('Role Mapper Write-API')
@Controller(paths.roleMapper)
@ApiBearerAuth()
@UseInterceptors(ResponseTimeInterceptor)
export class WriteController {
    readonly #logger = getLogger(WriteController.name);
    readonly #service: WriteService;
    constructor(writeService: WriteService) {
        this.#service = writeService;
    }

    /**
     * Erstellen einer neuen Entität.
     * @param entityType Die Zielentität (z.B. USERS, ROLES).
     * @param body Die zu erstellenden Daten.
     * @returns Erfolgs- oder Fehlermeldung.
     */
    @Post(':entity')
    @ApiOperation({
        summary: 'Erstellt eine neue Entität.',
        description: 'Erstellt eine neue Entität in der angegebenen Collection.',
    })
    @ApiParam({
        name: 'entity',
        required: true,
        description: 'Die Ziel-Entität, z.B. USERS, MANDATES, PROCESSES.',
        example: 'USERS',
    })
    @ApiBody({
        description: 'Daten für die neue Entität.',
    })
    @ApiResponse({
        status: 201,
        description: 'Die Entität wurde erfolgreich erstellt.',
    })
    @ApiResponse({
        status: 400,
        description: 'Ungültige Parameter oder Eingabedaten.',
    })
    @Public()
    async createEntity(
        @Param('entity') entityType: EntityCategoryType,
        @Body() body: CreateDataInput,
    ): Promise<MutationPayload> {
        if (!entityType || body === undefined) {
            throw new BadRequestException('Entity type and data are required.');
        }
        try {
            // Erstellung der Entität basierend auf der dynamischen Zuordnung
            const result = await this.#service.createEntity(entityType, body);

            // Rückgabe des Ergebnisses
            return {
                success: true,
                message: `Create operation successful.`,
                result,
            };
        } catch (error) {
            this.#logger.error('createEntity: Error occurred: %o', error);
            return {
                success: false,
                message: (error as Error).message,
                result: undefined,
            };
        }
    }

    /**
     * Aktualisieren einer bestehenden Entität.
     * @param entityType Die Zielentität.
     * @param body Die zu aktualisierenden Daten.
     * @returns Erfolgs- oder Fehlermeldung.
     */
    @Put(':entity')
    @Public()
    @ApiOperation({
        summary: 'Aktualisiert eine bestehende Entität.',
        description: 'Aktualisiert eine bestehende Entität in der angegebenen Collection.',
    })
    @ApiParam({
        name: 'entity',
        required: true,
        description: 'Die Ziel-Entität, z.B. USERS, MANDATES.',
        example: 'USERS',
    })
    @ApiBody({
        description: 'Daten für die Aktualisierung.',
    })
    @ApiResponse({
        status: 200,
        description: 'Die Entität wurde erfolgreich aktualisiert.',
    })
    @ApiResponse({
        status: 400,
        description: 'Ungültige Parameter oder Eingabedaten.',
    })
    async updateEntity(
        @Param('entity') entityType: EntityCategoryType,
        @Body() body: UpdateEntityInput,
    ): Promise<MutationPayload> {
        this.#logger.debug('updateEntity: input=%o', { entityType, body });
        if (!entityType || body === undefined) {
            throw new BadRequestException('Entity type and update data are required.');
        }
        try {
            const filters: FilterInput[] = body.filters;
            const data: UpdateDataInput | undefined = body.data;
            this.#logger.debug('updateEntity: filters=%o, data=%o', filters, data);
            const result = await this.#service.updateEntity(entityType, filters, data);
            return {
                success: result.success,
                message: result.message,
                affectedCount: result.modifiedCount,
            };
        } catch (error) {
            return {
                success: false,
                message: (error as Error).message,
                result: undefined,
            };
        }
    }

    /**
     * Löschen einer Entität.
     * @param entityType Die Zielentität.
     * @param body Die Filterkriterien für das Löschen.
     * @returns Erfolgs- oder Fehlermeldung.
     */
    @Delete(':entity')
    @Public()
    @ApiOperation({
        summary: 'Löscht eine Entität.',
        description: 'Löscht eine Entität basierend auf den angegebenen Kriterien.',
    })
    @ApiParam({
        name: 'entity',
        required: true,
        description: 'Die Ziel-Entität, z.B. USERS, ROLES.',
        example: 'USERS',
    })
    @ApiBody({
        description: 'Filterkriterien für das Löschen.',
    })
    @ApiResponse({
        status: 200,
        description: 'Die Entität wurde erfolgreich gelöscht.',
    })
    @ApiResponse({
        status: 400,
        description: 'Ungültige Parameter oder Filterkriterien.',
    })
    async deleteEntity(
        @Param('entity') entityType: EntityCategoryType,
        @Body() body: FilterInput[],
    ): Promise<MutationPayload> {
        this.#logger.debug('deleteEntity: input=%o', { entityType, body });
        if (!entityType || body === undefined) {
            throw new BadRequestException('Entity type and delete criteria are required.');
        }
        try {
            const result = await this.#service.deleteEntity(entityType, body);
            return {
                success: result.success,
                message: result.message,
                affectedCount: result.deletedCount,
            };
        } catch (error) {
            return {
                success: false,
                message: (error as Error).message,
                result: undefined,
            };
        }
    }
}
