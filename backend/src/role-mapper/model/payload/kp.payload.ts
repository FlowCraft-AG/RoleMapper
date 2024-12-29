import type { User } from '../entity/user.entity.js';
export type GetUsersByFunctionResult = {
    functionName: string;
    users: User[];
    isImpliciteFunction: boolean;
};
