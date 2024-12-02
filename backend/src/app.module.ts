import { ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { graphQlModuleOptions } from './config/graphql.js';
import {
    mongoDbName as mongoDatabaseName,
    validatedMongoDbUri as validatedMongoDatabaseUri,
} from './config/mongoDb.js';
import { LoggerModule } from './logger/logger.module.js';
import { RoleMapperModule } from './roleMapper/role-mapper.module.js';
import { KeycloakModule } from './security/keycloak/keycloak.module.js';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>(graphQlModuleOptions),
        LoggerModule,
        KeycloakModule,
        MongooseModule.forRoot(validatedMongoDatabaseUri, {
            dbName: mongoDatabaseName,
        }),
        RoleMapperModule,
    ],
})
export class AppModule {}
