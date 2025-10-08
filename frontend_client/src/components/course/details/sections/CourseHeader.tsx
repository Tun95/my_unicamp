import { Course } from "../../../../types/course/course";

interface CourseHeaderProps {
  course: Course;
}

const CourseHeader = ({ course }: CourseHeaderProps) => {
  const getDegreeColor = (degreeType: string) => {
    const colors = {
      Bachelor:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Master: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      PhD: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Diploma:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Certificate: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return (
      colors[degreeType as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 max max-480px:p-4">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          {/* Degree Badge */}
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${getDegreeColor(
              course.degree_type
            )}`}
          >
            {course.degree_type} Program
          </span>

          {/* Course Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {course.title}
          </h1>

          {/* University */}
          <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
            {course.university}
          </p>

          {/* Field of Study */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Field of Study:{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {course.field_of_study}
            </span>
          </p>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {course.description}
          </p>
        </div>

        {/* Tuition Preview */}
        <div className="lg:text-right">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Tuition Fee
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(
                course.tuition_fee.amount,
                course.tuition_fee.currency
              )}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {course.tuition_fee.period.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default CourseHeader;
