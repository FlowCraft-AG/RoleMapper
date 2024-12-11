import { gql } from '@apollo/client';

export const USERS = gql`
  query GetData {
    getData(input: { entity: USERS }) {
      totalCount
      data {
        ... on User {
          _id
          userId
          userType
          userRole
          orgUnit
          active
          validFrom
          validUntil
          employee {
            costCenter
            department
          }
          student {
            _id
            courseOfStudy
            courseOfStudyUnique
            courseOfStudyShort
            courseOfStudyName
            level
            examRegulation
          }
        }
      }
    }
  }
`;
