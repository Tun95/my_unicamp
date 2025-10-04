// src/graphql/mockResolvers.ts
import { mockProducts, mockWarehouses } from "../data/data";
import { generateRecentKpiData } from "../utilities/utils/Utils";
import { Product } from "../types/data/datatype";

export const mockResolvers = {
  Query: {
    products: () => mockProducts,
    warehouses: () => mockWarehouses,
    kpis: (_: unknown, args: { range?: string }) => {
      const range = args?.range || "7d";
      console.log("Received range:", range);
      const days = parseInt(range.replace("d", ""), 10);
      return generateRecentKpiData(days);
    },
  },
  Mutation: {
    updateDemand: (
      _: unknown,
      args: { productId: string; newDemand: number }
    ) => {
      const { productId, newDemand } = args;

      console.log("Update demand args:", args);

      const productIndex = mockProducts.findIndex((p) => p.id === productId);
      if (productIndex === -1) {
        throw new Error(`Product not found with ID: ${productId}`);
      }

      mockProducts[productIndex].demand = newDemand;
      console.log("Updated product demand:", mockProducts[productIndex]);
      return mockProducts[productIndex];
    },
    transferStock: (
      _: unknown,
      args: {
        productId: string;
        sourceWarehouse: string;
        destinationWarehouse: string;
        quantity: number;
      }
    ) => {
      const { productId, sourceWarehouse, destinationWarehouse, quantity } =
        args;

      console.log("Transfer stock args:", args);

      // Find source product
      const sourceProductIndex = mockProducts.findIndex(
        (p) => p.id === productId && p.warehouse === sourceWarehouse
      );

      if (sourceProductIndex === -1) {
        throw new Error(
          `Product not found in source warehouse: ${sourceWarehouse}`
        );
      }

      if (mockProducts[sourceProductIndex].stock < quantity) {
        throw new Error(
          `Insufficient stock for transfer. Available: ${mockProducts[sourceProductIndex].stock}, Requested: ${quantity}`
        );
      }

      // Update source warehouse stock (deduct the transfer quantity)
      mockProducts[sourceProductIndex].stock -= quantity;
      console.log(
        "Updated source product stock:",
        mockProducts[sourceProductIndex]
      );

      // Find or create product in destination warehouse
      const destProductIndex = mockProducts.findIndex(
        (p) => p.id === productId && p.warehouse === destinationWarehouse
      );

      if (destProductIndex === -1) {
        const newProduct: Product = {
          ...mockProducts[sourceProductIndex],
          warehouse: destinationWarehouse,
          stock: quantity,
        };
        mockProducts.push(newProduct);
        console.log("Created new product in destination:", newProduct);
      } else {
        mockProducts[destProductIndex].stock += quantity;
        console.log(
          "Updated destination product stock:",
          mockProducts[destProductIndex]
        );
      }

      return mockProducts[sourceProductIndex];
    },
  },
};
