import gql from "graphql-tag";

export const USERS_QUERY = gql`
  query {
    allUsers {
      id,
      email,
      api_key,
      userType,
      createdAt
    }
  }
`;

export const API_LIST_QUERY = gql`
  query {
    getApiList {
      api_id,
      api_name,
      api_root_url
      urls{
        url,
        methods
      }
    }
  }
`;

