/**
 * @file ResponseTimeInterceptor - Interceptor zur Messung der Antwortzeit von HTTP-Anfragen.
 * @module ResponseTimeInterceptor
 * @description Dieser Interceptor misst die Zeit, die eine HTTP-Anfrage benötigt, um eine Antwort zu erhalten, und loggt diese Information.
 */

import { Temporal } from '@js-temporal/polyfill';
import {
    type CallHandler,
    type ExecutionContext,
    Injectable,
    type NestInterceptor,
} from '@nestjs/common';
import { type Response } from 'express';
import { type Observable } from 'rxjs';
import { type TapObserver } from 'rxjs/internal/operators/tap';
import { tap } from 'rxjs/operators';
import { getLogger } from './logger.js';

/**
 * @description Interceptor zur Messung und Protokollierung der Antwortzeit von HTTP-Anfragen.
 * Dieser Interceptor wird verwendet, um die Zeit zu messen, die von der Anfrage bis zur Antwort benötigt wird,
 * und die Antwortzeit im Log auszugeben.
 */
@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
    readonly #logger = getLogger(ResponseTimeInterceptor.name);

    /**
     * @description Wird aufgerufen, wenn eine HTTP-Anfrage verarbeitet wird. Der Interceptor misst die Zeit von 
     * dem Empfang der Anfrage bis zur Antwort und loggt die Antwortzeit.
     * @param context - Der Ausführungskontext, der Informationen über die eingehende Anfrage enthält.
     * @param next - Der CallHandler, der die Anfrage weiterverarbeitet.
     * @returns Eine Observable, die die Antwortzeit misst und protokolliert.
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const start = Temporal.Now.instant().epochMilliseconds;
        const responseTimeObserver: TapObserver<unknown> = {
            subscribe: this.#empty,
            unsubscribe: this.#empty,
            finalize: () => {
                const response = context.switchToHttp().getResponse<Response>();
                const { statusCode, statusMessage } = response;
                const responseTime = Temporal.Now.instant().epochMilliseconds - start;

                if (statusMessage === undefined) {
                    // GraphQL
                    this.#logger.debug('Response time: %d ms', responseTime);
                    return;
                }
                this.#logger.debug(
                    'Response time: %d ms, %d %s',
                    responseTime,
                    statusCode,
                    statusMessage,
                );
            },
            next: this.#empty,
            error: this.#empty,
            complete: this.#empty,
        };
        return next.handle().pipe(tap(responseTimeObserver));
    }

    /**
     * Eine leere Funktion, die in verschiedenen Lifecycle-Methoden des Observers verwendet wird.
     * Sie tut nichts, wird aber benötigt, um den Observer korrekt zu implementieren.
     */
    readonly #empty = () => {
        /* do nothing */
    };
}

