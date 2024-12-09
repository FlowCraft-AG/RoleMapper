import type { EntityType } from '../entity/entities.entity.js';
import type { Links } from '../types/link.type.js';

export type DataPayload = {
    datas: DataResult[];
    totalCount: number;
};

export type DataResult = {
    data: EntityType;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _links: Links;
};
