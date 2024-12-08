import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'nest-keycloak-connect';
// import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
// import { MutationInput } from '../model/dto/mutation.input.js';
// import { MutationPayload } from '../model/payload/mutation.payload.js';
// import { ReadService } from '../service/read.service.js';
// import { WriteService } from '../service/write.service.js';

/**
 * Controller für Schreiboperationen (CREATE, UPDATE, DELETE) auf Entitäten.
 *
 * @class
 * @classdesc Diese Klasse stellt Endpunkte für die Ausführung von Mutationen bereit.
 *
 * @example
 * // Beispiel für eine CREATE Operation
 * const input = {
 *   entity: 'MANDATES',
 *   operation: 'CREATE',
 *   data: {
 *     functionName: 'Macher',
 *     users: 'gyca1011',
 *     orgUnit: 'Stundent',
 *   },
 * };
 * const response = await writeController.executeData(input);
 *
 * @example
 * // Beispiel für eine UPDATE Operation
 * const input = {
 *   entity: 'MANDATES',
 *   operation: 'UPDATE',
 *   data: {
 *     functionName: 'IT Macher',
 *     users: ['gyca1011', 'kwin0101'],
 *     orgUnit: 'Stundent X',
 *   },
 *   filter: {
 *     field: 'functionName',
 *     operator: 'EQ',
 *     value: 'Macher',
 *   },
 * };
 * const response = await writeController.executeData(input);
 *
 * @example
 * // Beispiel für eine DELETE Operation
 * const input = {
 *   entity: 'MANDATES',
 *   operation: 'DELETE',
 *   data: {
 *     functionName: 'Macher',
 *     users: 'gyca1011',
 *     orgUnit: 'Stundent',
 *   },
 *   filter: {
 *     field: 'functionName',
 *     operator: 'EQ',
 *     value: 'IT Macher',
 *   },
 * };
 * const response = await writeController.executeData(input);
 *
 * @see {@link MutationInput}
 * @see {@link MutationPayload}
 */
/**
 * @swagger
 * tags:
 *   - name: Write
 *     description: Endpoints for performing mutations (CREATE, UPDATE, DELETE)
 *
 * @swagger
 * /:
 *   post:
 *     summary: Führt eine Mutation aus (CREATE, UPDATE, DELETE)
 *     description: Führt eine Mutation für eine angegebene Entität aus. Unterstützte Operationen sind: CREATE, UPDATE, DELETE.
 *     tags: [Write]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Eingabeparameter für die Mutation
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MutationInput'
 *           examples:
 *             create:
 *               summary: CREATE Operation
 *               value:
 *                 entity: 'MANDATES'
 *                 operation: 'CREATE'
 *                 data:
 *                   functionName: 'Macher'
 *                   users: 'gyca1011'
 *                   orgUnit: 'Stundent'
 *             update:
 *               summary: UPDATE Operation
 *               value:
 *                 entity: 'MANDATES'
 *                 operation: 'UPDATE'
 *                 data:
 *                   functionName: 'IT Macher'
 *                   users: ['gyca1011', 'kwin0101']
 *                   orgUnit: 'Stundent X'
 *                 filter:
 *                   field: 'functionName'
 *                   operator: 'EQ'
 *                   value: 'Macher'
 *             delete:
 *               summary: DELETE Operation
 *               value:
 *                 entity: 'MANDATES'
 *                 operation: 'DELETE'
 *                 data:
 *                   functionName: 'Macher'
 *                   users: 'gyca1011'
 *                   orgUnit: 'Stundent'
 *                 filter:
 *                   field: 'functionName'
 *                   operator: 'EQ'
 *                   value: 'IT Macher'
 *     responses:
 *       200:
 *         description: Erfolgreiche Mutation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MutationResponse'
 *             examples:
 *               create:
 *                 summary: Erfolgreiches CREATE
 *                 value:
 *                   success: true
 *                   message: 'CREATE Operation erfolgreich.'
 *                   result:
 *                     functionName: 'Macher'
 *                     users: ['gyca1011']
 *                     orgUnit: 'Stundent'
 *                     _id: '674b7fc8a348e76ef9eeb159'
 *                     __v: 0
 *               update:
 *                 summary: Erfolgreiches UPDATE
 *                 value:
 *                   success: true
 *                   message: 'UPDATE Operation erfolgreich.'
 *                   result:
 *                     acknowledged: true
 *                     modifiedCount: 1
 *                     upsertedId: null
 *                     upsertedCount: 0
 *                     matchedCount: 1
 *               delete:
 *                 summary: Erfolgreiches DELETE
 *                 value:
 *                   success: true
 *                   message: 'DELETE Operation erfolgreich.'
 *                   result:
 *                     acknowledged: true
 *                     deletedCount: 1
 *       400:
 *         description: Ungültige Eingabeparameter
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 summary: Ungültige Operation
 *                 value:
 *                   success: false
 *                   message: 'Nicht unterstützte Operation: INVALID_OPERATION'
 *                   result: null
 *       401:
 *         description: Nicht autorisiert
 *       500:
 *         description: Interner Serverfehler
 */
@ApiTags('Write')
@Controller()
@UseInterceptors(ResponseTimeInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class WriteController {
    // readonly #logger = getLogger(ReadService.name);
    // readonly #service: WriteService;
    // constructor(writeService: WriteService) {
    //     this.#service = writeService;
    // }
    // /**
    //  * Führt eine Mutation basierend auf den Eingabeparametern aus.
    //  *
    //  * @param {MutationInput} input - Die Eingabeparameter für die Mutation.
    //  * @returns {Promise<MutationPayload>} - Die Antwort der Mutation.
    //  */
    // @Post()
    // @Roles({ roles: ['admin'] })
    // @ApiOperation({
    //     summary: 'Führt eine Mutation aus (CREATE, UPDATE, DELETE)',
    //     description:
    //         'Führt eine Mutation für eine angegebene Entität aus. Unterstützte Operationen sind: CREATE, UPDATE, DELETE.',
    // })
    // @ApiBody({
    //     description: 'Eingabeparameter für die Mutation',
    //     type: MutationInput,
    //     examples: {
    //         create: {
    //             summary: 'CREATE Operation',
    //             value: {
    //                 entity: 'MANDATES',
    //                 operation: 'CREATE',
    //                 data: {
    //                     functionName: 'Macher',
    //                     users: 'gyca1011',
    //                     orgUnit: 'Stundent',
    //                 },
    //             },
    //         },
    //         update: {
    //             summary: 'UPDATE Operation',
    //             value: {
    //                 entity: 'MANDATES',
    //                 operation: 'UPDATE',
    //                 data: {
    //                     functionName: 'IT Macher',
    //                     users: ['gyca1011', 'kwin0101'],
    //                     orgUnit: 'Stundent X',
    //                 },
    //                 filter: {
    //                     field: 'functionName',
    //                     operator: 'EQ',
    //                     value: 'Macher',
    //                 },
    //             },
    //         },
    //         delete: {
    //             summary: 'DELETE Operation',
    //             value: {
    //                 entity: 'MANDATES',
    //                 operation: 'DELETE',
    //                 data: {
    //                     functionName: 'Macher',
    //                     users: 'gyca1011',
    //                     orgUnit: 'Stundent',
    //                 },
    //                 filter: {
    //                     field: 'functionName',
    //                     operator: 'EQ',
    //                     value: 'IT Macher',
    //                 },
    //             },
    //         },
    //     },
    // })
    // @ApiResponse({
    //     status: 200,
    //     description: 'Erfolgreiche Mutation',
    //     type: MutationPayload,
    //     examples: {
    //         create: {
    //             summary: 'Erfolgreiches CREATE',
    //             value: {
    //                 success: true,
    //                 message: 'CREATE Operation erfolgreich.',
    //                 result: {
    //                     functionName: 'Macher',
    //                     users: ['gyca1011'],
    //                     orgUnit: 'Stundent',
    //                     _id: '674b7fc8a348e76ef9eeb159',
    //                     // eslint-disable-next-line @typescript-eslint/naming-convention
    //                     __v: 0,
    //                 },
    //             },
    //         },
    //         update: {
    //             summary: 'Erfolgreiches UPDATE',
    //             value: {
    //                 success: true,
    //                 message: 'UPDATE Operation erfolgreich.',
    //                 result: {
    //                     acknowledged: true,
    //                     modifiedCount: 1,
    //                     upsertedId: undefined,
    //                     upsertedCount: 0,
    //                     matchedCount: 1,
    //                 },
    //             },
    //         },
    //         delete: {
    //             summary: 'Erfolgreiches DELETE',
    //             value: {
    //                 success: true,
    //                 message: 'DELETE Operation erfolgreich.',
    //                 result: {
    //                     acknowledged: true,
    //                     deletedCount: 1,
    //                 },
    //             },
    //         },
    //     },
    // })
    // @ApiResponse({
    //     status: 400,
    //     description: 'Ungültige Eingabeparameter',
    //     examples: {
    //         error: {
    //             summary: 'Ungültige Operation',
    //             value: {
    //                 success: false,
    //                 message: 'Nicht unterstützte Operation: INVALID_OPERATION',
    //                 result: undefined,
    //             },
    //         },
    //     },
    // })
    // @ApiResponse({
    //     status: 401,
    //     description: 'Nicht autorisiert',
    // })
    // @ApiResponse({
    //     status: 500,
    //     description: 'Interner Serverfehler',
    // })
    // async executeData(@Body() input: MutationInput): Promise<MutationPayload> {
    //     this.#logger.debug('executeData: input=%o', input);
    //     const { entity, operation, data, filter } = input;
    //     try {
    //         let result;
    //         switch (operation) {
    //             case 'CREATE': {
    //                 result = await this.#service.createEntity(entity, data);
    //                 break;
    //             }
    //             case 'UPDATE': {
    //                 result = await this.#service.updateEntity(entity, filter, data);
    //                 break;
    //             }
    //             case 'DELETE': {
    //                 result = await this.#service.deleteEntity(entity, filter);
    //                 break;
    //             }
    //         }
    //         return {
    //             success: true,
    //             message: `${operation} Operation erfolgreich.`,
    //             result,
    //         };
    //     } catch (error) {
    //         this.#logger.error('executeData: Fehler bei der Ausführung der Operation: %o', error);
    //         throw new BadRequestException((error as Error).message);
    //     }
    // }
}
