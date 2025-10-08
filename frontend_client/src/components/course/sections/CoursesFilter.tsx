import { Filter, X } from "lucide-react";
import { useState } from "react";
import { CourseFilters } from "../../../types/course/course";

interface CoursesFilterProps {
  filters: CourseFilters;
  onFilterChange: (filters: CourseFilters) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

const CoursesFilter = ({
  filters,
  onFilterChange,
  onClearAll,
  hasActiveFilters,
}: CoursesFilterProps) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const filterOptions = {
    degree_type: [
      { value: "", label: "All Degrees" },
      { value: "Bachelor", label: "Bachelor" },
      { value: "Master", label: "Master" },
      { value: "PhD", label: "PhD" },
      { value: "Diploma", label: "Diploma" },
      { value: "Certificate", label: "Certificate" },
    ],
    field_of_study: [
      { value: "", label: "All Fields" },
      { value: "Computer Science", label: "Computer Science" },
      { value: "Business Administration", label: "Business Administration" },
      { value: "Mechanical Engineering", label: "Mechanical Engineering" },
      { value: "Data Science", label: "Data Science" },
      { value: "Psychology", label: "Psychology" },
      { value: "Marketing", label: "Marketing" },
      { value: "Medicine", label: "Medicine" },
      { value: "Law", label: "Law" },
    ],
    location: [
      { value: "", label: "All Locations" },
      { value: "USA", label: "United States" },
      { value: "Canada", label: "Canada" },
      { value: "UK", label: "United Kingdom" },
      { value: "Australia", label: "Australia" },
      { value: "Germany", label: "Germany" },
      { value: "Online", label: "Online" },
    ],
    duration: [
      { value: "", label: "Any Duration" },
      { value: "6 months", label: "6 months" },
      { value: "1 year", label: "1 year" },
      { value: "18 months", label: "18 months" },
      { value: "2 years", label: "2 years" },
      { value: "3 years", label: "3 years" },
      { value: "4 years", label: "4 years" },
      { value: "5+ years", label: "5+ years" },
    ],
    intake_month: [
      { value: "", label: "Any Intake" },
      { value: "January", label: "January" },
      { value: "February", label: "February" },
      { value: "March", label: "March" },
      { value: "April", label: "April" },
      { value: "May", label: "May" },
      { value: "June", label: "June" },
      { value: "July", label: "July" },
      { value: "August", label: "August" },
      { value: "September", label: "September" },
      { value: "October", label: "October" },
      { value: "November", label: "November" },
      { value: "December", label: "December" },
    ],
  };

  const tuitionRanges = [
    { value: "", label: "Any Tuition" },
    { value: "0-10000", label: "Under $10,000" },
    { value: "10000-20000", label: "$10,000 - $20,000" },
    { value: "20000-30000", label: "$20,000 - $30,000" },
    { value: "30000-50000", label: "$30,000 - $50,000" },
    { value: "50000-100000", label: "$50,000 - $100,000" },
    { value: "100000", label: "Over $100,000" },
  ];

  const handleFilterChange = (key: keyof CourseFilters, value: string) => {
    const newFilters = { ...filters };

    if (key === "min_tuition" || key === "max_tuition") {
      newFilters[key] = value;
    } else {
      newFilters[key] = value;
    }

    onFilterChange(newFilters);
  };

  const handleTuitionRangeChange = (value: string) => {
    const newFilters = { ...filters };

    if (value === "") {
      newFilters.min_tuition = "";
      newFilters.max_tuition = "";
    } else {
      const [min, max] = value.split("-");
      newFilters.min_tuition = min;
      newFilters.max_tuition = max || "";
    }

    onFilterChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== "").length;
  };

  const FilterSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="py-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-2">
      {/* Degree Type */}
      <FilterSection title="Degree Type">
        <div className="space-y-2">
          {filterOptions.degree_type.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="degree_type"
                value={option.value}
                checked={filters.degree_type === option.value}
                onChange={(e) =>
                  handleFilterChange("degree_type", e.target.value)
                }
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Field of Study */}
      <FilterSection title="Field of Study">
        <select
          value={filters.field_of_study}
          onChange={(e) => handleFilterChange("field_of_study", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          {filterOptions.field_of_study.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location">
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          {filterOptions.location.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Duration */}
      <FilterSection title="Duration">
        <select
          value={filters.duration}
          onChange={(e) => handleFilterChange("duration", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          {filterOptions.duration.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Intake Month */}
      <FilterSection title="Intake Month">
        <select
          value={filters.intake_month}
          onChange={(e) => handleFilterChange("intake_month", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          {filterOptions.intake_month.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Tuition Range */}
      <FilterSection title="Tuition Fee Range">
        <select
          value={`${filters.min_tuition}-${filters.max_tuition}`}
          onChange={(e) => handleTuitionRangeChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          {tuitionRanges.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Filter size={20} />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filters
          </h2>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          )}
        </div>
        <FilterContent />
      </div>

      {/* Mobile Filters Overlay */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filters
                </h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <FilterContent />
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Show Results
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      onClearAll();
                      setIsMobileFiltersOpen(false);
                    }}
                    className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 rounded-lg font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoursesFilter;
