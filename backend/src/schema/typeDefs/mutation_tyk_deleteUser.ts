export default `
    type Mutation {
        deleteUser(input: DeleteUserInput): DeleteUserPayload
    }

    input DeleteUserInput {
        id: ID!
    }
    type DeleteUserPayload {
        user: User
    }
`;
