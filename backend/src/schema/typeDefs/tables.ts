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
        google_account: Boolean
        email: String
        api_hash: String
        api_key: String
        api_expiry: String
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
        api_root_url: String
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
