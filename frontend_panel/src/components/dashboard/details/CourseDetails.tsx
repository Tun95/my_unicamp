// CourseDetailSidebar.tsx
import { X } from "lucide-react";
import { Course } from "../../../types/dashboard/dashboard";
import { useTheme } from "../../../custom hooks/Hooks";
import { getStatusColor } from "../../../utilities/status/status";
import { formatDate } from "../../../utilities/utils/Utils";

interface CourseDetailSidebarProps {
  course: Course;
  onClose: () => void;
}

function CourseDetailSidebar({ course, onClose }: CourseDetailSidebarProps) {
  const { theme } = useTheme();

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none`}>
      <div className="absolute inset-y-0 right-0 pointer-events-auto">
        <div
          className={`w-96 h-full shadow-xl max-w-[480px] transition-transform duration-200 ease-in-out ${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } max-480px:w-full`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-l h-16 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Course Details
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-6">
                {/* Course Title */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Course ID: {course._id}
                  </p>
                </div>

                {/* Basic Information Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      University
                    </p>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {course.university}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Degree Type
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(
                        course.degree_type
                      )}-100 text-${getStatusColor(
                        course.degree_type
                      )}-800 dark:bg-${getStatusColor(
                        course.degree_type
                      )}-900 dark:text-${getStatusColor(
                        course.degree_type
                      )}-200 mt-1`}
                    >
                      {course.degree_type}
                    </span>
                  </div>
                </div>

                {/* Field of Study */}
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Field of Study
                  </p>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {course.field_of_study}
                  </p>
                </div>

                {/* Duration and Fees */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Duration
                    </p>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {course.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Fees
                    </p>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {course.fees}
                    </p>
                  </div>
                </div>

                {/* Created Date */}
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created Date
                  </p>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {formatDate(course.createdAt)}
                  </p>
                </div>

                {/* Additional Information Section */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Course Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Degree Level:
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {course.degree_type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Academic Field:
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {course.field_of_study}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Program Length:
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {course.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-3">
                    <button
                      onClick={onClose}
                      className="flex-1 h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        // Add edit functionality here
                        console.log("Edit course:", course._id);
                      }}
                      className="flex-1 h-9 outline-none text-sm px-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Edit Course
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailSidebar;
