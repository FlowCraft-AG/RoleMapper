import { gql } from '@apollo/client';

export const DELETE_PROCESS = gql`
  mutation DeleteEntity($id: String!) {
    deleteEntity(
      input: {
        entity: PROCESSES
        filter: { field: _id, operator: EQ, value: $id }
      }
    ) {
      success
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
