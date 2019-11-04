export default `
    type Mutation {
        signup(input: SignupInput!): SignupPayload
    }

    input SignupInput {
        email: String!
        password: String!
        passwordAgain: String!
    }
    type SignupPayload {
        user: User
    }
`;
