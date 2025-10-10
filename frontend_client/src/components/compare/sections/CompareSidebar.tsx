import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { Course } from "../../../types/course/course";

interface CompareSidebarProps {
  availableCourses: Course[];
  onAddCourse: (course: Course) => void;
  selectedCount: number;
  onClose?: () => void; // Add this prop
}

const CompareSidebar = ({
  availableCourses,
  onAddCourse,
  selectedCount,
  onClose,
}: CompareSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = availableCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.field_of_study.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 shadow-xl lg:shadow-lg lg:rounded-lg lg:border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 relative">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add Courses
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedCount}/4
            </span>
            {/* Mobile close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Course List */}
      <div className="flex-1 overflow-y-auto">
        {filteredCourses.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            {searchTerm ? "No courses found" : "No courses available to add"}
          </div>
        ) : (
          <div className="p-2">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg mb-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 text-xs mb-1">
                      {course.university}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{course.degree_type}</span>
                      <span>•</span>
                      <span>{course.duration}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {course.tuition_fee ? (
                        formatCurrency(
                          course.tuition_fee.amount,
                          course.tuition_fee.currency
                        )
                      ) : (
                        <span className="text-gray-400">
                          Contact for pricing
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => onAddCourse(course)}
                    className="ml-2 p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex-shrink-0"
                    aria-label={`Add ${course.title} to comparison`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareSidebar;
