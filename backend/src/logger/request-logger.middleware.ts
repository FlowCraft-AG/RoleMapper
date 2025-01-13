/**
 * @file RequestLoggerMiddleware - Middleware zur Protokollierung von Anfragen.
 * @module RequestLoggerMiddleware
 * @description Diese Middleware protokolliert HTTP-Anfragen (Methode, URL und Header) für Debugging und Analysezwecke.
 */

import { Injectable, type NestMiddleware } from '@nestjs/common';
import { type NextFunction, type Request, type Response } from 'express';
import { getLogger } from './logger.js';

/**
 * @description Middleware, die jede HTTP-Anfrage protokolliert (Methode, URL, Header) und anschließend die Anfrage weiterverarbeitet.
 * Diese Middleware hilft bei der Analyse und dem Debuggen von HTTP-Anfragen, indem sie grundlegende Details über die Anfrage loggt.
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    readonly #logger = getLogger(RequestLoggerMiddleware.name);

    /**
     * @description Verarbeitet die eingehende HTTP-Anfrage, protokolliert relevante Details und übergibt die Anfrage an den nächsten Middleware.
     * @param request - Das eingehende HTTP-Request-Objekt.
     * @param _response - Das HTTP-Response-Objekt (wird hier nicht verwendet).
     * @param next - Die Next-Funktion, die die Anfrage an die nächste Middleware weitergibt.
     */
    use(request: Request, _response: Response, next: NextFunction) {
        const { method, originalUrl, headers } = request;
        this.#logger.debug('method=%s, url=%s, header=%o', method, originalUrl, headers);
        next();
    }
}

