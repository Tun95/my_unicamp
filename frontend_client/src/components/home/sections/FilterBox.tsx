// FilterBox.tsx
import { useState } from "react";
import { Filter, X } from "lucide-react";
import { FilterOptions } from "../../../types/course/course";

interface FilterBoxProps {
  onFilterChange: (filters: Record<string, string>) => void;
  filterOptions: FilterOptions | null;
  loading?: boolean;
  searchTerm: string;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

const FilterBox = ({
  onFilterChange,
  filterOptions,
  loading = false,
  searchTerm,
  onClearAll,
  hasActiveFilters,
}: FilterBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    degree_type: "",
    field_of_study: "",
    city: "",
    duration: "",
  });

  // Use dynamic options from API or fallback to defaults
  const degreeTypes = filterOptions?.degree_types || [
    "Bachelor",
    "Master",
    "PhD",
    "Diploma",
    "Certificate",
  ];
  const fieldsOfStudy = filterOptions?.fields_of_study || [
    "Computer Science",
    "Business Administration",
    "Mechanical Engineering",
    "Data Science",
    "Psychology",
    "Marketing",
  ];
  const cities = filterOptions?.cities || [
    "London",
    "Cambridge",
    "Oxford",
    "Manchester",
    "Edinburgh",
    "Bristol",
  ];
  const durations = filterOptions?.durations || [
    "6 months",
    "1 year",
    "18 months",
    "2 years",
    "3 years",
    "4 years",
    "5+ years",
  ];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Clear individual search filter
  const clearSearch = () => {
    onFilterChange({ search: "" });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      {/* Mobile Filter Header */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
        >
          <Filter size={20} />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Object.values(filters).filter(Boolean).length +
                (searchTerm ? 1 : 0)}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Content */}
      <div className={`${isOpen ? "block" : "hidden"} lg:block`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Degree Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Degree Type
            </label>
            <select
              value={filters.degree_type}
              onChange={(e) =>
                handleFilterChange("degree_type", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Degrees</option>
              {degreeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Field of Study Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Field of Study
            </label>
            <select
              value={filters.field_of_study}
              onChange={(e) =>
                handleFilterChange("field_of_study", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Fields</option>
              {fieldsOfStudy.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City
            </label>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration
            </label>
            <select
              value={filters.duration}
              onChange={(e) => handleFilterChange("duration", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Any Duration</option>
              {durations.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Active filters:
            </span>

            {/* Search filter badge */}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
                Search: "{searchTerm}"
                <button onClick={clearSearch} className="hover:text-blue-600">
                  <X size={14} />
                </button>
              </span>
            )}

            {/* Dropdown filters badges */}
            {Object.entries(filters).map(
              ([key, value]) =>
                value && (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm"
                  >
                    {value}
                    <button
                      onClick={() => handleFilterChange(key, "")}
                      className="hover:text-blue-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )
            )}

            {/* Clear all button */}
            <button
              onClick={onClearAll}
              className="text-sm text-blue-600 hover:text-blue-700 ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBox;
