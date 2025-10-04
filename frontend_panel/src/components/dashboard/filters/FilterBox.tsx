// FilterBox.tsx
import { useState } from "react";
import { useTheme } from "../../../custom hooks/Hooks";
import { Warehouse } from "../../../types/data/datatype";

interface FilterBoxProps {
  onSearchChange: (value: string) => void;
  onWarehouseChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  warehouses: Warehouse[];
}

function FilterBox({
  onSearchChange,
  onWarehouseChange,
  onStatusChange,
  warehouses,
}: FilterBoxProps) {
  const { theme } = useTheme();
  const [searchValue, setSearchValue] = useState("");
  const [warehouseValue, setWarehouseValue] = useState("all");
  const [statusValue, setStatusValue] = useState("all");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setWarehouseValue(value);
    onWarehouseChange(value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusValue(value);
    onStatusChange(value);
  };

  return (
    <div
      className={`mb-4 p-4 rounded-lg ${
        theme === "dark" ? "bg-gray-800" : "bg-white border"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Box */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by name, SKU, ID"
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Warehouse Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Warehouse
          </label>
          <select
            value={warehouseValue}
            onChange={handleWarehouseChange}
            className="w-full h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Warehouses</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.code} value={warehouse.code}>
                {warehouse.name} ({warehouse.code})
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-sm font-medium  text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={statusValue}
            onChange={handleStatusChange}
            className="w-full h-9 outline-none bg-white text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="low">Low</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterBox;
