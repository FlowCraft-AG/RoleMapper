/**
 * @file LoggerModule - Modul für allgemeine Services wie BannerService und ResponseTimeInterceptor.
 * @module LoggerModule
 * @description Dieses Modul stellt allgemeine Services wie den BannerService und den ResponseTimeInterceptor zur Verfügung.
 * @packageDocumentation
 */

import { Global, Module } from '@nestjs/common';
import { BannerService } from './banner.service.js';
import { ResponseTimeInterceptor } from './response-time.interceptor.js';

/**
 * Das Modul besteht aus allgemeinen Services, z.B. MailService.
 * @packageDocumentation
 */

/**
 * Die dekorierte Modul-Klasse mit den Service-Klassen.
 */
@Global()
@Module({
    providers: [BannerService, ResponseTimeInterceptor],
    exports: [BannerService, ResponseTimeInterceptor],
})
export class LoggerModule {}

