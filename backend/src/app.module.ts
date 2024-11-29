import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './logger/logger.module.js';
import { KeycloakModule } from './security/keycloak/keycloak.module.js';
import { graphQlModuleOptions } from './config/graphql.js';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { mongoDbName, validatedMongoDbUri } from './config/mongoDb.js';
import { RoleMapperModule } from './roleMapper/roleMapper.module.js';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>(graphQlModuleOptions),
    LoggerModule,
    KeycloakModule,
    MongooseModule.forRoot(validatedMongoDbUri, {
      dbName: mongoDbName,
    }),
    RoleMapperModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
