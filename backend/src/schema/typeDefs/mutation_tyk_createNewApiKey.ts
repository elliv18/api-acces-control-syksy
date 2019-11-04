export default `
    type Mutation {
        createNewApiKey(input: CreateNewApiKeyInput!): CreateNewApiKeyPayload
    }

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
`;
