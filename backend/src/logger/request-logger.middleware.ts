import { Injectable, type NestMiddleware } from '@nestjs/common';
import { type NextFunction, type Request, type Response } from 'express';
import { getLogger } from './logger.js';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    readonly #logger = getLogger(RequestLoggerMiddleware.name);

    use(request: Request, _response: Response, next: NextFunction) {
        const { method, originalUrl, headers } = request;
        this.#logger.debug('method=%s, url=%s, header=%o', method, originalUrl, headers);
        next();
    }
}
