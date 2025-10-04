import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;

export const GET_WAREHOUSES = gql`
  query GetWarehouses {
    warehouses {
      code
      name
      city
      country
    }
  }
`;

export const GET_KPIS = gql`
  query GetKpis($range: String!) {
    kpis(range: $range) {
      date
      stock
      demand
    }
  }
`;

export const UPDATE_DEMAND = gql`
  mutation UpdateDemand($productId: String!, $newDemand: Int!) {
    updateDemand(productId: $productId, newDemand: $newDemand) {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;

export const TRANSFER_STOCK = gql`
  mutation TransferStock(
    $productId: String!
    $sourceWarehouse: String!
    $destinationWarehouse: String!
    $quantity: Int!
  ) {
    transferStock(
      productId: $productId
      sourceWarehouse: $sourceWarehouse
      destinationWarehouse: $destinationWarehouse
      quantity: $quantity
    ) {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;
