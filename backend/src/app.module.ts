import { ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { graphQlModuleOptions } from './config/graphql.js';
import { mongoDatabaseName, validatedMongoDatabaseUri } from './config/mongo-database.js';
import { LoggerModule } from './logger/logger.module.js';
import { RoleMapperModule } from './role-mapper/role-mapper.module.js';
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
