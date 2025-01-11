/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { getLogger } from '../../logger/logger.js';
import {
    ProcessFilterInput,
    TaskSearchRequest,
    VariableFilterInput,
} from '../types/input/process-filter.Input.js';
import { ProcessInstance, ProcessVariable, Task } from '../types/process.type.js';

@Injectable()
export class CamundaReadService {
    readonly #logger = getLogger(CamundaReadService.name); // Logger für die Service-Protokollierung
    readonly #httpService: HttpService;
    constructor(httpService: HttpService) {
        this.#httpService = httpService;
    }

    /**
     * Führt einen POST-Request an die angegebene Camunda-API durch.
     * @param url - Die URL der API (z. B. Operate, Tasklist).
     * @param body - Daten für den Request-Body.
     * @param token - Der Bearer-Token für die Authentifizierung.
     */
    async sendPostRequest(url: string, body: Record<string, any>, token: string): Promise<any> {
        this.#logger.info(`POST-Anfrage an Camunda API: ${url} mit Body: ${JSON.stringify(body)}`);

        try {
            const response: AxiosResponse = await lastValueFrom(
                this.#httpService.post(url, body, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            );
            this.#logger.info(`Antwort von Camunda API (POST): ${JSON.stringify(response.data)}`);
            return response.data;
        } catch (error: any) {
            this.#logger.error(
                `Fehler bei der Anfrage an Camunda API (POST): ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }

    /**
     * Methode für die Suche nach Aufgaben anhand der Benutzer-ID.
     * @param userId - Die ID des Benutzers.
     * @param token - Der Bearer-Token für die Authentifizierung.
     */
    async findTasksByUserId(userId: string, token: string): Promise<Task[]> {
        const tasklistApiUrl = 'http://localhost:8082/v1/tasks/search'; // Beispiel-URL für Camunda Tasklist
        this.#logger.info(`Hole Benutzertasks von Tasklist API für Benutzer-ID: ${userId}`);
        const TaskList: Task[] = await this.sendPostRequest(
            tasklistApiUrl,
            { assignee: userId },
            token,
        );
        this.#logger.debug('Tasks: %s', TaskList);
        return TaskList;
    }

    async findProcessInstance(key: string, token: string): Promise<ProcessInstance> {
        const operateApiUrl = 'http://localhost:8081/v1/process-instances/search';

        // Anfrage an die API senden
        const result = await this.sendPostRequest(operateApiUrl, { filter: { key } }, token);
        const instanzen: ProcessInstance[] = result.items;

        // Überprüfung auf leeres Ergebnis
        if (instanzen.length === 0 || instanzen[0] === undefined) {
            this.#logger.warn('Keine Prozessinstanz gefunden für den Schlüssel: %s', key);
            throw new Error('Keine Prozessinstanz gefunden.');
        }

        // Erste Instanz zurückgeben
        const instanz: ProcessInstance = instanzen[0];
        this.#logger.debug('findProcessInstance: Instanz: %o', instanz);
        return instanz;
    }

    async findProzessListe(filter: ProcessFilterInput, token: string): Promise<ProcessInstance[]> {
        this.#logger.debug('findProzessListe: filter: %o', filter);
        const operateApiUrl = 'http://localhost:8081/v1/process-instances/search';
        const response = await this.sendPostRequest(operateApiUrl, filter, token);
        this.#logger.debug('findProzessListe: response: %o', response);

        const instanzen: ProcessInstance[] = response.items;
        this.#logger.debug('findProzessListe: Instanzen: %o', instanzen);
        return instanzen;
    }

    async findTaskListe(filter: TaskSearchRequest, token: string): Promise<Task[]> {
        this.#logger.debug('findProzessListe: filter: %o', filter);
        const apiUrl = 'http://localhost:8082/v1/tasks/search';
        const result = await this.sendPostRequest(apiUrl, filter, token);
        this.#logger.debug('findProzessListe: response: %o', result);
        const tasks: Task[] = result;
        return tasks;
    }

    async searchTaskVariables(
        filter: VariableFilterInput,
        token: string,
    ): Promise<ProcessVariable[]> {
        const apiUrl = `http://localhost:8081/v1/variables/search`;
        const result = await this.sendPostRequest(apiUrl, filter, token);
        this.#logger.debug('searchTaskVariables: response : %o', result);
        const tasks: ProcessVariable[] = result.items;
        return tasks;
    }

    async getProcessDefinitionXmlByKey(key: string, token: string): Promise<string> {
        const apiUrl = `http://localhost:8081/v1/process-definitions/${key}/xml`; // GET-Endpunkt

        try {
            const response = await lastValueFrom(
                this.#httpService.get(apiUrl, {
                    headers: {
                        Accept: 'text/xml',
                        Authorization: `Bearer ${token}`,
                    },
                }),
            );
            this.#logger.debug('getProcessDefinitionXmlByKey: response : %s', response.data);
            return response.data as string; // XML-Daten zurückgeben
        } catch (error: any) {
            this.#logger.error(
                `Fehler bei der Anfrage an Camunda API (GET - XML): ${error.message}`,
                error.stack,
            );
            throw new Error('Fehler beim Abrufen der Prozessdefinition als XML.');
        }
    }
}
