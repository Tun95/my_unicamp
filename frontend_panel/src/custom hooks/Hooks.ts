// Hooks.ts
import { useContext } from "react";
import { ThemeContextType } from "../types/theme/theme-types";
import { ThemeContext } from "../context/ThemeContext";
import { SearchContext, SearchContextType } from "../context/Context";

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
