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
`;
