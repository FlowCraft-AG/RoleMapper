import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../config/environment.js';
import { getLogger } from '../../logger/logger.js';
import { ProcessInstanceFilter } from '../types/input-filter/process-instance-filter.js';
import { TaskFilter } from '../types/input-filter/task-filter.js';
import { VariableFilter } from '../types/input-filter/variable-filter.js';
import { ProcessInstance } from '../types/process-instance.type.js';
import { ProcessVariable } from '../types/process-variable.type.js';
import { Task } from '../types/task.type.js';

const { CAMUNDA_TASKLIST_API_URL, CAMUNDA_OPERATE_API_URL, REQUEST_TIMEOUT_MS } = environment;

@Injectable()
export class CamundaReadService {
    readonly #logger = getLogger(CamundaReadService.name);
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
    async fetchProcessInstances(
        filter: ProcessInstanceFilter,
        token: string,
    ): Promise<ProcessInstance[]> {
        this.#logger.debug('fetchProcessInstances: Suche Prozessinstanzen mit Filter: %o', filter);

        const operateApiUrl = `${CAMUNDA_OPERATE_API_URL}/process-instances/search`;
        const body = { filter, size: filter.size ?? undefined, sort: filter.sort ?? undefined };
        const response = await this.#sendPostRequest<{ items: ProcessInstance[] }>(
            operateApiUrl,
            body,
            token,
        );
        const instanzen = response.items;
        this.#logger.debug(': Gefundene Prozessinstanzen: %o', instanzen);
        return instanzen;
    }

    /**
     * Sucht Aufgaben basierend auf einem Filter.
     * @param filter - Der Filter für die Suche.
     * @param token - Der Bearer-Token für die Authentifizierung.
     * @returns Eine Liste von Aufgaben.
     */
    async fetchProcessTasks(filter: TaskFilter, token: string): Promise<Task[]> {
        this.#logger.debug('fetchProcessTasks: Suche Aufgaben mit Filter: %o', filter);
        const tasklistApiUrl = `${CAMUNDA_TASKLIST_API_URL}/tasks/search`;
        const tasks = await this.#sendPostRequest<Task[]>(tasklistApiUrl, filter ?? {}, token);
        this.#logger.debug('fetchProcessTasks: Gefundene Aufgaben: %o', tasks);
        return tasks;
    }

    /**
     * Sucht Variablen basierend auf einem Filter.
     * @param filter - Der Filter für die Suche.
     * @param token - Der Bearer-Token für die Authentifizierung.
     * @returns Eine Liste von Variablen.
     */
    async fetchProcessVariables(filter: VariableFilter, token: string): Promise<ProcessVariable[]> {
        this.#logger.debug('fetchProcessVariables: Suche Variablen mit Filter: %o', filter);

        const apiUrl = `${CAMUNDA_OPERATE_API_URL}/variables/search`;
        const body = { filter };
        const response = await this.#sendPostRequest<{ items: ProcessVariable[] }>(
            apiUrl,
            body,
            token,
        );
        const variables = response.items;
        this.#logger.debug('fetchProcessVariables: Gefundene Variablen: %o', variables);
        return variables;
    }

    /**
     * Ruft die XML-Definition einer Prozessdefinition basierend auf ihrem Schlüssel ab.
     * @param key - Der Prozessschlüssel.
     * @param token - Der Bearer-Token für die Authentifizierung.
     * @returns Die Prozessdefinition als XML-String.
     */
    async fetchProcessDefinitionXml(key: string, token: string): Promise<string> {
        if (!key) {
            throw new Error(
                'fetchProcessDefinitionXml: Der Prozessschlüssel darf nicht leer sein.',
            );
        }
        const apiUrl = `${CAMUNDA_OPERATE_API_URL}/process-definitions/${key}/xml`;
        this.#logger.info('fetchProcessDefinitionXml: processDefinitionXml=%s', key);
        const response = await this.#sendGetRequest<string>(apiUrl, token);
        this.#logger.debug('fetchProcessDefinitionXml: xml=%s', response);
        return response;
    }

    /**
     * Führt einen POST-Request an die angegebene Camunda-API durch.
     * @template T - Erwarteter Rückgabetyp der API.
     * @param url - Die vollständige URL der API.
     * @param body - Daten für den Request-Body.
     * @param token - Der Bearer-Token für die Authentifizierung.
     * @returns Antwortdaten der API im angegebenen Typ.
     */
    async #sendPostRequest<T>(url: string, body: Record<string, any>, token: string): Promise<T> {
        this.#logger.debug('#sendPostRequest: URL=%s, body=%o', url, body);
        try {
            const response: AxiosResponse = await lastValueFrom(
                this.#httpService.post(url, body, {
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: Number(REQUEST_TIMEOUT_MS ?? '5000'), // Timeout von 5 Sekunden
                }),
            );
            this.#logger.debug('#sendPostRequest: response=%s', JSON.stringify(response.data));
            return response.data as T;
        } catch (error: any) {
            this.#handleError('POST-Request fehlgeschlagen für den Operate Service', error);
        }
    }

    /**
     * Führt einen GET-Request an die angegebene Camunda-API durch.
     * @template T - Erwarteter Rückgabetyp der API.
     * @param url - Die vollständige URL der API.
     * @param token - Der Bearer-Token für die Authentifizierung.
     * @returns Antwortdaten der API im angegebenen Typ.
     */
    async #sendGetRequest<T>(url: string, token: string): Promise<T> {
        this.#logger.debug('sendGetRequest: URL=%s', url);
        try {
            const response: AxiosResponse = await lastValueFrom(
                this.#httpService.get(url, {
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: Number(REQUEST_TIMEOUT_MS ?? '5000'), // Timeout von 5 Sekunden
                }),
            );
            this.#logger.debug('sendGetRequest: response=%o', response.data);
            return response.data as T;
        } catch (error: any) {
            this.#handleError('GET-Request fehlgeschlagen für den Tasklist Servic', error);
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
