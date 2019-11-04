import { mergeTypes } from "merge-graphql-schemas";
import tables from "./tables";
import queries from "./queries";
import mutations from "./mutations";
import mutationsTyk from "./mutationsTyk";

const types = [tables, queries, mutations, mutationsTyk];

export default mergeTypes(types, { all: true });
