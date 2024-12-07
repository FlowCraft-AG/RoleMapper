import { EntityCategory } from '../entity/entities.entity';
import { Mandates } from '../entity/mandates.entity';
import { OrgUnit } from '../entity/org-unit.entity';
import { Process } from '../entity/process.entity';
import { Role } from '../entity/roles.entity';
import { User } from '../entity/user.entity';
import { FilterCondition } from './filter.input';
import { PaginationParams } from './pagination-params';

export type DataInput<T extends EntityCategory> = {
    entity: T;
    filters?: FilterCondition<T>[];
    pagination?: PaginationParams;
};

export type GetData<T extends EntityCategory> = T extends 'USERS'
    ? User
    : T extends 'FUNCTIONS'
      ? Mandates
      : T extends 'ORG_UNITS'
        ? OrgUnit
        : T extends 'PROCESSES'
          ? Process
          : T extends 'ROLES'
            ? Role
            : never;
