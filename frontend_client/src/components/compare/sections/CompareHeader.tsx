import { X } from "lucide-react";
import { Course } from "../../../types/course/course";

interface CompareHeaderProps {
  selectedCourses: Course[];
  onRemoveCourse: (courseId: string) => void;
}

const CompareHeader = ({
  selectedCourses,
  onRemoveCourse,
}: CompareHeaderProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getFeeDisplay = (tuitionFee?: {
    amount: number;
    currency: string;
    period: string;
  }) => {
    if (!tuitionFee) {
      return "Contact for pricing";
    }

    const amount = formatCurrency(tuitionFee.amount, tuitionFee.currency);
    switch (tuitionFee.period) {
      case "per_year":
        return `${amount}/year`;
      case "per_semester":
        return `${amount}/semester`;
      case "total_course":
        return `${amount} total`;
      default:
        return amount;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {selectedCourses.map((course) => (
          <div
            key={course._id}
            className="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            {/* Remove Button */}
            <button
              onClick={() => onRemoveCourse(course._id)}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
              aria-label={`Remove ${course.title} from comparison`}
            >
              <X size={16} />
            </button>

            {/* Course Header */}
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                {course.title}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 text-xs font-medium">
                {course.university}
              </p>
            </div>

            {/* Quick Info */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Degree:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {course.degree_type}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Duration:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {course.duration}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Location:
                </span>
                <span className="font-medium text-gray-900 dark:text-white text-right">
                  {course.location.city}, {course.location.country}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Tuition:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {getFeeDisplay(course.tuition_fee)}
                </span>
              </div>
            </div>

            {/* View Details Link */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <a
                href={`/courses/${course.slug || course._id}`}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium"
              >
                View Details →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Placeholder Cards for Empty Slots */}
      {selectedCourses.length < 4 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add {4 - selectedCourses.length} more course
            {selectedCourses.length < 3 ? "s" : ""} to compare
          </p>
        </div>
      )}
    </div>
  );
};

export default CompareHeader;
