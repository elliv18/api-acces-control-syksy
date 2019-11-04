export default `
    #############
    # Mutations #
    #############

    type Mutation {
        ########## CURRENTUSER ##############

        currentUser: User

        currentUserUpdatePW(input: CurrentUserUpdatePWInput): CurrentUserUpdatePWPayload

        ############# LOGIN #################
        
        # ALL - login
        login(input: LoginInput!): LoginPayload

        ############# SIGNUP ################
        
        signup(input: SignupInput!): SignupPayload

        ############ ADMIN - CREATE NEW USER ##############

        createNewUser(input: CreateNewUserInput!): CreateNewUserPayload

        ########### ADMIN - USER PW RESET #################

        userPWReset(input: UserPWResetInput): UserPWResetPayload
    }

    ##############################
    # Mutation inputs & payloads #
    ##############################

    ################# CURRENT USER UPDATE PASSWORD ##########

    input CurrentUserUpdatePWInput {
        password: String!
        passwordAgain: String!
        oldPassword: String!
    }
    type CurrentUserUpdatePWPayload {
        user: User
    }

    ################# LOGIN ########################

    input LoginInput {
        email: String!  
        password: String!
    }
    type LoginPayload {
        jwt: String
    }

    ################ SIGNUP ########################

    input SignupInput {
        email: String!
        password: String!
        passwordAgain: String!
    }
    type SignupPayload {
        user: User
    }

    ############ ADMIN CREATE NEW USER ##############

    input CreateNewUserInput {
        userType: UserType!
        email: String!
        password: String!
    }
    type CreateNewUserPayload {
        user: User
    }

    ########### ADMIN - USER PW RESET #################

    input UserPWResetInput {
        id: ID!
        password: String!
        passwordAgain: String!
    }
    type UserPWResetPayload {
        user: User
    }
`;
