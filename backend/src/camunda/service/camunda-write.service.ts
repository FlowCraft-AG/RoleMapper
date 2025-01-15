import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../config/environment.js';
import { getLogger } from '../../logger/logger.js';
import { DeleteInstancePayload } from '../types/delete-instance.payload.js';

const { CAMUNDA_OPERATE_API_URL, REQUEST_TIMEOUT_MS } = environment;

@Injectable()
export class CamundaWriteService {
    readonly #logger = getLogger(CamundaWriteService.name);
    readonly #httpService: HttpService;

    constructor(httpService: HttpService) {
        this.#httpService = httpService;
    }

    /**
     * Sucht Prozessinstanzen anhand eines Filters.
     * @param filter - Der Filter für die Suche.
     * @param token - Der Bearer-Token für die Authentifizierung.
     * @returns Eine Liste von Prozessinstanzen.
     */
    async deleteProcessInstance(key: string, token: string): Promise<string> {
        this.#logger.debug(
            'deleteProcessInstance: lösche Prozessinstanzen mit dem Schlüssel: %s',
            key,
        );

        const operateApiUrl = `${CAMUNDA_OPERATE_API_URL}/process-instances/${key}`;
        const response = await this.#sendDeleteRequest<DeleteInstancePayload>(operateApiUrl, token);
        return response.message;
    }

    async #sendDeleteRequest<T>(url: string, token: string): Promise<T> {
        this.#logger.debug('#sendDeleteRequest: URL=%s', url);
        try {
            const response: AxiosResponse = await lastValueFrom(
                this.#httpService.delete(url, {
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: Number(REQUEST_TIMEOUT_MS ?? '5000'), // Timeout von 5 Sekunden
                }),
            );
            this.#logger.debug('#sendDeleteRequest: response=%s', JSON.stringify(response.data));
            return response.data as T;
        } catch (error: any) {
            this.#handleError('POST-Request fehlgeschlagen für den Operate Service', error);
        }
    }

    /**
     * Hilfsmethode zur zentralen Fehlerbehandlung.
     * @param message - Fehlermeldung für das Logging.
     * @param error - Der aufgetretene Fehler.
     * @throws Fehler mit der übergebenen Nachricht.
     */
    #handleError(message: string, error: any): never {
        const errorMessage = error instanceof Error ? error.message : 'Unbekannter fehler';
        this.#logger.error(
            `${message}: ${errorMessage}`,
            error instanceof Error ? error.stack : 'Kein stack trace Verfügbar',
        );
        throw new Error(`${message}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
