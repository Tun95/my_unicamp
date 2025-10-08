import { Search } from "lucide-react";

interface CoursesHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  resultsCount: number;
}

const CoursesHeader = ({
  searchTerm,
  onSearchChange,
  resultsCount,
}: CoursesHeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-8 max-900px:px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Browse All Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
            Discover {resultsCount}+ programs from top universities worldwide
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search courses, universities, or fields of study..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesHeader;
