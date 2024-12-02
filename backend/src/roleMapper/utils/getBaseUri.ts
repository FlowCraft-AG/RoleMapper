/**
 * Das Modul besteht aus der Controller-Klasse für Lesen an der REST-Schnittstelle.
 * @packageDocumentation
 */

import { type Request } from 'express';
import { nodeConfig } from '../../config/node.js';
import { paths } from '../../config/paths.js';

const port = `:${nodeConfig.port}`;

export const getBaseUri = ({ protocol, hostname, url }: Request) => {
    // Query-String entfernen, falls vorhanden
    let basePath = url.includes('?') ? url.slice(0, url.lastIndexOf('?')) : url;

    // '/process-roles' entfernen, falls es am Ende steht
    if (basePath.endsWith(`/${paths.processRoles}`)) {
        basePath = basePath.slice(0, -`/${paths.processRoles}`.length);
    }

    return `${protocol}://${hostname}${port}${basePath}`;
};
