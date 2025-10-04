import React, { createContext, useState, ReactNode } from "react";
import { DateRangeContextType } from "../types/date/daterange";

const DateRangeContext = createContext<DateRangeContextType | undefined>(
  undefined
);

export const DateRangeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState("7d");

  return (
    <DateRangeContext.Provider
      value={{ selectedDateRange, setSelectedDateRange }}
    >
      {children}
    </DateRangeContext.Provider>
  );
};

export { DateRangeContext };
