import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Grid, List } from "lucide-react";
import CoursesFilter from "./sections/CoursesFilter";
import CourseCard from "../../../common/course card/CourseCard";
import CoursesHeader from "./sections/CoursesHeader";
import {
  Course,
  CourseFilters,
  FilterOptions,
} from "../../../types/course/course";
import { courseService } from "../../../services/courseService";
import CompareCoursesModal from "../../../common/modal/CompareCoursesModal";
import { useNavigate } from "react-router-dom";

type ViewMode = "grid" | "list";

interface LocalPaginationInfo {
  current_page: number;
  total_pages: number;
  total: number;
  limit: number;
  has_more: boolean;
}

const Courses = () => {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [courses, setCourses] = useState<Course[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<LocalPaginationInfo>({
    current_page: 1,
    total_pages: 1,
    total: 0,
    limit: 6,
    has_more: false,
  });

  const [filters, setFilters] = useState<CourseFilters>({
    page: 1,
    limit: 6, // Start with 6 items
    sort_by: "createdAt",
    sort_order: "desc",
  });

  // Track accumulated limit for display
  const [displayLimit, setDisplayLimit] = useState(6);

  // Fetch filter options on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setOptionsLoading(true);
        const options = await courseService.getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
        setFilterOptions({
          universities: [],
          degree_types: ["Bachelor", "Master", "PhD", "Diploma", "Certificate"],
          fields_of_study: [],
          countries: [],
          cities: [],
          durations: [],
          tuition_range: { minTuition: 0, maxTuition: 100000 },
        });
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch courses when filters change
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        // Create a clean filters object that only includes filters with actual values
        const cleanFilters: CourseFilters = {
          page: 1, // Always start from page 1 when filters change
          limit: displayLimit, // Use the current display limit
          sort_by: filters.sort_by,
          sort_order: filters.sort_order,
        };

        // Only add optional filters if they have non-empty values
        if (filters.search && filters.search.trim() !== "") {
          cleanFilters.search = filters.search;
        }
        if (filters.degree_type && filters.degree_type.trim() !== "") {
          cleanFilters.degree_type = filters.degree_type;
        }
        if (filters.field_of_study && filters.field_of_study.trim() !== "") {
          cleanFilters.field_of_study = filters.field_of_study;
        }
        if (filters.city && filters.city.trim() !== "") {
          cleanFilters.city = filters.city;
        }
        if (filters.duration && filters.duration.trim() !== "") {
          cleanFilters.duration = filters.duration;
        }
        if (filters.intake_month && filters.intake_month.trim() !== "") {
          cleanFilters.intake_month = filters.intake_month;
        }
        if (filters.min_tuition !== undefined && filters.min_tuition !== null) {
          cleanFilters.min_tuition = filters.min_tuition;
        }
        if (filters.max_tuition !== undefined && filters.max_tuition !== null) {
          cleanFilters.max_tuition = filters.max_tuition;
        }

        console.log("Sending filters to API:", cleanFilters);
        const response = await courseService.getCourses(cleanFilters);

        // Always replace courses when filters change or initial load
        setCourses(response.data);

        const apiPagination = response.pagination;
        setPagination({
          current_page: apiPagination.current_page,
          total_pages: apiPagination.total_pages,
          total: apiPagination.total,
          limit: apiPagination.limit,
          has_more: apiPagination.has_more ?? false,
        });
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [
    filters.search,
    filters.degree_type,
    filters.field_of_study,
    filters.city,
    filters.duration,
    filters.intake_month,
    filters.min_tuition,
    filters.max_tuition,
    filters.sort_by,
    filters.sort_order,
    displayLimit, // Add displayLimit as dependency
  ]);

  const handleFilterChange = (newFilters: Partial<CourseFilters>) => {
    // Reset display limit when filters change
    setDisplayLimit(6);
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const handleSearch = (searchTerm: string) => {
    // Reset display limit when search changes
    setDisplayLimit(6);
    if (searchTerm.trim() !== "") {
      handleFilterChange({ search: searchTerm });
    } else {
      handleFilterChange({ search: undefined });
    }
  };

  const clearAllFilters = () => {
    setDisplayLimit(6);
    setFilters({
      page: 1,
      limit: 6,
      sort_by: "createdAt",
      sort_order: "desc",
    });
  };

  const loadMore = async () => {
    if (pagination.has_more && !loadingMore) {
      try {
        setLoadingMore(true);

        // Increase the display limit by 6 (or whatever your initial limit is)
        const newLimit = displayLimit + 6;
        setDisplayLimit(newLimit);

        console.log(`Loading more: increasing limit to ${newLimit}`);
      } catch (error) {
        console.error("Failed to load more courses:", error);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  const hasActiveFilters =
    (filters.search && filters.search.trim() !== "") ||
    (filters.degree_type && filters.degree_type.trim() !== "") ||
    (filters.field_of_study && filters.field_of_study.trim() !== "") ||
    (filters.city && filters.city.trim() !== "") ||
    (filters.duration && filters.duration.trim() !== "") ||
    (filters.intake_month && filters.intake_month.trim() !== "") ||
    filters.min_tuition !== undefined ||
    filters.max_tuition !== undefined;

  // Calculate displayed courses (show all courses up to displayLimit)
  const displayedCourses = courses.slice(0, displayLimit);

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const handleCompareClick = () => {
    const isMobile = window.innerWidth <= 900;

    if (isMobile) {
      // Navigate to compare page on mobile/tablet
      navigate("/courses/compare");
    } else {
      // Open modal on desktop
      setIsCompareModalOpen(true);
    }
  };
  return (
    <>
      <div>
        <Helmet>
          <title>Courses | UNICAMP - Browse All Programs</title>
          <meta
            name="description"
            content="Browse thousands of courses from top universities worldwide. Filter by degree type, location, duration, and more."
          />
        </Helmet>

        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <CoursesHeader
            searchTerm={filters.search || ""}
            onSearchChange={handleSearch}
            resultsCount={pagination.total}
          />

          <div className="container mx-auto px-8 max-900px:px-4 py-8 max-480px:px-2 max-w-7xl ">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <div className="lg:w-80 flex-shrink-0">
                <CoursesFilter
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearAll={clearAllFilters}
                  hasActiveFilters={hasActiveFilters}
                  filterOptions={filterOptions}
                  loading={optionsLoading}
                />
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {loading ? "..." : displayedCourses.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {loading ? "..." : pagination.total}
                    </span>{" "}
                    courses
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="ml-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Compare Button */}
                    <button
                      onClick={handleCompareClick}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Compare Courses
                    </button>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "grid"
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                        aria-label="Grid view"
                      >
                        <Grid size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "list"
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                        aria-label="List view"
                      >
                        <List size={20} />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Loading State - Show whenever loading is true */}
                {loading && (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">
                      Loading courses...
                    </p>
                  </div>
                )}
                {/* Courses Grid/List - Only show when not loading and there are courses */}
                {!loading && displayedCourses.length > 0 && (
                  <>
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                          : "space-y-6"
                      }
                    >
                      {displayedCourses.map((course) => (
                        <CourseCard
                          key={course._id}
                          course={course}
                          variant={viewMode}
                        />
                      ))}
                    </div>

                    {/* Load More */}
                    {pagination.has_more &&
                      displayedCourses.length < pagination.total && (
                        <div className="text-center mt-12">
                          <button
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingMore ? "Loading..." : "Load More Courses"}
                          </button>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Showing {displayedCourses.length} of{" "}
                            {pagination.total} courses
                          </p>
                        </div>
                      )}
                  </>
                )}
                {/* No Results State - Only show when not loading and no courses */}
                {!loading && displayedCourses.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                      🔍
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No courses found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {hasActiveFilters
                        ? "Try adjusting your search terms or filters to see more results."
                        : "No courses available at the moment."}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isCompareModalOpen && (
        <CompareCoursesModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
        />
      )}
    </>
  );
};

export default Courses;
