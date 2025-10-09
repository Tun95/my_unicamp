// RELATED COURSES COMPONENT
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Course } from "../../../../types/course/course";
import CourseCard from "../../../../common/course card/CourseCard";
import { courseService } from "../../../../services/courseService";

interface RelatedCoursesProps {
  currentCourseSlug: string;
  limit?: number;
}

const RelatedCourses = ({
  currentCourseSlug,
  limit = 4,
}: RelatedCoursesProps) => {
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedCourses = async () => {
      if (!currentCourseSlug) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await courseService.getRelatedCoursesBySlug(
          currentCourseSlug,
          { limit }
        );
        setRelatedCourses(response.data);
      } catch (err) {
        console.error("Error fetching related courses:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load related courses"
        );
        setRelatedCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedCourses();
  }, [currentCourseSlug, limit]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-480px:p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Related Courses
        </h2>
        <div className="flex items-center justify-center py-8 gap-3 text-gray-600 dark:text-gray-400">
          <Loader2 className="animate-spin h-6 w-6" />
          <span>Loading related courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-480px:p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Related Courses
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (relatedCourses.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-480px:p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Related Courses
        </h2>
        <Link
          to="/courses"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          View All Courses
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {relatedCourses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default RelatedCourses;
