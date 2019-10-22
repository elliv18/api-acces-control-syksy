import gql from "graphql-tag";

export const USERS_QUERY = gql`
  query {
    allUsers {
      id
      isActive
      userType
      email
      firstName
      lastName
      address
      personNumber
      phone
      createdAt
      updatedAt
    }
  }
`;
