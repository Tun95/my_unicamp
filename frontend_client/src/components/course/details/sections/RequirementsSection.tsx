import { CheckCircle, Star, Users, BookOpen } from "lucide-react";
import { EntryRequirements } from "../../../../types/course/course";

interface RequirementsSectionProps {
  requirements: EntryRequirements;
}

const RequirementsSection = ({ requirements }: RequirementsSectionProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Entry Requirements
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Academic Requirements */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" />
            Academic Requirements
          </h3>

          <div className="space-y-4">
            {requirements.minimum_gpa && (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">
                  Minimum GPA
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {requirements.minimum_gpa}/4.0
                </span>
              </div>
            )}

            {requirements.prerequisites.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Prerequisites
                </h4>
                <ul className="space-y-2">
                  {requirements.prerequisites.map((prereq, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <CheckCircle
                        size={16}
                        className="text-green-500 flex-shrink-0"
                      />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Language Requirements */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users size={20} className="text-green-600" />
            Language Requirements
          </h3>

          <div className="space-y-4">
            {requirements.language_tests.map((test, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {test.test_type}
                  </span>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm font-medium">
                    {test.minimum_score}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Minimum required score for admission
                </p>
              </div>
            ))}
          </div>

          {/* Additional Requirements */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              Additional Requirements
            </h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle
                  size={16}
                  className="text-green-500 flex-shrink-0"
                />
                Completed application form
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle
                  size={16}
                  className="text-green-500 flex-shrink-0"
                />
                Official transcripts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle
                  size={16}
                  className="text-green-500 flex-shrink-0"
                />
                Letters of recommendation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle
                  size={16}
                  className="text-green-500 flex-shrink-0"
                />
                Statement of purpose
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementsSection;
