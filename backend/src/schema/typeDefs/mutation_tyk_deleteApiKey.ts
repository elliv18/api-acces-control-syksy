export default `
    type Mutation {
        deleteApiKey(input: DeleteKeyInput): DeleteKeyPayload
    }

    input DeleteKeyInput {
        keyHash: String!
    }

    type DeleteKeyPayload {
        key: String
    }
`;
