/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ZBClient, ZBWorker } from 'zeebe-node';
import { getLogger } from '../../logger/logger.js';
import { ReadService } from '../../role-mapper/service/read.service.js';

@Injectable()
export class ZeebeService implements OnModuleInit, OnModuleDestroy {
    readonly #logger = getLogger(ZeebeService.name); // Logger für die Service-Protokollierung
    #zbClient!: ZBClient;
    #outputWorker!: ZBWorker<any, any, any>;
    #noteWorker!: ZBWorker<any, any, any>;
    readonly #service: ReadService;

    constructor(service: ReadService) {
        this.#service = service;
    }

    onModuleInit() {
        this.#zbClient = new ZBClient('localhost:26500'); // Zeebe Gateway-Adresse

        this.registerOutputWorker();
        this.registerNoteWorker();
        this.registerGetRolesWorker();
        this.#logger.debug('Zeebe Worker gestartet.');
    }

    async onModuleDestroy() {
        if (this.#outputWorker !== null && this.#outputWorker !== undefined) {
            await this.#outputWorker.close();
        }
        if (this.#noteWorker !== null && this.#noteWorker !== undefined) {
            await this.#noteWorker.close();
        }
        if (this.#zbClient !== null && this.#zbClient !== undefined) {
            await this.#zbClient.close();
        }
    }

    async startProcess(processKey: string, variables: Record<string, any>) {
        try {
            this.#logger.debug(`Starte Prozess mit Key: ${processKey} und Variablen:`, variables);

            return await this.#zbClient.createProcessInstance({
                bpmnProcessId: processKey,
                variables: variables,
            });
        } catch (error) {
            console.error('Fehler beim Starten des Prozesses:', error);
            throw error;
        }
    }

    private registerOutputWorker() {
        this.#logger.debug('Registriere Worker für "output" ');
        this.#outputWorker = this.#zbClient.createWorker({
            taskType: 'output',
            taskHandler: async (job) => {
                const eingabe = job.variables.eingabe;

                if (eingabe !== null && eingabe !== undefined) {
                    this.#logger.debug(`Benutzer Eingabe: ${eingabe}`);
                } else {
                    this.#logger.debug('Variable "eingabe" nicht gefunden.');
                }

                await job.complete({
                    result: `Eingabe verarbeitet: ${eingabe || 'keine Eingabe'}`,
                });
                return 'JOB_ACTION_ACKNOWLEDGEMENT' as const;
            },
        });
    }

    private registerNoteWorker() {
        this.#logger.debug('Registriere Worker für "note"');
        this.#noteWorker = this.#zbClient.createWorker({
            taskType: 'note',
            taskHandler: async (job) => {
                const gegebeneNote = job.variables.gegebene_note;

                if (gegebeneNote) {
                    this.#logger.debug(`Benutzer Eindruck: ${gegebeneNote}`);
                } else {
                    this.#logger.debug('Variable "note" nicht gefunden.');
                }

                await job.complete({
                    result: `Eingabe verarbeitet: ${gegebeneNote || 'keine Eingabe'}`,
                });
                return 'JOB_ACTION_ACKNOWLEDGEMENT' as const;
            },
        });
    }

    private registerGetRolesWorker() {
        this.#logger.debug('Registriere Worker um Rollen zu ermitteln');
        this.#noteWorker = this.#zbClient.createWorker({
            taskType: 'getRoles',
            taskHandler: async (job) => {
                const userId: string = job.variables.userId;
                const processId: string = job.variables.procesId;

                if (userId) {
                    this.#logger.debug(
                        'ermittle rollen zum prozess %s für den Antragsteller %s',
                        processId,
                        userId,
                    );
                    const result = await this.#service.findProcessRoles(processId, userId);
                    this.#logger.debug('Rollen für den Benutzer: %o', result);
                    const vorgesetzter = result?.roles[0];
                    this.#logger.debug('Vorgesetzter für den Benutzer: %o', vorgesetzter);
                    const assignee = vorgesetzter?.users[0]?.user?.userId;
                    if (!assignee) {
                        this.#logger.error(
                            'Assignee konnte nicht ermittelt werden. Rollen-Ergebnis: %o',
                            vorgesetzter,
                        );
                        throw new Error('Assignee konnte nicht ermittelt werden.');
                    }
                    this.#logger.debug('Zuweisung an: %s', assignee);
                    await job.complete({
                        assignee: assignee,
                        assigneeLocked: true,
                    });
                    this.#logger.debug('Job abgeschlossen mit assignee: %o', assignee);
                    this.#logger.debug('Prozess-Variablen vor Abschluss: %o', job.variables);
                } else {
                    this.#logger.debug('Variable "note" nicht gefunden.');
                }
                return 'JOB_ACTION_ACKNOWLEDGEMENT' as const;
            },
        });
    }
}
