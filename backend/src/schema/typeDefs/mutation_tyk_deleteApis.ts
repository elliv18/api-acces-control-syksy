export default `
    type Mutation {
        deleteApis(input: DeleteApisInput): DeleteApisPayload
    }

    input DeleteApisInput {
        api_ids: [String]
    }
    type DeleteApisPayload {
        deleted_apis: [Api]
    }
`;
