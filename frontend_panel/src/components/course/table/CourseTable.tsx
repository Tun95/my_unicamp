// TableComponent.tsx
import { useState } from "react";
import { Pagination } from "antd";
import { Loader } from "lucide-react";
import { Course } from "../../../types/dashboard/dashboard";
import { useTheme } from "../../../custom hooks/Hooks";
import { getStatusColorClasses } from "../../../utilities/status/status";
import CourseDetailSidebar from "../../dashboard/details/CourseDetails";

interface TableComponentProps {
  courses: Course[];
  currentPage: number;
  onPageChange: (page: number) => void;
  fetchCourses?: (page?: number) => Promise<void>;
  loading: boolean;
  onCourseUpdate?: (course: Course) => void;
  totalPages?: number;
  totalCourses?: number;
}

function TableComponent({
  courses,
  currentPage,
  onPageChange,
  fetchCourses,
  loading,
  onCourseUpdate,
  totalCourses = 0,
}: TableComponentProps) {
  const { theme } = useTheme();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleRowClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseSidebar = () => {
    setSelectedCourse(null);
  };

  const handleCourseUpdate = (updatedCourse: Course) => {
    if (onCourseUpdate) {
      onCourseUpdate(updatedCourse);
      if (fetchCourses) {
        fetchCourses(currentPage);
      }
    }
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
                    <th className="text-left p-4 text-sm font-medium text-gray-900 dark:text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-4 text-sm text-gray-600 dark:text-gray-300 text-center"
                      >
                        No courses found.
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => (
                      <tr
                        key={course._id}
                        className={`border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                        }`}
                        onClick={() => handleRowClick(course)}
                      >
                        <td className="p-4 text-sm text-gray-900 dark:text-white">
                          {course.title}
                        </td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                          {course.university}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClasses(
                              course.degree_type
                            )}`}
                          >
                            {course.degree_type}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                          {course.field_of_study}
                        </td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                          {course.duration}
                        </td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                          {course.fees}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.is_active
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {course.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
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
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClasses(
                            course.degree_type
                          )}`}
                        >
                          {course.degree_type}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            course.is_active
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {course.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {course.university}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {course.field_of_study}
                    </p>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>{course.duration}</span>
                      <span>{course.fees}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {courses.length > 0 && (
            <div className="p-4 flex justify-end">
              <Pagination
                current={currentPage}
                pageSize={10}
                total={totalCourses} // Approximate total
                onChange={onPageChange}
                showSizeChanger={false}
                className={`pagination-custom ${
                  theme === "dark"
                    ? "dark-pagination [&_.ant-pagination-item]:bg-gray-700 [&_.ant-pagination-item]:border-gray-600 [&_.ant-pagination-item_a]:text-white [&_.ant-pagination-item-active]:bg-gray-800 [&_.ant-pagination-item-active]:border-indigo-600 [&_.ant-pagination-item-active_a]:text-white [&_.ant-pagination-item:hover]:bg-gray-600 [&_.ant-pagination-item-active:hover]:bg-indigo-700 [&_.ant-pagination-prev_button]:text-white [&_.ant-pagination-next_button]:text-white [&_.ant-pagination-disabled_button]:text-gray-500 [&_.ant-pagination-jump-next]:text-white [&_.ant-pagination-jump-prev]:text-white"
                    : "[&_.ant-pagination-item:hover]:bg-gray-100 [&_.ant-pagination-item-active]:bg-indigo-600 [&_.ant-pagination-item-active]:border-indigo-600 [&_.ant-pagination-item-active_a]:text-white [&_.ant-pagination-item-active:hover]:bg-indigo-700"
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Course Detail Sidebar Drawer */}
      {selectedCourse && (
        <CourseDetailSidebar
          course={selectedCourse}
          currentPage={currentPage}
          fetchCourses={fetchCourses}
          loading={false}
          onClose={handleCloseSidebar}
          onCourseUpdate={handleCourseUpdate}
        />
      )}
    </>
  );
}

export default TableComponent;
