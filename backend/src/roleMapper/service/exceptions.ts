import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Das Modul besteht aus den Klassen für die Fehlerbehandlung bei der Verwaltung
 * von Büchern, z.B. beim DB-Zugriff.
 * @packageDocumentation
 */

/**
 * Fehler bei der Verwendung eines ungültigen Operators in der Filter-Query.
 */
export class InvalidOperatorException extends HttpException {
    constructor(operator: string) {
        super(`Ungültiger Operator: ${operator}`, HttpStatus.BAD_REQUEST);
        this.name = 'InvalidOperatorException';
    }
}

/**
 * Fehler bei unvollständigen oder ungültigen Filterbedingungen.
 */
export class InvalidFilterException extends HttpException {
    constructor(missingFields: string[]) {
        const message = `Ungültiger Filter: Die folgenden Angaben fehlen oder sind unvollständig: ${missingFields.join(', ')}.`;
        super(message, HttpStatus.BAD_REQUEST);
        this.name = 'InvalidFilterException';
    }
}
