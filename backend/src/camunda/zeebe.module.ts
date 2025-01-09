/**
 * @file zeebe.module.ts
 * @module ZeebeModule
 * @description Definiert das Modul, das die Zeebe-Integration implementiert. Stellt die notwendigen Abhängigkeiten, Controller und Resolver bereit.
 */

import { Module } from '@nestjs/common';
import { RoleMapperModule } from '../role-mapper/role-mapper.module.js';
import { ProcessesController } from './controller/processes.controller.js';
import { ProcessesResolver } from './resolver/processes.resolver.js';
import { ZeebeService } from './service/zeebe.service.js';

/**
 * @class ZeebeModule
 * @description NestJS-Modul zur Konfiguration und Bereitstellung von Komponenten, die für die Interaktion mit Zeebe erforderlich sind.
 */
@Module({
    /**
     * @property {Array<any>} imports - Module, die für dieses Modul erforderlich sind.
     * `RoleMapperModule`: Ermöglicht die Rollenauflösung und Integration in Zeebe-Operationen.
     */
    imports: [RoleMapperModule],

    /**
     * @property {Array<any>} controllers - Controller, die die HTTP-Endpunkte dieses Moduls bereitstellen.
     * `ProcessesController`: Behandelt HTTP-Anfragen zum Starten und Verwalten von Prozessen.
     */
    controllers: [ProcessesController],

    /**
     * @property {Array<any>} providers - Provider, die Dienste und Resolver für dieses Modul bereitstellen.
     * `ProcessesResolver`: GraphQL-Resolver zur Interaktion mit Prozessen.
     * `ZeebeService`: Hauptdienst zur Kommunikation mit Zeebe.
     */
    providers: [ProcessesResolver, ZeebeService],

    /**
     * @property {Array<any>} exports - Exporte, die anderen Modulen zur Verfügung gestellt werden.
     * `ZeebeService`: Wird exportiert, um in anderen Modulen genutzt zu werden.
     */
    exports: [ZeebeService],
})
export class ZeebeModule {}