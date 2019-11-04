export default `
    type Mutation {
        userPWReset(input: UserPWResetInput): UserPWResetPayload
    }

    input UserPWResetInput {
        id: ID!
        password: String!
        passwordAgain: String!
    }
    type UserPWResetPayload {
        user: User
    }
`;
