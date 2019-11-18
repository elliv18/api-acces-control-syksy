export default `
    type Mutation {
        loginGoogle(input: LoginGoogleInput!): LoginGooglePayload
    }

    input LoginGoogleInput {
        token: String
    }
    type LoginGooglePayload {
        jwt: String
    }
`;
