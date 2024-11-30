import { ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { graphQlModuleOptions } from './config/graphql.js';
import { mongoDbName, validatedMongoDbUri } from './config/mongoDb.js';
import { LoggerModule } from './logger/logger.module.js';
import { RoleMapperModule } from './roleMapper/roleMapper.module.js';
import { KeycloakModule } from './security/keycloak/keycloak.module.js';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>(graphQlModuleOptions),
        LoggerModule,
        KeycloakModule,
        MongooseModule.forRoot(validatedMongoDbUri, {
            dbName: mongoDbName,
        }),
        RoleMapperModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
