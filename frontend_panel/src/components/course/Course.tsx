// Course.tsx
import { useEffect, useState } from "react";
import FilterBox from "../../common/filters/FilterBox";
import { useTheme } from "../../custom hooks/Hooks";
import { courseService } from "../../services/courseService";
import { Course as CourseType } from "../../types/dashboard/dashboard";
import { CourseFilters, CoursesResponse } from "../../types/course/course";
import TableComponent from "./table/CourseTable";

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
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    university: "",
    degree_type: "",
    field_of_study: "",
    location: "",
    is_active: "",
  });

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
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch courses";
      setError(errorMessage);
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
    fetchCourses(1);
  }, [filters]);

  const handleSearchChange = (value: string): void => {
    setFilters((prev) => ({ ...prev, search: value }));
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
          {/* Welcome message */}
          <div className="mb-2 max-480px:mb-1">
            <div className="content max-900px:px-2 max-900px:mt-3 max-480px:p-2 max-480px:pb-0">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 max-480px:text-xl">
                Course Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl text-sm leading-6">
                Manage all courses, filter by university, degree type, field of
                study, and more.
              </p>
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
        />

        <TableComponent
          courses={courses}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          fetchCourses={fetchCourses}
          loading={loading}
          onCourseUpdate={handleCourseUpdate}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

export default Course;
