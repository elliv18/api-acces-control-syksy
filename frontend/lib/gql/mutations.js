import gql from "graphql-tag";

/******************* LOGIN ********************/

export const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      jwt
    }
  }
`;

export const SIGNUP_MUTATION = gql`
mutation signInMutation($email: String!, $password: String!, $passwordAgain: String!) {
  signup(input: { email: $email, password: $password, passwordAgain: $passwordAgain }) {
    user {
      id
    }
  }
}
`;



export const USER_DELETE = gql`
  mutation deleteMutation($id: ID!) {
    deleteUser(input: { id: $id }) {
      user{
        id
      }
    }
  }
`;

/*********************** CURRENTUSER ****************************/

export const CURRENTUSER = gql`
  mutation {
    currentUser {
      email,
      userType
    }
  }
`;