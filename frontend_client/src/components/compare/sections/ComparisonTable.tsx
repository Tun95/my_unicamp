import {
  Check,
  X,
  Star,
  MapPin,
  Clock,
  GraduationCap,
  DollarSign,
  Calendar,
  Users,
} from "lucide-react";
import { Course } from "../../../types/course/course";

interface ComparisonTableProps {
  courses: Course[];
}

const ComparisonTable = ({ courses }: ComparisonTableProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Rolling admissions";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const comparisonFields = [
    {
      key: "university",
      label: "University",
      icon: GraduationCap,
      render: (course: Course) => course.university,
    },
    {
      key: "degree_type",
      label: "Degree Type",
      icon: Users,
      render: (course: Course) => course.degree_type,
    },
    {
      key: "field_of_study",
      label: "Field of Study",
      icon: Star,
      render: (course: Course) => course.field_of_study,
    },
    {
      key: "duration",
      label: "Duration",
      icon: Clock,
      render: (course: Course) => course.duration,
    },
    {
      key: "location",
      label: "Location",
      icon: MapPin,
      render: (course: Course) =>
        `${course.location.city}, ${course.location.country}`,
    },
    {
      key: "tuition_fee",
      label: "Tuition Fee",
      icon: DollarSign,
      render: (course: Course) => {
        if (!course.tuition_fee) return "Contact for pricing";

        const amount = formatCurrency(
          course.tuition_fee.amount,
          course.tuition_fee.currency
        );
        switch (course.tuition_fee.period) {
          case "per_year":
            return `${amount}/year`;
          case "per_semester":
            return `${amount}/semester`;
          case "total_course":
            return `${amount} total`;
          default:
            return amount;
        }
      },
    },
    {
      key: "intake_months",
      label: "Intake Months",
      icon: Calendar,
      render: (course: Course) => course.intake_months.join(", "),
    },
    {
      key: "language",
      label: "Language",
      render: (course: Course) => course.language,
    },
    {
      key: "minimum_gpa",
      label: "Minimum GPA",
      render: (course: Course) =>
        course.entry_requirements?.minimum_gpa
          ? `${course.entry_requirements.minimum_gpa}/4.0`
          : "Not specified",
    },
    {
      key: "language_tests",
      label: "Language Tests",
      render: (course: Course) =>
        course.entry_requirements?.language_tests
          ?.map((test) => `${test.test_type}: ${test.minimum_score}`)
          .join(", ") || "Not specified",
    },
    {
      key: "application_deadline",
      label: "Application Deadline",
      render: (course: Course) => formatDate(course.application_deadline),
    },
    {
      key: "is_featured",
      label: "Featured",
      render: (course: Course) =>
        course.is_featured ? (
          <Check className="text-green-500" size={20} />
        ) : (
          <X className="text-gray-400" size={20} />
        ),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left p-4 bg-gray-50 dark:bg-gray-700 text-sm font-semibold text-gray-900 dark:text-white min-w-[200px]">
                Comparison Criteria
              </th>
              {courses.map((course) => (
                <th
                  key={course._id}
                  className="text-left p-4 bg-gray-50 dark:bg-gray-700 min-w-[250px]"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                      {course.university}
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonFields.map((field, index) => (
              <tr
                key={field.key}
                className={`
                  border-b border-gray-100 dark:border-gray-800
                  ${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-900/50"
                      : "bg-white dark:bg-gray-800"
                  }
                `}
              >
                <td className="p-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    {field.icon && (
                      <field.icon size={16} className="text-gray-400" />
                    )}
                    {field.label}
                  </div>
                </td>
                {courses.map((course) => (
                  <td
                    key={`${course._id}-${field.key}`}
                    className="p-4 text-sm text-gray-900 dark:text-white"
                  >
                    {field.render(course)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional Information Section */}
      <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Additional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <div key={course._id} className="text-sm">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {course.university}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                {course.description}
              </p>
              <div className="mt-2">
                <a
                  href={`/courses/${course.slug}`}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Full Details →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
