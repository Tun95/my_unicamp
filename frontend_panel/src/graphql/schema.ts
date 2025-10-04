import { gql } from '@apollo/client';

export const typeDefs = gql`
  type Warehouse {
    code: String!
    name: String!
    city: String!
    country: String!
  }

  type Product {
    id: String!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
  }

  type KPI {
    date: String!
    stock: Int!
    demand: Int!
  }

  type Query {
    products: [Product!]!
    warehouses: [Warehouse!]!
    kpis(range: String!): [KPI!]!
  }

  type Mutation {
    updateDemand(productId: String!, newDemand: Int!): Product!
    transferStock(
      productId: String!
      sourceWarehouse: String!
      destinationWarehouse: String!
      quantity: Int!
    ): Product!
  }
`;