import type { EntityCategoryType } from '../entity/entities.entity.js';
import type {
    CreateFunctionInput,
    CreateOrgUnitInput,
    CreateProcessInput,
    CreateRoleInput,
    CreateUserInput,
} from '../input/create.input.js';

export type CreateEntityInput = {
    entity: EntityCategoryType;
    userData?: CreateUserInput;
    functionData?: CreateFunctionInput;
    processData?: CreateProcessInput;
    orgUnitData?: CreateOrgUnitInput;
    roleData?: CreateRoleInput;
};
