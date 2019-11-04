export default `
    type ApiList {
        id: String
        name: String
        path: String
        tags: String
    }

    type Query {
        getApiList: [ApiList]
    }
`;
