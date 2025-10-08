import { useState, useMemo } from "react";
import HeroSection from "./sections/HeroSection";
import FilterBox from "./sections/FilterBox";
import FeaturedCourses from "./sections/FeaturedCourses";
import StatsSection from "./sections/StatsSection";
import { dummyCourses } from "../../data/dummyCourses";
import CourseCard from "../../common/course card/CourseCard";
import { Course } from "../../types/course/course";

const Home = () => {
  const [filters, setFilters] = useState({
    degree_type: "",
    field_of_study: "",
    location: "",
    duration: "",
  });

  const filteredCourses = useMemo(() => {
    return dummyCourses.filter((course: Course) => {
      return (
        (!filters.degree_type || course.degree_type === filters.degree_type) &&
        (!filters.field_of_study ||
          course.field_of_study === filters.field_of_study) &&
        (!filters.location || course.location.includes(filters.location)) &&
        (!filters.duration || course.duration === filters.duration)
      );
    });
  }, [filters]);

  const handleFilterChange = (newFilters: { [key: string]: string }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-8 max-900px:px-4 py-12 max-480px:py-6 max-480px:px-2 max-w-7xl ">
          {/* Filter Section */}
          <FilterBox onFilterChange={handleFilterChange} />

          {/* Results Count */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Available Courses
              <span className="text-gray-500 dark:text-gray-400 text-lg ml-2">
                ({filteredCourses.length} courses found)
              </span>
            </h2>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-5">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          {/* No Results Message */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                🔍
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </div>

        {/* Featured Courses Section */}
        <FeaturedCourses courses={dummyCourses} />

        {/* Statistics Section */}
        <StatsSection />
      </main>
    </div>
  );
};

export default Home;
