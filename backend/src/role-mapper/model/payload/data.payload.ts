import type { EntityType } from '../entity/entities.entity.js';
import type { Links } from '../types/link.type.js';

export type DataPayloadRest = {
    datas: DataResult[];
    totalCount: number;
};

export type DataResult = {
    data: EntityType;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _links: Links;
};

/**
 * Nutzlast für die Rückgabe von abgefragten Daten.
 *
 * @property {EntityType[]} data - Die Liste der abgefragten Entitäten.
 * @property {number} totalCount - Die Gesamtanzahl der Datensätze, die die Filterkriterien erfüllen.
 */
export type DataPayload = {
    data: EntityType[];
    totalCount: number;
};
