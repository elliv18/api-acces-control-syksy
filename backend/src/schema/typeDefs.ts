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
        apiKeysId: [UserApiKeys]
        createdAt: String!
        updatedAt: String!
    }

    ###############
    # UserApiKeys #
    ###############

    type UserApiKeys {
        id: ID!
        hash: String
        userId: User!
        createdAt: String!
        updatedAt: String!
    }

    ###########
    # Queries #
    ###########

    type Query {
        allUsers: [User]
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

`;
