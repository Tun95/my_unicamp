// Hooks.ts
import { useContext, useEffect, useState } from "react";
import { ThemeContextType } from "../types/theme/theme-types";
import { ThemeContext } from "../context/ThemeContext";
import { Product } from "../types/data/datatype";
import { mockProducts } from "../data/data";
import { DateRangeContextType } from "../types/date/daterange";
import { DateRangeContext } from "../context/DateRangeContext";

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useDateRange = (): DateRangeContextType => {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        setProducts(mockProducts);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
