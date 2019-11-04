export default `
    type Mutation {
        currentUserUpdatePW(input: CurrentUserUpdatePWInput): CurrentUserUpdatePWPayload
    }

    input CurrentUserUpdatePWInput {
        password: String!
        passwordAgain: String!
        oldPassword: String!
    }
    type CurrentUserUpdatePWPayload {
        user: User
    }
`;
