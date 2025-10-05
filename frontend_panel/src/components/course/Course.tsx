// Course.tsx
import { useEffect, useState } from "react";
import { Plus } from "lucide-react"; // Add Plus import
import FilterBox from "../../common/filters/FilterBox";
import { useSearch, useTheme } from "../../custom hooks/Hooks";
import { courseService } from "../../services/courseService";
import { Course as CourseType } from "../../types/dashboard/dashboard";
import {
  CourseFilters,
  CoursesResponse,
  FilterOptions,
} from "../../types/course/course";
import TableComponent from "./table/CourseTable";
import CreateCourseModal from "../../common/modal/CreateCourseModal";

interface FilterState {
  search: string;
  university: string;
  degree_type: string;
  field_of_study: string;
  location: string;
  is_active: string;
}

function Course() {
  const { theme } = useTheme();
  const { globalSearch, setGlobalSearch } = useSearch();
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    university: "",
    degree_type: "",
    field_of_study: "",
    location: "",
    is_active: "",
  });
  const [showCreateCourse, setShowCreateCourse] = useState(false); // Add modal state
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: globalSearch }));
  }, [globalSearch]);

  const fetchCourses = async (page: number = 1): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const params: CourseFilters = {
        page,
        limit: 10,
      };

      // Add filters if they have values
      if (filters.search) params.search = filters.search;
      if (filters.university) params.university = filters.university;
      if (filters.degree_type) params.degree_type = filters.degree_type;
      if (filters.field_of_study)
        params.field_of_study = filters.field_of_study;
      if (filters.location) params.location = filters.location;
      if (filters.is_active) {
        params.is_active = filters.is_active === "active";
      }

      const response: CoursesResponse = await courseService.getCourses(params);
      setCourses(response.data);
      setTotalPages(response.pagination.total_pages);
      setCurrentPage(response.pagination.current_page);
      setTotalCourses(response.pagination.total);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch courses";
      setError(errorMessage);
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async (): Promise<void> => {
    try {
      const response = await courseService.getFilterOptions();
      setFilterOptions(response.data);
    } catch (err: unknown) {
      console.error("Error fetching filter options:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
    fetchCourses(1);
  }, [filters]);

  const handleSearchChange = (value: string): void => {
    setFilters((prev) => ({ ...prev, search: value }));
    setGlobalSearch(value);
  };

  const handleUniversityChange = (value: string): void => {
    setFilters((prev) => ({ ...prev, university: value }));
  };

  const handleDegreeTypeChange = (value: string): void => {
    setFilters((prev) => ({ ...prev, degree_type: value }));
  };

  const handleFieldOfStudyChange = (value: string): void => {
    setFilters((prev) => ({ ...prev, field_of_study: value }));
  };

  const handleLocationChange = (value: string): void => {
    setFilters((prev) => ({ ...prev, location: value }));
  };

  const handleStatusChange = (value: string): void => {
    setFilters((prev) => ({ ...prev, is_active: value }));
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    fetchCourses(page);
  };

  const handleCourseUpdate = (updatedCourse: CourseType): void => {
    setCourses((prev) =>
      prev.map((course) =>
        course._id === updatedCourse._id ? updatedCourse : course
      )
    );
  };

  const handleRetry = (): void => {
    fetchCourses(currentPage);
  };

  // Clear all filters including global search
  const handleClearAllFilters = (): void => {
    setFilters({
      search: "",
      university: "",
      degree_type: "",
      field_of_study: "",
      location: "",
      is_active: "",
    });
    setGlobalSearch("");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 dark:text-red-400 text-center">
          {error}
          <button
            onClick={handleRetry}
            className="ml-2 text-blue-600 dark:text-blue-400 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`w-full overflow-hidden ${theme === "dark" ? "dark" : ""}`}
      >
        <div
          className={`w-full overflow-hidden ${theme === "dark" ? "dark" : ""}`}
        >
          {/* Header with Add Course Button */}
          <div className="flex justify-between items-center mb-4 pb-2 max-900px:px-4 border-b border-gray-200 dark:border-gray-700 gap-4 max-1045px:flex-col max-1045px:items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 max-480px:text-xl">
                Course Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl text-sm leading-6">
                Manage all courses, filter by university, degree type, field of
                study, and more.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowCreateCourse(true)}
                className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                title="Add a new course"
              >
                <Plus size={18} />
                Add Course
              </button>
            </div>
          </div>
        </div>

        <FilterBox
          onSearchChange={handleSearchChange}
          onUniversityChange={handleUniversityChange}
          onDegreeTypeChange={handleDegreeTypeChange}
          onFieldOfStudyChange={handleFieldOfStudyChange}
          onLocationChange={handleLocationChange}
          onStatusChange={handleStatusChange}
          onClearAllFilters={handleClearAllFilters}
        />

        <TableComponent
          courses={courses}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          fetchCourses={fetchCourses}
          loading={loading}
          onCourseUpdate={handleCourseUpdate}
          totalPages={totalPages}
          totalCourses={totalCourses}
        />

        {/* Create Course Modal */}
        <CreateCourseModal
          isOpen={showCreateCourse}
          onClose={() => setShowCreateCourse(false)}
          fetchCourses={fetchCourses}
          filterOptions={filterOptions}
        />
      </div>
    </div>
  );
}

export default Course;
