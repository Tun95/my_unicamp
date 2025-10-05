// src/contexts/SearchContext.tsx
import React, { createContext, useState, ReactNode } from "react";

export interface SearchContextType {
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  clearGlobalSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [globalSearch, setGlobalSearch] = useState("");

  const clearGlobalSearch = () => {
    setGlobalSearch("");
  };

  return (
    <SearchContext.Provider
      value={{
        globalSearch,
        setGlobalSearch,
        clearGlobalSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export { SearchContext };
