import { Link } from "react-router-dom";
import { dummyCourses } from "../../../../data/dummyCourses";
import CourseCard from "../../../../common/course card/CourseCard";

interface RelatedCoursesProps {
  currentCourseId: string;
}

const RelatedCourses = ({ currentCourseId }: RelatedCoursesProps) => {
  const currentCourse = dummyCourses.find((c) => c._id === currentCourseId);

  if (!currentCourse) return null;

  // Find related courses (same field of study, excluding current course)
  const relatedCourses = dummyCourses
    .filter(
      (course) =>
        course._id !== currentCourseId &&
        course.field_of_study === currentCourse.field_of_study
    )
    .slice(0, 3); // Show max 3 related courses

  if (relatedCourses.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-480px:p-4 ">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedCourses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default RelatedCourses;
