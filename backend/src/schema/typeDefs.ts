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
        createdAt: String!
        updatedAt: String!
    }

    ########
    # Apis #
    ########

    type Api {
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

        getApiList: [Api]
    }

    #############
    # Mutations #
    #############

    type Mutation {
        ########## CURRENTUSER ##############

        currentUser: User

        ############# LOGIN #################

        # ALL - login
        login(input: LoginInput!): LoginPayload

        ############# SIGNUP ################

        signup(input: SignupInput!): SignupPayload

        ############### TYK #####################

        createNewApiKey(input: CreateNewApiKeyInput!): CreateNewApiKeyPayload
    }

    ##############################
    # Mutation inputs & payloads #
    ##############################

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
        apiUrl: String
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
    }
`;
