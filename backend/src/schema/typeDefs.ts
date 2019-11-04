export default `
    #########
    # Enums #
    #########

    enum UserType {
        ADMIN
        USER
    }

    ########
    # User #
    ########

    type User {
        id: ID!
        userType: UserType
        email: String
        apiKey: String
        apis: [Api]!
        createdAt: String!
        updatedAt: String!
    }

    #######
    # Api #
    #######

    type Api {
        id: ID!
        api_id: String
        api_name: String
        urls: [Url]
        users: [User]
    }

    #######
    # Url #
    #######

    type Url {
        id: ID!
        url: String
        methods: String
        api: Api
    }

    ########
    # ApiList #
    ########

    type ApiList {
        id: String
        name: String
        path: String
        tags: String
    }

    ###########
    # Queries #
    ###########

    type Query {
        allUsers: [User]

        getApiList: [ApiList]
    }

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
        
        ############# DELETE KEY #################
        
        deleteApiKey(input: DeleteKeyInput): DeleteKeyPayload

        ############ ADMIN - CREATE NEW USER ##############

        ############### TYK #####################

        createNewApiKey(input: CreateNewApiKeyInput!): CreateNewApiKeyPayload
        createNewUser(input: CreateNewUserInput!): CreateNewUserPayload

        ############ ADMIN - DELETE USER ###################

        deleteUser(input: DeleteUserInput): DeleteUserPayload

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

    ################# DELETE KEY ########################
    
    input DeleteKeyInput {
        keyHash: String!
    }

    type DeleteKeyPayload {
        key: String
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

    ################## TYK ##########################

    input AllowedUrls {
        url: String
        methods: [String]
    }

    input AccessRights {
        id: String
        name: String
        urls: [AllowedUrls]
    }

    input CreateNewApiKeyInput {
        access: [AccessRights]
    }
    type CreateNewApiKeyPayload {
        key: String
        keyHash: String
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

    ############ ADMIN DELETE USER ###################

    input DeleteUserInput {
        id: ID!
    }
    type DeleteUserPayload {
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
