export default `
    type Mutation {
        createNewApiKey(input: CreateNewApiKeyInput!): CreateNewApiKeyPayload
    }

    input CreateNewApiKeyInput {
        api_keys: [String]
    }
    type CreateNewApiKeyPayload {
        user: User
    }
`;
