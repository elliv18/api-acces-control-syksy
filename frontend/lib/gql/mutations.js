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


/*********************** USERS EDIT ****************************/

export const USER_DELETE = gql`
  mutation deleteMutation($id: ID!) {
    deleteUser(input: { id: $id }) {
      user{
        id
      }
    }
  }
`;


export const ADMIN_RESET_PW = gql`
  mutation updateMutation($id: ID! $password: String! $passwordAgain: String!) 
  {
    userPWReset(input: { id: $id, password: $password, passwordAgain: $passwordAgain } )
    {
      user {
        id,
        email
      }
    }
  }
`;

/*********************** ADD USER **************************** */
export const ADD_USER = gql`
  mutation addUserMutation($userType: UserType! $email: String! $password: String! ) 
  {
    createNewUser(input: { userType: $userType, email: $email password: $password } )
    {
      user {
        id,
        email,
        userType,
        createdAt
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