// src/graphql/client.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./schema";
import { mockResolvers } from "./mocks";

// Executable schema with our custom resolvers
const schema = makeExecutableSchema({
  typeDefs,
  resolvers: mockResolvers,
});

// Apollo Client with the schema
export const client = new ApolloClient({
  link: new SchemaLink({ schema }),
  cache: new InMemoryCache(),
});
