import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Trash2, Download, Share2, Plus } from "lucide-react";
import { Course } from "../../types/course/course";
import { courseService } from "../../services/courseService";
import EmptyComparison from "./sections/EmptyComparison";
import CompareHeader from "./sections/CompareHeader";
import ComparisonTable from "./sections/ComparisonTable";
import CompareSidebar from "./sections/CompareSidebar";

const CompareCourses = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch all courses for comparison
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await courseService.getCourses({
          limit: 100,
          page: 1,
        });

        const allCourses = response.data;
        setAvailableCourses(allCourses);

        const searchParams = new URLSearchParams(location.search);
        const courseIds = searchParams.get("courses")?.split(",") || [];

        if (courseIds.length > 0) {
          const selected = allCourses.filter((course) =>
            courseIds.includes(course._id)
          );
          setSelectedCourses(selected);
          setAvailableCourses((prev) =>
            prev.filter((course) => !courseIds.includes(course._id))
          );
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err instanceof Error ? err.message : "Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [location.search]);

  const addCourseToComparison = (course: Course) => {
    if (selectedCourses.length >= 4) {
      alert("Maximum 4 courses can be compared at once");
      return;
    }

    if (selectedCourses.find((c) => c._id === course._id)) {
      return;
    }

    const newSelectedCourses = [...selectedCourses, course];
    setSelectedCourses(newSelectedCourses);
    setAvailableCourses((prev) => prev.filter((c) => c._id !== course._id));

    // Close sidebar on mobile after adding course
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const removeCourseFromComparison = (courseId: string) => {
    const courseToRemove = selectedCourses.find((c) => c._id === courseId);
    if (!courseToRemove) return;

    const newSelectedCourses = selectedCourses.filter(
      (c) => c._id !== courseId
    );
    setSelectedCourses(newSelectedCourses);
    setAvailableCourses((prev) => [...prev, courseToRemove]);
  };

  const clearAllCourses = () => {
    setSelectedCourses([]);
    courseService
      .getCourses({ limit: 100, page: 1 })
      .then((response) => {
        setAvailableCourses(response.data);
      })
      .catch((err) => {
        console.error("Error resetting courses:", err);
      });
  };

  const handleShareComparison = async () => {
    const courseIds = selectedCourses.map((course) => course._id).join(",");
    const shareUrl = `${window.location.origin}/compare?courses=${courseIds}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Course Comparison",
          text: `Compare ${selectedCourses.length} courses on UNICAMP`,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Error sharing:", error);
        navigator.clipboard.writeText(shareUrl);
        alert("Comparison link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Comparison link copied to clipboard!");
    }
  };

  const handleExportComparison = () => {
    // ... your existing export logic ...
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Courses
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>
          {selectedCourses.length > 0
            ? `Compare ${selectedCourses.length} Courses | UNICAMP`
            : "Compare Courses | UNICAMP"}
        </title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navigation Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Left Section - Back button and title */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Link
                  to="/courses"
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex-shrink-0"
                >
                  <ArrowLeft size={16} />
                  <span className="font-medium text-xs hidden xs:inline">
                    Back
                  </span>
                </Link>

                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>

                <div className="min-w-0 flex-1">
                  <h1 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    Compare
                    {selectedCourses.length > 0 && (
                      <span className="text-blue-600 dark:text-blue-400 ml-1">
                        ({selectedCourses.length})
                      </span>
                    )}
                  </h1>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Mobile Sidebar Toggle Button */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded-md font-medium transition-colors text-xs"
                >
                  <Plus size={12} />
                  <span className="hidden xs:inline">
                    {isSidebarOpen ? "Hide" : "Add"}
                  </span>
                </button>

                {selectedCourses.length > 0 && (
                  <div className="hidden sm:flex items-center gap-1">
                    <button
                      onClick={handleShareComparison}
                      className="flex items-center gap-1 px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs"
                    >
                      <Share2 size={14} />
                      <span>Share</span>
                    </button>

                    <button
                      onClick={handleExportComparison}
                      className="flex items-center gap-1 px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs"
                    >
                      <Download size={14} />
                      <span>Export</span>
                    </button>

                    <button
                      onClick={clearAllCourses}
                      className="flex items-center gap-1 px-2 py-1.5 text-red-600 hover:text-red-700 transition-colors text-xs"
                    >
                      <Trash2 size={14} />
                      <span>Clear</span>
                    </button>
                  </div>
                )}

                {/* Mobile Actions Dropdown */}
                {selectedCourses.length > 0 && (
                  <div className="sm:hidden relative">
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>

                    {/* Mobile Dropdown Menu */}
                    {isMobileMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                        <button
                          onClick={() => {
                            handleShareComparison();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Share2 size={12} />
                          Share
                        </button>
                        <button
                          onClick={() => {
                            handleExportComparison();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Download size={12} />
                          Export CSV
                        </button>
                        <button
                          onClick={() => {
                            clearAllCourses();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Trash2 size={12} />
                          Clear All
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-8 max-900px:px-4 py-8">
          {/* Mobile Sidebar Modal */}
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden">
              <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl flex flex-col overflow-hidden">
                <CompareSidebar
                  availableCourses={availableCourses}
                  onAddCourse={addCourseToComparison}
                  selectedCount={selectedCourses.length}
                  onClose={() => setIsSidebarOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          {selectedCourses.length === 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Empty State */}
              <div className="flex-1">
                <EmptyComparison
                  availableCoursesCount={availableCourses.length}
                />
              </div>

              {/* Desktop Sidebar */}
              <div className="hidden lg:block lg:w-80 flex-shrink-0">
                <CompareSidebar
                  availableCourses={availableCourses}
                  onAddCourse={addCourseToComparison}
                  selectedCount={selectedCourses.length}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Comparison Content */}
              <div className="flex-1 overflow-auto">
                <CompareHeader
                  selectedCourses={selectedCourses}
                  onRemoveCourse={removeCourseFromComparison}
                />
                <ComparisonTable courses={selectedCourses} />
              </div>

              {/* Desktop Sidebar */}
              <div className="hidden lg:block lg:w-80 flex-shrink-0">
                <CompareSidebar
                  availableCourses={availableCourses}
                  onAddCourse={addCourseToComparison}
                  selectedCount={selectedCourses.length}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareCourses;
