export default `
    type Mutation {
        createNewAPI(input: CreateNewAPIInput): CreateNewAPIPayload
    }

    input Urls {
        url: String
        methods: [String]
    }

    input CreateNewAPIInput {
        name: String!
        url_path: String!
        url_target: String!
        urls: [Urls]!
    }
    type CreateNewAPIPayload {
        key: String
    }
`;
