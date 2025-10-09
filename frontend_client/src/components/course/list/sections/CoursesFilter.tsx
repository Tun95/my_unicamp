import { Filter, X } from "lucide-react";
import { useState, useRef } from "react";
import { CourseFilters, FilterOptions } from "../../../../types/course/course";
import { useClickOutside } from "../../../../custom hooks/Hooks";

interface CoursesFilterProps {
  filters: CourseFilters;
  onFilterChange: (filters: Partial<CourseFilters>) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  filterOptions: FilterOptions | null;
  loading?: boolean;
}

const CoursesFilter = ({
  filters,
  onFilterChange,
  onClearAll,
  filterOptions,
  loading = false,
}: CoursesFilterProps) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const mobileFiltersRef = useRef<HTMLDivElement>(null);

  // Close mobile filters when clicking outside
  useClickOutside(mobileFiltersRef, () => {
    if (isMobileFiltersOpen) {
      setIsMobileFiltersOpen(false);
    }
  });

  // Use dynamic options from API or fallback to defaults
  const degreeTypes = filterOptions?.degree_types || [
    "Bachelor",
    "Master",
    "PhD",
    "Diploma",
    "Certificate",
  ];

  const fieldsOfStudy = filterOptions?.fields_of_study || [];
  const cities = filterOptions?.cities || [];
  const durations = filterOptions?.durations || [];

  const intakeMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const tuitionRanges = [
    { value: "", label: "Any Tuition" },
    { value: "0-10000", label: "Under £10,000" },
    { value: "10000-20000", label: "£10,000 - £20,000" },
    { value: "20000-30000", label: "£20,000 - £30,000" },
    { value: "30000-50000", label: "£30,000 - £50,000" },
    { value: "50000-100000", label: "£50,000 - £100,000" },
    { value: "100000", label: "Over £100,000" },
  ];

  const handleFilterChange = (key: keyof CourseFilters, value: string) => {
    onFilterChange({ [key]: value });
  };

  const handleTuitionRangeChange = (value: string) => {
    if (value === "") {
      onFilterChange({
        min_tuition: undefined,
        max_tuition: undefined,
      });
    } else {
      const [min, max] = value.split("-");
      onFilterChange({
        min_tuition: min ? parseInt(min) : undefined,
        max_tuition: max ? parseInt(max) : undefined,
      });
    }
  };

  const getActiveFiltersCount = () => {
    // Define which filters we want to count (exclude pagination and sorting)
    const filtersToCount: (keyof CourseFilters)[] = [
      "search",
      "degree_type",
      "field_of_study",
      "city",
      "duration",
      "intake_month",
      "min_tuition",
      "max_tuition",
    ];

    return filtersToCount.filter((key) => {
      const value = filters[key];

      // Check if the filter has a meaningful value
      if (value === undefined || value === null) return false;

      if (typeof value === "string") {
        return value.trim() !== "";
      }

      if (typeof value === "number") {
        return true; // Numbers are always considered active
      }

      return false;
    }).length;
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
          <label className="flex items-center">
            <input
              type="radio"
              name="degree_type"
              value=""
              checked={!filters.degree_type || filters.degree_type === ""}
              onChange={(e) =>
                handleFilterChange("degree_type", e.target.value)
              }
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              All Degrees
            </span>
          </label>
          {degreeTypes.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="degree_type"
                value={type}
                checked={filters.degree_type === type}
                onChange={(e) =>
                  handleFilterChange("degree_type", e.target.value)
                }
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {type}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Field of Study */}
      <FilterSection title="Field of Study">
        <select
          value={filters.field_of_study || ""}
          onChange={(e) => handleFilterChange("field_of_study", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="">All Fields</option>
          {fieldsOfStudy.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* City */}
      <FilterSection title="City">
        <select
          value={filters.city || ""}
          onChange={(e) => handleFilterChange("city", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Duration */}
      <FilterSection title="Duration">
        <select
          value={filters.duration || ""}
          onChange={(e) => handleFilterChange("duration", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="">Any Duration</option>
          {durations.map((duration) => (
            <option key={duration} value={duration}>
              {duration}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Intake Month */}
      <FilterSection title="Intake Month">
        <select
          value={filters.intake_month || ""}
          onChange={(e) => handleFilterChange("intake_month", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="">Any Intake</option>
          {intakeMonths.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Tuition Range */}
      <FilterSection title="Tuition Fee Range">
        <select
          value={`${filters.min_tuition || ""}-${filters.max_tuition || ""}`}
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

  if (loading) {
    return (
      <div className="lg:w-80 flex-shrink-0">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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

  const activeFiltersCount = getActiveFiltersCount();

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
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
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
          {activeFiltersCount > 0 && (
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setIsMobileFiltersOpen(false)}
        >
          {/* Filter Drawer */}
          <div
            ref={mobileFiltersRef}
            className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed */}
            <div className="flex-shrink-0">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Filters
                  </h2>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    aria-label="Close filters"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 pb-0">
                <FilterContent />
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0">
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="space-y-3">
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Show Results
                  </button>
                  {activeFiltersCount > 0 && (
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
        </div>
      )}
    </>
  );
};

export default CoursesFilter;
