import { Plus, Search, GitCompareArrows } from "lucide-react";

interface EmptyComparisonProps {
  availableCoursesCount?: number;
}

const EmptyComparison = ({
  availableCoursesCount = 0,
}: EmptyComparisonProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <GitCompareArrows
            className="text-blue-600 dark:text-blue-400"
            size={32}
          />
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Compare Courses
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Select up to 4 courses to compare their features, tuition fees,
          requirements, and more side by side.
        </p>
        {availableCoursesCount > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {availableCoursesCount} courses available for comparison
          </p>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Search
                className="text-green-600 dark:text-green-400"
                size={20}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Compare features
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Plus
                className="text-purple-600 dark:text-purple-400"
                size={20}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Side by side
            </p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 dark:bg-orange-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <GitCompareArrows
                className="text-orange-600 dark:text-orange-400"
                size={20}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Make decisions
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-left">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            How to compare courses:
          </h3>
          <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
            <li>Browse courses and click "Compare" on any course card</li>
            <li>Add up to 4 courses to comparison</li>
            <li>View side-by-side comparison of all features</li>
            <li>Share or export your comparison results</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default EmptyComparison;
