// Hooks.ts
import { RefObject, useContext, useEffect } from "react";
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

export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  callback: () => void
): void => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, callback]);
};
