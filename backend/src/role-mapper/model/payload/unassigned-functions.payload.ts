import type { Mandates } from '../entity/mandates.entity.js';

export type UnassignedFunctionsPayload = {
    function: Mandates;
    userList: UserRetirementInfo[];
};

export type UserRetirementInfo = {
    userId: string;
    timeLeft: number;
};
