import {
  MapPin,
  Clock,
  GraduationCap,
  Globe,
  Users,
  Award,
  CheckCircle,
} from "lucide-react";
import { Course } from "../../../../types/course/course";

interface CourseOverviewProps {
  course: Course;
}

const CourseOverview = ({ course }: CourseOverviewProps) => {
  const features = [
    {
      icon: GraduationCap,
      label: "Degree Type",
      value: course.degree_type,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Clock,
      label: "Duration",
      value: course.duration,
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: MapPin,
      label: "Location",
      value: course.location,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Globe,
      label: "Language",
      value: course.language,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: Users,
      label: "Field of Study",
      value: course.field_of_study,
      color: "text-red-600 dark:text-red-400",
    },
    {
      icon: Award,
      label: "Study Mode",
      value: "Full-time", // You might want to add this to your schema
      color: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-480px:p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Course Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div
              className={`p-3 rounded-lg bg-white dark:bg-gray-600 shadow-sm`}
            >
              <feature.icon size={24} className={feature.color} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.label}
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {feature.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Program Highlights
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
            World-class faculty and research opportunities
          </li>
          <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
            Industry partnerships and internship opportunities
          </li>
          <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
            State-of-the-art facilities and resources
          </li>
          <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
            Global alumni network and career support
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CourseOverview;
