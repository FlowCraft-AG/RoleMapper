import { Injectable } from '@nestjs/common';
import { ResolveField, Resolver } from '@nestjs/graphql';

/**
 * Resolver für die Union `EntityResult`.
 * Bestimmt zur Laufzeit den konkreten Typ des Objekts basierend auf dessen Eigenschaften.
 */
@Resolver('EntityResult')
@Injectable()
export class EntityResultResolver {
    /**
     * Bestimmt den konkreten Typ eines Objekts innerhalb der Union `EntityResult`.
     * @param object - Das Objekt, dessen Typ aufgelöst werden soll.
     * @returns Der Name des konkreten Typs, falls erkannt; andernfalls `undefined`.
     */
    @ResolveField('__resolveType')
    resolveType(object: Record<string, unknown>): string | undefined {
        if (typeof object.userId === 'string') return 'User';
        if (typeof object.functionName === 'string') return 'Function';
        if (typeof object.processId === 'string') return 'Process';
        if (typeof object.roleId === 'string') return 'Role';
        if (typeof object.name === 'string') return 'OrgUnit';
        return undefined;
    }
}
