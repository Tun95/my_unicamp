import { Link } from "react-router-dom";
import { MapPin, Clock, GraduationCap, Calendar } from "lucide-react";
import { Course } from "../../types/course/course";

interface CourseCardProps {
  course: Course;
  variant?: "grid" | "list";
}

const CourseCard = ({ course, variant = "grid" }: CourseCardProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getFeeDisplay = (tuitionFee: {
    amount: number;
    currency: string;
    period: string;
  }) => {
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

  // Helper function to render location safely
  const renderLocation = (location: Course["location"]) => {
    if (!location) return "Location not available";
    return `${location.city}${location.country ? `, ${location.country}` : ""}`;
  };

  if (variant === "list") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Left Content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-3">
                    {course.university}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getDegreeColor(
                      course.degree_type
                    )}`}
                  >
                    {course.degree_type}
                  </span>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    {course.tuition_fee
                      ? getFeeDisplay(course.tuition_fee)
                      : "Fee not available"}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {course.description}
              </p>

              {/* Course Details Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <GraduationCap size={16} className="flex-shrink-0" />
                  <span className="line-clamp-1">{course.field_of_study}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="flex-shrink-0" />
                  {/* ✅ FIXED: Render location properly */}
                  <span className="line-clamp-1">
                    {renderLocation(course.location)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="flex-shrink-0" />
                  <span className="line-clamp-1">{course.duration}</span>
                </div>
                {course.intake_months && course.intake_months.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="flex-shrink-0" />
                    <span className="line-clamp-1">
                      {course.intake_months.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Action */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 lg:gap-4 lg:text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {course.application_deadline && (
                  <div className="whitespace-nowrap">
                    Apply by{" "}
                    {new Date(course.application_deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
              <Link
                to={`/courses/${course.slug || course._id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (original implementation)
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header with University and Degree Badge */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1 mr-2">
            {course.title}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${getDegreeColor(
              course.degree_type
            )}`}
          >
            {course.degree_type}
          </span>
        </div>
        <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2 line-clamp-1">
          {course.university}
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 min-h-[2.5rem]">
          {course.description}
        </p>
      </div>

      {/* Course Details - This section will grow to fill available space */}
      <div className="p-6 space-y-3 flex-1">
        {/* Field of Study */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <GraduationCap size={16} className="flex-shrink-0" />
          <span className="line-clamp-1">{course.field_of_study}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin size={16} className="flex-shrink-0" />
          {/* ✅ FIXED: Render location properly */}
          <span className="line-clamp-1">
            {renderLocation(course.location)}
          </span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock size={16} className="flex-shrink-0" />
          <span className="line-clamp-1">{course.duration}</span>
        </div>

        {/* Intake Months */}
        {course.intake_months && course.intake_months.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar size={16} className="flex-shrink-0" />
            <span className="line-clamp-1">
              Intake: {course.intake_months.join(", ")}
            </span>
          </div>
        )}

        {/* Spacer to push tuition fee to bottom */}
        <div className="flex-1"></div>

        {/* Tuition Fee - Always at bottom of this section */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white line-clamp-1">
              {course.tuition_fee
                ? getFeeDisplay(course.tuition_fee)
                : "Fee not available"}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tuition fee
            </div>
          </div>
        </div>
      </div>

      {/* Footer with CTA - Fixed at bottom */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 min-w-0 flex-1 mr-4">
            {course.application_deadline && (
              <span className="line-clamp-1">
                Apply by{" "}
                {new Date(course.application_deadline).toLocaleDateString()}
              </span>
            )}
          </div>
          <Link
            to={`/courses/${course.slug || course._id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
