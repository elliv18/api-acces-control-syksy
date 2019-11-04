export default `
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
`;
