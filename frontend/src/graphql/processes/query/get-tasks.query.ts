import { gql } from '@apollo/client';

export const GET_ALL_TASKS = gql`
  query GetTasks {
    getTasks {
        id
        name
        taskDefinitionId
        processName
        creationDate
        completionDate
        assignee
        taskState
        formKey
        formId
        formVersion
        isFormEmbedded
        processDefinitionKey
        processInstanceKey
        tenantId
        dueDate
        followUpDate
        candidateGroups
        candidateUsers
        implementation
        priority

    }
}
`;

export const GET_TASKS_BY_USER = gql`
  query GetTasks($user: String!) {
    getTasks(filter: { candidateUser: $user }) {
        id
        name
        taskDefinitionId
        processName
        creationDate
        completionDate
        assignee
        taskState
        formKey
        formId
        formVersion
        isFormEmbedded
        processDefinitionKey
        processInstanceKey
        tenantId
        dueDate
        followUpDate
        candidateGroups
        candidateUsers
        implementation
        priority

    }
}
`;
