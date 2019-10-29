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
        
        ############# DELETE KEY #################
        
        deleteApiKey(input: DeleteKeyInput): DeleteKeyPayload

        ############ ADMIN CREATE NEW USER ##############

        createNewUser(input: CreateNewUserInput!): CreateNewUserPayload

    }

    ##############################
    # Mutation inputs & payloads #
    ##############################

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

    ############ ADMIN CREATE NEW USER ##############

    input CreateNewUserInput {
        userType: UserType!
        email: String!
        password: String!
    }
    type CreateNewUserPayload {
        user: User
    }
`;
