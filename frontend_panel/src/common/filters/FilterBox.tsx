// FilterBox.tsx
import { useState, useEffect } from "react";
import { useTheme } from "../../custom hooks/Hooks";
import { Loader } from "lucide-react";
import { FilterOptions } from "../../types/dashboard/dashboard";

interface FilterBoxProps {
  onSearchChange: (value: string) => void;
  onUniversityChange: (value: string) => void;
  onDegreeTypeChange: (value: string) => void;
  onFieldOfStudyChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearAllFilters?: () => void;
  filterOptions?: FilterOptions | null;
}

function FilterBox({
  onSearchChange,
  onUniversityChange,
  onDegreeTypeChange,
  onFieldOfStudyChange,
  onCountryChange,
  onCityChange,
  onStatusChange,
  onClearAllFilters,
  filterOptions,
}: FilterBoxProps) {
  const { theme } = useTheme();

  const [searchValue, setSearchValue] = useState("");
  const [universityValue, setUniversityValue] = useState("all");
  const [degreeTypeValue, setDegreeTypeValue] = useState("all");
  const [fieldOfStudyValue, setFieldOfStudyValue] = useState("all");
  const [countryValue, setCountryValue] = useState("all");
  const [cityValue, setCityValue] = useState("all");
  const [statusValue, setStatusValue] = useState("all");
  const [loading, setLoading] = useState(!filterOptions);
  const [error, setError] = useState<string | null>(null);

  // Get cities filtered by selected country
  const getFilteredCities = () => {
    if (!filterOptions || countryValue === "all") {
      return filterOptions?.cities || [];
    }
    // In a real app, you might want to filter cities by country
    // For now, return all cities since we don't have city-country mapping
    return filterOptions.cities;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setUniversityValue(value);
    onUniversityChange(value === "all" ? "" : value);
  };

  const handleDegreeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDegreeTypeValue(value);
    onDegreeTypeChange(value === "all" ? "" : value);
  };

  const handleFieldOfStudyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFieldOfStudyValue(value);
    onFieldOfStudyChange(value === "all" ? "" : value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCountryValue(value);
    setCityValue("all"); // Reset city when country changes
    onCountryChange(value === "all" ? "" : value);
    onCityChange(""); // Clear city filter
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCityValue(value);
    onCityChange(value === "all" ? "" : value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusValue(value);
    onStatusChange(value === "all" ? "" : value);
  };

  const handleClearAll = () => {
    setSearchValue("");
    setUniversityValue("all");
    setDegreeTypeValue("all");
    setFieldOfStudyValue("all");
    setCountryValue("all");
    setCityValue("all");
    setStatusValue("all");
    onSearchChange("");
    onUniversityChange("");
    onDegreeTypeChange("");
    onFieldOfStudyChange("");
    onCountryChange("");
    onCityChange("");
    onStatusChange("");
    onClearAllFilters?.();
  };

  // If filterOptions are provided via props, we don't need to load them
  useEffect(() => {
    if (filterOptions) {
      setLoading(false);
      setError(null);
    }
  }, [filterOptions]);

  if (loading) {
    return (
      <div
        className={`mb-4 p-4 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white border"
        }`}
      >
        <div className="flex items-center justify-center py-4">
          <Loader className="animate-spin text-gray-500 dark:text-gray-400 mr-2" />
          <span className="text-gray-600 dark:text-gray-400">
            Loading filters...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`mb-4 p-4 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white border"
        }`}
      >
        <div className="text-red-600 dark:text-red-400 text-center">
          Failed to load filters: {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mb-4 p-4 rounded-lg ${
        theme === "dark" ? "bg-gray-800" : "bg-white border"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search Box */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Courses
          </label>
          <input
            type="text"
            placeholder="Search by course title, description..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* University Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            University
          </label>
          <select
            value={universityValue}
            onChange={handleUniversityChange}
            className="w-full h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Universities</option>
            {filterOptions?.universities.map((uni) => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>
        </div>

        {/* Degree Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Degree Type
          </label>
          <select
            value={degreeTypeValue}
            onChange={handleDegreeTypeChange}
            className="w-full h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Degree Types</option>
            {filterOptions?.degree_types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Field of Study Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Field of Study
          </label>
          <select
            value={fieldOfStudyValue}
            onChange={handleFieldOfStudyChange}
            className="w-full h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Fields of Study</option>
            {filterOptions?.fields_of_study.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Country
          </label>
          <select
            value={countryValue}
            onChange={handleCountryChange}
            className="w-full h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Countries</option>
            {filterOptions?.countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City
          </label>
          <select
            value={cityValue}
            onChange={handleCityChange}
            className="w-full h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
            disabled={!filterOptions?.cities.length}
          >
            <option value="all">All Cities</option>
            {getFilteredCities().map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={statusValue}
            onChange={handleStatusChange}
            className="w-full h-9 outline-none bg-white text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleClearAll}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}

export default FilterBox;
