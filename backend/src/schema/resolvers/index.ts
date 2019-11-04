import { mergeResolvers } from "merge-graphql-schemas";
import relations from "./relations";
import queries from "./queries";
import mutations from "./mutations";
import mutationsTyk from "./mutationsTyk";

const resolvers = [relations, queries, mutations, mutationsTyk];

export default mergeResolvers(resolvers);
