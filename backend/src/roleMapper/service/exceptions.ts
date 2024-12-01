import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Das Modul besteht aus den Klassen für die Fehlerbehandlung bei der Verwaltung
 * von Büchern, z.B. beim DB-Zugriff.
 * @packageDocumentation
 */

/**
 * Exception-Klasse für eine bereits existierende Kunden-Id.
 */
export class ProcessNotFoundException extends HttpException {
    constructor(readonly processId: string) {
        super(`Der Prozess ${processId} existiert nicht.`, HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
