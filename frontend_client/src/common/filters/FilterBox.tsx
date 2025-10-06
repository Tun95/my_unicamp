// FilterBox.tsx
import { useState, useEffect } from "react";
import { useTheme } from "../../custom hooks/Hooks";
import { courseService } from "../../services/courseService";
import { FilterOptions } from "../../types/course/course";
import { Loader } from "lucide-react";

interface FilterBoxProps {
  onSearchChange: (value: string) => void;
  onUniversityChange: (value: string) => void;
  onDegreeTypeChange: (value: string) => void;
  onFieldOfStudyChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearAllFilters?: () => void;
}

function FilterBox({
  onSearchChange,
  onUniversityChange,
  onDegreeTypeChange,
  onFieldOfStudyChange,
  onLocationChange,
  onStatusChange,
  onClearAllFilters,
}: FilterBoxProps) {
  const { theme } = useTheme();

  const [searchValue, setSearchValue] = useState("");
  const [universityValue, setUniversityValue] = useState("all");
  const [degreeTypeValue, setDegreeTypeValue] = useState("all");
  const [fieldOfStudyValue, setFieldOfStudyValue] = useState("all");
  const [locationValue, setLocationValue] = useState("all");
  const [statusValue, setStatusValue] = useState("all");
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const response = await courseService.getFilterOptions();
        setFilterOptions(response.data);
        setError(null);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch filter options";
        setError(errorMessage);
        console.error("Error fetching filter options:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

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

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocationValue(value);
    onLocationChange(value === "all" ? "" : value);
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
    setLocationValue("all");
    setStatusValue("all");
    onSearchChange("");
    onUniversityChange("");
    onDegreeTypeChange("");
    onFieldOfStudyChange("");
    onLocationChange("");
    onStatusChange("");
    onClearAllFilters?.();
  };

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

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <select
            value={locationValue}
            onChange={handleLocationChange}
            className="w-full h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Locations</option>
            {filterOptions?.locations.map((location) => (
              <option key={location} value={location}>
                {location}
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
