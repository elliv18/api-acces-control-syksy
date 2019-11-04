export default `
    #################
    # Mutations TYK #
    #################

    type Mutation {
        ############# DELETE KEY #################
        
        deleteApiKey(input: DeleteKeyInput): DeleteKeyPayload

        ############## CREATE NEW APIKEY ###################

        createNewApiKey(input: CreateNewApiKeyInput!): CreateNewApiKeyPayload

        ############ ADMIN - DELETE USER + API KEY ###################

        deleteUser(input: DeleteUserInput): DeleteUserPayload
    }

    ##################################
    # Mutation inputs TYK & payloads #
    ##################################

    ################# DELETE KEY ########################
    
    input DeleteKeyInput {
        keyHash: String!
    }

    type DeleteKeyPayload {
        key: String
    }

    ################ CREATE NEW API KEY ####################

    input AllowedUrls {
        url: String
        methods: [String]
    }

    input AccessRights {
        id: String
        name: String
        urls: [AllowedUrls]
    }

    input CreateNewApiKeyInput {
        access: [AccessRights]
    }
    type CreateNewApiKeyPayload {
        key: String
        keyHash: String
    }

    ############ ADMIN DELETE USER + API KEY ###################

    input DeleteUserInput {
        id: ID!
    }
    type DeleteUserPayload {
        user: User
    }
`;
