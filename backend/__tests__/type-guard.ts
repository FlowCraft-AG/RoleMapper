// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @stylistic/operator-linebreak */
import type { EntityType } from '../src/role-mapper/model/entity/entities.entity.js';
import type { Mandates } from '../src/role-mapper/model/entity/mandates.entity.js';
import type { OrgUnit } from '../src/role-mapper/model/entity/org-unit.entity.js';
import type { Process } from '../src/role-mapper/model/entity/process.entity.js';
import type { Role } from '../src/role-mapper/model/entity/roles.entity.js';
import type { User } from '../src/role-mapper/model/entity/user.entity.js';

export function isUser(entity: EntityType): entity is User {
    return (
        typeof (entity as User).userId === 'string' &&
        typeof (entity as User).userType === 'string' &&
        typeof (entity as User).userRole === 'string' &&
        typeof (entity as User).active === 'boolean' &&
        typeof (entity as User).orgUnit === 'string'
    );
}

export function isMandate(entity: EntityType): entity is Mandates {
    return (
        Array.isArray((entity as Mandates).users) &&
        (entity as Mandates).users.every((u) => typeof u === 'string')
    );
}

export function isProcess(entity: EntityType): entity is Process {
    return (
        typeof (entity as Process).processId === 'string' &&
        typeof (entity as Process).name === 'string'
    );
}

export function isRole(entity: EntityType): entity is Role {
    return typeof (entity as Role).roleId === 'string' && typeof (entity as Role).name === 'string';
}

export function isOrgUnit(entity: EntityType): entity is OrgUnit {
    return (
        typeof (entity as OrgUnit)._id === 'string' && typeof (entity as OrgUnit).name === 'string'
    );
}
