import { Module } from '@nestjs/common';
import { KeycloakModule } from '../security/keycloak/keycloak.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/entity/user.entity.js';

@Module({
  imports: [
    KeycloakModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [],
  providers: [

  ],
  // Export der Provider fuer DI in anderen Modulen
  exports: [],
})
export class BankkontoModule { }
