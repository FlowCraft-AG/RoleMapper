import type { EntityCategoryType } from '../entity/entities.entity.js';
import type {
    UpdateFunctionInput,
    UpdateOrgUnitInput,
    UpdateProcessInput,
    UpdateRoleInput,
    UpdateUserInput,
} from '../input/update.input.js';
import type { FilterInputDTO } from './filter.dto.js';

export type UpdateEntityInput = {
    entity: EntityCategoryType;
    userData?: UpdateUserInput;
    functionData?: UpdateFunctionInput;
    processData?: UpdateProcessInput;
    orgUnitData?: UpdateOrgUnitInput;
    roleData?: UpdateRoleInput;
    filters: FilterInputDTO[];
};
