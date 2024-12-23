/**
 * Das Modul besteht aus der Klasse {@linkcode HttpExceptionFilter}.
 * @packageDocumentation
 */
import { Catch, type ExceptionFilter, HttpException } from '@nestjs/common';
import { BadUserInputError } from '../error/errors.js';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    /**
     * Fängt eine HttpException ab und wirft eine BadUserInputError.
     * @param {HttpException} exception - Die abgefangene Ausnahme.
     * @param {ArgumentsHost} _host - Das Argument-Host-Objekt.
     * @throws {BadUserInputError} - Wenn die Ausnahme abgefangen wird.
     */
    catch(exception: HttpException) {
        const response = exception.getResponse();
        if (typeof response === 'string') {
            throw new BadUserInputError(response, exception);
        }

        // Typ "object", default: mit den Properties statusCode und message
        const { message } = response as { message: string };
        throw new BadUserInputError(message, exception);
    }
}
