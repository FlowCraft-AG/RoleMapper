import type { EntityCategoryType } from '../entity/entities.entity.js';
import type { FilterInput } from '../input/filter.input.js';
import type {
    UpdateDataInput,
    UpdateFunctionInput,
    UpdateOrgUnitInput,
    UpdateProcessInput,
    UpdateRoleInput,
    UpdateUserInput,
} from '../input/update.input.js';

export type UpdateEntityInput = {
    entity: EntityCategoryType;
    filter: FilterInput;
    // für REST
    data: UpdateDataInput;

    // für GRAPHQL
    userData?: UpdateUserInput;
    functionData?: UpdateFunctionInput;
    processData?: UpdateProcessInput;
    orgUnitData?: UpdateOrgUnitInput;
    roleData?: UpdateRoleInput;
};
