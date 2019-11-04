export default `
    type Mutation {
        createNewUser(input: CreateNewUserInput!): CreateNewUserPayload
    }

    input CreateNewUserInput {
        userType: UserType!
        email: String!
        password: String!
    }
    type CreateNewUserPayload {
        user: User
    }
`;
