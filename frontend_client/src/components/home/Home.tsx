// HOME.tsx
import { useState, useEffect } from "react";
import HeroSection from "./sections/HeroSection";
import FilterBox from "./sections/FilterBox";
import FeaturedCourses from "./sections/FeaturedCourses";
import StatsSection from "./sections/StatsSection";
import CourseCard from "../../common/course card/CourseCard";
import { Course, FilterOptions } from "../../types/course/course";
import { courseService } from "../../services/courseService";

const Home = () => {
  const [filters, setFilters] = useState({
    degree_type: "",
    field_of_study: "",
    city: "",
    duration: "",
    search: "", // Added search filter
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);

  // Fetch filter options, limited courses, and featured courses on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setOptionsLoading(true);
        const options = await courseService.getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
        // Set default options if API fails
        setFilterOptions({
          universities: [],
          degree_types: ["Bachelor", "Master", "PhD", "Diploma", "Certificate"],
          fields_of_study: [],
          countries: [],
          cities: ["London", "Cambridge", "Oxford", "Manchester", "Edinburgh"],
          durations: [],
          tuition_range: { minTuition: 0, maxTuition: 100000 },
        });
      } finally {
        setOptionsLoading(false);
      }
    };

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getLimitedCourses({
          limit: 6,
          // Apply search filter if present
          search: filters.search || undefined,
        });
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeaturedCourses = async () => {
      try {
        setFeaturedLoading(true);
        const featured = await courseService.getFeaturedCourses(6);
        setFeaturedCourses(featured);
      } catch (error) {
        console.error("Failed to fetch featured courses:", error);
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchFilterOptions();
    fetchCourses();
    fetchFeaturedCourses();
  }, []);

  // Refetch courses when filters change
  useEffect(() => {
    const fetchFilteredCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getLimitedCourses({
          limit: 6,
          search: filters.search || undefined,
          degree_type: filters.degree_type || undefined,
          field_of_study: filters.field_of_study || undefined,
          city: filters.city || undefined,
          duration: filters.duration || undefined,
        });
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch filtered courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredCourses();
  }, [filters]);

  const handleFilterChange = (newFilters: { [key: string]: string }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleSearch = (searchTerm: string) => {
    handleFilterChange({ search: searchTerm });
  };

  // Function to clear all filters including search
  const clearAllFilters = () => {
    setFilters({
      degree_type: "",
      field_of_study: "",
      city: "",
      duration: "",
      search: "",
    });
  };

  // Check if there are any active filters (including search)
  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div>
      {/* Hero Section with Search */}
      <HeroSection onSearch={handleSearch} searchTerm={filters.search} />

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-8 max-900px:px-4 py-12 max-480px:py-6 max-480px:px-2 max-w-7xl ">
          {/* Filter Section */}
          <FilterBox
            onFilterChange={handleFilterChange}
            filterOptions={filterOptions}
            loading={optionsLoading}
            searchTerm={filters.search}
            onClearAll={clearAllFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Results Count */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Available Courses
              <span className="text-gray-500 dark:text-gray-400 text-lg ml-2">
                ({loading ? "Loading..." : `${courses.length} courses found`})
              </span>
            </h2>
            {/* Show active search term */}
            {filters.search && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Showing results for: "{filters.search}"
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Loading courses...
              </p>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-5">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>

              {/* No Results Message */}
              {courses.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                    🔍
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {filters.search || Object.values(filters).some((f) => f)
                      ? "Try adjusting your filters to see more results."
                      : "No courses available at the moment."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Featured Courses Section */}
        <FeaturedCourses
          courses={featuredLoading ? [] : featuredCourses}
          loading={featuredLoading}
        />

        {/* Statistics Section */}
        <StatsSection />
      </main>
    </div>
  );
};

export default Home;
