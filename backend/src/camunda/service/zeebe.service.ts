/**
 * @file ZeebeService
 * @module ZeebeService
 * @description Diese Datei implementiert den ZeebeService, der Worker für verschiedene Aufgaben registriert und die Interaktion mit einem Zeebe Gateway ermöglicht.
 */

/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ZBClient, ZBWorker } from 'zeebe-node';
import { config } from '../../config/app.js';
import { zbClient } from '../../config/zeebe.js';
import { getLogger } from '../../logger/logger.js';
import { ReadService } from '../../role-mapper/service/read.service.js';

const { zeebe } = config;

@Injectable()
export class ZeebeService implements OnModuleInit, OnModuleDestroy {
    /** Logger für die Service-Protokollierung */
    readonly #logger = getLogger(ZeebeService.name);
    /** Instanz des Zeebe-Clients */
    #zbClient?: ZBClient;
    /** Worker für Ausgabeverarbeitung */
    #outputWorker?: ZBWorker<any, any, any>;
    /** Worker für Notizenverarbeitung */
    #noteWorker?: ZBWorker<any, any, any>;
    /** Service zur Ermittlung von Benutzerrollen */
    readonly #service: ReadService;
    /** Status, ob Zeebe aktiviert ist */
    readonly #isZeebeEnabled: boolean;

    /**
     * @constructor
     * @param service Instanz des ReadService zur Rollenabfrage
     */
    constructor(service: ReadService) {
        this.#service = service;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.#isZeebeEnabled = zeebe?.enable; // Überprüfen, ob Zeebe aktiviert ist
    }

    /**
     * Initialisiert den Zeebe-Service und registriert die Worker.
     */
    onModuleInit() {
        if (this.#isZeebeEnabled) {
            this.#zbClient = zbClient; // Zeebe Gateway-Adresse
            this.#registerOutputWorker();
            this.#registerNoteWorker();
            this.#registerGetRolesWorker();
            this.#registerSendMail();
            this.#logger.debug('Zeebe Worker gestartet.');
        } else {
            this.#logger.debug('Zeebe ist deaktiviert. Keine Worker registriert.');
        }
    }

    /**
     * Beendet den Zeebe-Service und schließt die Worker sowie den Client.
     */
    async onModuleDestroy() {
        if (this.#isZeebeEnabled) {
            if (this.#outputWorker) {
                await this.#outputWorker.close();
            }
            if (this.#noteWorker) {
                await this.#noteWorker.close();
            }
            if (this.#zbClient) {
                await this.#zbClient.close();
            }
        }
    }

    /**
     * Startet einen neuen Prozess mit den angegebenen Variablen.
     * @param processKey Der Schlüssel des BPMN-Prozesses
     * @param variables Variablen für den Prozess
     * @throws Fehler, wenn Zeebe deaktiviert ist oder der Prozessstart fehlschlägt
     */
    async startProcess(processKey: string, variables: Record<string, any>) {
        if (!this.#isZeebeEnabled) {
            this.#logger.warn('Zeebe ist deaktiviert. Prozesse können nicht gestartet werden.');
            throw new Error('Zeebe ist deaktiviert.');
        }

        try {
            this.#logger.debug(`Starte Prozess mit Key: ${processKey} und Variablen:`, variables);

            return await this.#zbClient!.createProcessInstance({
                bpmnProcessId: processKey,
                variables: variables,
            });
        } catch (error) {
            this.#logger.error('Fehler beim Starten des Prozesses:', error);
            throw error;
        }
    }

    /**
     * Registriert einen Worker für die Verarbeitung von "output"-Aufgaben.
     */
    #registerOutputWorker() {
        this.#logger.debug('Registriere Worker für "output"');
        this.#outputWorker = this.#zbClient!.createWorker({
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

    /**
     * Registriert einen Worker für die Verarbeitung von "note"-Aufgaben.
     */
    #registerNoteWorker() {
        this.#logger.debug('Registriere Worker für "note"');
        this.#noteWorker = this.#zbClient!.createWorker({
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

    /**
     * Registriert einen Worker, um Benutzerrollen für einen Prozess zu ermitteln.
     */
    #registerGetRolesWorker() {
        this.#logger.debug('Registriere Worker um Rollen zu ermitteln');
        this.#noteWorker = this.#zbClient!.createWorker({
            taskType: 'getRoles',
            taskHandler: async (job) => {
                const { userId, processId } = job.variables;

                if (userId) {
                    this.#logger.debug(
                        'ermittle rollen zum prozess %s für den Antragsteller %s',
                        processId,
                        userId,
                    );
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    const result = await this.#service.findProcessRoles(processId, userId);
                    this.#logger.debug('Rollen für den Benutzer: %o', result);

                    const antragsteller = result?.roles[1]?.users[0]?.user;
                    if (!antragsteller) {
                        this.#logger.error(
                            'Antragsteller konnte nicht ermittelt werden. Rollen-Ergebnis: %o',
                            result,
                        );
                        throw new Error('Antragsteller konnte nicht ermittelt werden.');
                    }

                    this.#logger.debug('Antragsteller: %s', antragsteller);
                    const { userType, userRole, profile, employee } = antragsteller;
                    const { firstName, lastName } = profile;
                    const { costCenter } = employee!;
                    const vorgesetzter = result?.roles[0]?.users[0]?.user;
                    this.#logger.debug('Vorgesetzter für den Benutzer: %o', vorgesetzter);

                    const assignee = [vorgesetzter?.userId];
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
                        userRole,
                        userType,
                        firstName,
                        lastName,
                        costCenter,
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

    #registerSendMail() {
        this.#logger.debug('Registriere Worker um E-Mails zu versenden');
        this.#noteWorker = this.#zbClient!.createWorker({
            taskType: 'sendMail',
            taskHandler: async (job) => {
                const { receiver } = job.variables;

                if (receiver) {
                    this.#logger.debug('Versende E-Mail an: %s', receiver);
                    // this.#logger.debug('Betreff: %s', subject);
                    // this.#logger.debug('Inhalt: %s', content);
                } else {
                    this.#logger.debug('Variable "receiver" nicht gefunden.');
                }

                await job.complete({
                    result: `E-Mail an ${receiver} versendet.`,
                });
                return 'JOB_ACTION_ACKNOWLEDGEMENT' as const;
            },
        });
    }
}
