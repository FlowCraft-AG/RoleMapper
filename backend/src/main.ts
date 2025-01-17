import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, type SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import { AppModule } from './app.module.js';
import { config } from './config/app.js';
import { corsOptions } from './config/cors.js';
import { deployCamundaResources } from './config/deployment.js';
import { nodeConfig } from './config/node.js';
import { paths } from './config/paths.js';
import { helmetHandlers } from './security/http/helmet.handler.js';

const { zeebe } = config;

const { httpsOptions, port } = nodeConfig;

const setupSwagger = (app: INestApplication) => {
    const appConfig = new DocumentBuilder()
        .setTitle('RoleMapper')
        .setDescription(' "Backend für das dynamische Rollen- und Funktionsmanagement"')
        .setVersion('2024.11.28')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, appConfig);
    const options: SwaggerCustomOptions = { customSiteTitle: 'SWE 24/25' };
    SwaggerModule.setup(paths.swagger, app, document, options);
};

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule, { httpsOptions });
    app.use(helmetHandlers, compression());
    app.useGlobalPipes(new ValidationPipe());
    setupSwagger(app);
    app.enableCors(corsOptions);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/strict-boolean-expressions
    if (zeebe?.enable) {
        await deployCamundaResources();
    }
    await app.listen(port);
};

await bootstrap();
