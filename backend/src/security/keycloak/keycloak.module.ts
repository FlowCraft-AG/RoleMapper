/**
 * @file keycloak.module.ts
 * @description Definiert Module für die Integration von Keycloak in eine NestJS-Anwendung. 
 * Es enthält Konfigurationen für Authentifizierungs- und Rollenüberprüfungsdienste sowie Controller und Resolver für Tokens.
 * @module KeycloakModule
 */

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, KeycloakConnectModule, RoleGuard } from 'nest-keycloak-connect';
import { KeycloakService } from './keycloak.service.js';
import { TokenController } from './token.controller.js';
import { TokenResolver } from './token.resolver.js';

/**
 * Konfigurationsmodul für Keycloak-Dienste. Dieses Modul stellt den 
 * `KeycloakService` bereit und exportiert ihn für andere Module.
 * 
 * @module ConfigModule
 */
@Module({
    providers: [KeycloakService],
    exports: [KeycloakService],
})
class ConfigModule {}

/**
 * Hauptmodul für die Integration von Keycloak in die Anwendung. 
 * Es konfiguriert Authentifizierungs- und Rollenprüfungsmechanismen und stellt 
 * Controller und Resolver für Token-Operationen bereit.
 * 
 * @module KeycloakModule
 */
@Module({
    imports: [
        /**
         * Asynchrone Registrierung des KeycloakConnectModule mit 
         * einer vorhandenen KeycloakService-Instanz.
         */
        KeycloakConnectModule.registerAsync({
            useExisting: KeycloakService,
            imports: [ConfigModule],
        }),
    ],
    controllers: [TokenController],
    providers: [
        KeycloakService,
        TokenResolver,
        {
            /**
             * Definiert einen globalen Authentifizierungs-Guard für die Anwendung.
             * Erforderlich für die Nutzung von @UseGuards(AuthGuard).
             */
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            /**
             * Definiert einen globalen Rollen-Guard für die Anwendung.
             * Unterstützt @Roles({ roles: ['admin'] }) sowie @Public() und @AllowAnyRole().
             */
            provide: APP_GUARD,
            useClass: RoleGuard,
        },
    ],
    exports: [KeycloakConnectModule],
})
export class KeycloakModule {}
