export default `
    type Mutation {
        deleteUser(input: DeleteUserInput): DeleteUserPayload
    }

    input DeleteUserInput {
        user_ids: [String]
    }
    type DeleteUserPayload {
        user: [User]
    }
`;
