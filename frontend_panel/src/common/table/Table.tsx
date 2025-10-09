// TableComponent.tsx
import { useState } from "react";
import { useTheme } from "../../custom hooks/Hooks";
import { Loader } from "lucide-react";
import { Course } from "../../types/dashboard/dashboard";
import CourseDetailSidebar from "../../components/dashboard/details/CourseDetails";
import { getStatusColorClasses } from "../../utilities/status/status";
import { formatTuitionFee } from "../../utilities/utils/Utils";

interface TableComponentProps {
  courses: Course[];
  fetchDashboardData?: () => Promise<void>;
  loading?: boolean;
}

function TableComponent({
  courses,
  loading = false,
  fetchDashboardData,
}: TableComponentProps) {
  const { theme } = useTheme();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleRowClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseSidebar = () => {
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400 flex justify-center items-center">
          <Loader className="animate-spin text-gray-500 dark:text-gray-400" />
          Loading courses...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <div
          className={`rounded-lg overflow-hidden ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    } border-b border-gray-200 dark:border-gray-700`}
                  >
                    <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                      Course Title
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                      University
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                      Degree Type
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                      Field of Study
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                      Duration
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                      Fees
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr
                      key={course._id}
                      className={`border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                      onClick={() => handleRowClick(course)}
                    >
                      <td className="p-4 py-2 text-sm text-gray-900 dark:text-white">
                        {course.title}
                      </td>
                      <td className="p-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                        {course.university}
                      </td>
                      <td className="p-4 py-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClasses(
                            course.degree_type
                          )}`}
                        >
                          {course.degree_type}
                        </span>
                      </td>
                      <td className="p-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                        {course.field_of_study}
                      </td>
                      <td className="p-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                        {course.duration}
                      </td>
                      <td className="p-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                        <td className="p-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                          {formatTuitionFee(course.tuition_fee)}
                        </td>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {courses.length === 0 ? (
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md items-center justify-center h-40">
                <div className="text-gray-600 dark:text-gray-400">
                  No courses found
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    }`}
                    onClick={() => handleRowClick(course)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {course.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClasses(
                          course.degree_type
                        )}`}
                      >
                        {course.degree_type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {course.university}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {course.field_of_study}
                    </p>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>{course.duration}</span>
                      <span>{formatTuitionFee(course.tuition_fee)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Detail Sidebar Drawer */}
      {selectedCourse && (
        <CourseDetailSidebar
          course={selectedCourse}
          fetchDashboardData={fetchDashboardData}
          onClose={handleCloseSidebar}
        />
      )}
    </>
  );
}

export default TableComponent;
