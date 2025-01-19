import type { CreateProcessInstanceResponse } from 'zeebe-node';

export type CreateProcessInstancePayload = {
    success: boolean;
    message: string;
    response: CreateProcessInstanceResponse;
};
