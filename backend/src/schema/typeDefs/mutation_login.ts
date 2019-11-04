export default `
    type Mutation {
        login(input: LoginInput!): LoginPayload
    }

    input LoginInput {
        email: String!  
        password: String!
    }
    type LoginPayload {
        jwt: String
    }
`;
