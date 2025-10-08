import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Grid, List } from "lucide-react";
import CoursesFilter from "./sections/CoursesFilter";
import CourseCard from "../../common/course card/CourseCard";
import CoursesHeader from "./sections/CoursesHeader";
import { Course, CourseFilters } from "../../types/course/course";
import { dummyCourses } from "../../data/dummyCourses";

type ViewMode = "grid" | "list";

const Courses = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<CourseFilters>({
    degree_type: "",
    field_of_study: "",
    location: "",
    duration: "",
    intake_month: "",
    min_tuition: "",
    max_tuition: "",
  });

  const filteredCourses = useMemo(() => {
    return dummyCourses.filter((course: Course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.field_of_study.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.degree_type || course.degree_type === filters.degree_type) &&
        (!filters.field_of_study ||
          course.field_of_study === filters.field_of_study) &&
        (!filters.location || course.location.includes(filters.location)) &&
        (!filters.duration || course.duration === filters.duration) &&
        (!filters.intake_month ||
          course.intake_months.includes(filters.intake_month)) &&
        (!filters.min_tuition ||
          course.tuition_fee.amount >= parseInt(filters.min_tuition)) &&
        (!filters.max_tuition ||
          course.tuition_fee.amount <= parseInt(filters.max_tuition));

      return matchesSearch && matchesFilters;
    });
  }, [searchTerm, filters]);

  const handleFilterChange = (newFilters: CourseFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const clearAllFilters = () => {
    setFilters({
      degree_type: "",
      field_of_study: "",
      location: "",
      duration: "",
      intake_month: "",
      min_tuition: "",
      max_tuition: "",
    });
    setSearchTerm("");
  };

  const hasActiveFilters =
    Object.values(filters).some((value) => value !== "") || searchTerm !== "";

  return (
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
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          resultsCount={filteredCourses.length}
        />

        <div className="container mx-auto px-8 max-900px:px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-80 flex-shrink-0">
              <CoursesFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {filteredCourses.length}
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

              {/* Courses Grid/List */}
              {filteredCourses.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-6"
                  }
                >
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      variant={viewMode}
                    />
                  ))}
                </div>
              ) : (
                /* No Results State */
                <div className="text-center py-16">
                  <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                    🔍
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Try adjusting your search terms or filters to see more
                    results.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Load More (for pagination) */}
              {filteredCourses.length > 0 && (
                <div className="text-center mt-12">
                  <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Load More Courses
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
