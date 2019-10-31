import gql from "graphql-tag";

export const USERS_QUERY = gql`
  query {
    allUsers {
      id,
      email,
      apiKey,
      userType,
      createdAt
    }
  }
`;

export const API_LIST_QUERY = gql`
  query {
    getApiList {
      id,
      name,
      path,
      tags,
    }
  }
`;

