import { mergeResolvers } from "merge-graphql-schemas";

import relations from "./relations";

import query_allusers from "./query_allUsers";
import query_getApiList from "./query_getApiList";

import mutation_createNewUser from "./mutation_createNewUser";
import mutation_currentUser from "./mutation_currentUser";
import mutation_currentUserUpdatePW from "./mutation_currentUserUpdatePW";
import mutation_login from "./mutation_login";
import mutation_login_google from "./mutation_login_google";
import mutation_signup from "./mutation_signup";
import mutation_userPWReset from "./mutation_userPWReset";

import mutation_tyk_createNewApiKey from "./mutation_tyk_createNewApiKey";
import mutation_tyk_deleteApiKey from "./mutation_tyk_deleteApiKey";
import mutation_tyk_deleteUser from "./mutation_tyk_deleteUser";
import mutation_tyk_createNewAPI from "./mutation_tyk_createNewAPI";
import mutation_tyk_deleteApis from "./mutation_tyk_deleteApis";

const resolvers = [
  relations,
  query_allusers,
  query_getApiList,
  mutation_createNewUser,
  mutation_currentUser,
  mutation_currentUserUpdatePW,
  mutation_login,
  mutation_login_google,
  mutation_signup,
  mutation_userPWReset,
  mutation_tyk_createNewApiKey,
  mutation_tyk_deleteApiKey,
  mutation_tyk_deleteUser,
  mutation_tyk_createNewAPI,
  mutation_tyk_deleteApis
];

export default mergeResolvers(resolvers);
