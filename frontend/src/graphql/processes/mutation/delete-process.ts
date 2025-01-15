import { gql } from '@apollo/client';

export const DELETE_PROCESS = gql`
  mutation DeleteEntity($value: String!) {
    deleteEntity(
      input: {
        entity: PROCESSES
        filter: { field: _id, operator: EQ, value: $value }
      }
    ) {
      success
      message
      affectedCount
      warnings
    }
  }
`;
export const DELETE_PROCESS_INSTANCE = gql`
  mutation DeleteProcessInstance($processInstanceKey: String!) {
    deleteProcessInstance(processInstanceKey: $processInstanceKey)
  }
`;
export const CANCEL_PROCESS_INSTANCE = gql`
  mutation CancelProcessInstance($processInstanceKey: String!) {
    cancelProcessInstance(processInstanceKey: $processInstanceKey)
  }
`;
