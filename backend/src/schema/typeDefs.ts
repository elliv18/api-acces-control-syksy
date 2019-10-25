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

    #type Query {

    #}

    #############
    # Mutations #
    #############

    type Mutation {
        ############# LOGIN #################

        # ALL - login
        # login(input: LoginInput!): LoginPayload

        ############# SIGNUP ################

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

`;
