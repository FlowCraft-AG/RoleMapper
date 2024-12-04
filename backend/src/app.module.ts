import { ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { graphQlModuleOptions } from './config/graphql.js';
import { database } from './config/mongo-database.js';
import { LoggerModule } from './logger/logger.module.js';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware.js';
import { ReadController } from './role-mapper/controller/read.controller.js';
import { WriteController } from './role-mapper/controller/write.controller.js';
import { RoleMapperModule } from './role-mapper/role-mapper.module.js';
import { KeycloakModule } from './security/keycloak/keycloak.module.js';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>(graphQlModuleOptions),
        LoggerModule,
        KeycloakModule,
        MongooseModule.forRoot(database.databaseUri, {
            dbName: database.databaseName,
        }),
        RoleMapperModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RequestLoggerMiddleware)
            .forRoutes(ReadController, WriteController, 'auth', 'graphql');
    }
}
