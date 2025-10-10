import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Trash2, Download, Share2 } from "lucide-react";
import { Course } from "../../types/course/course";
import { courseService } from "../../services/courseService";
import EmptyComparison from "./sections/EmptyComparison";
import CompareHeader from "./sections/CompareHeader";
import ComparisonTable from "./sections/ComparisonTable";
import CompareSidebar from "./sections/CompareSidebar";

const CompareCourses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all courses for comparison
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all active courses for comparison
        const response = await courseService.getCourses({
          limit: 100, // Get enough courses for comparison
          page: 1,
        });

        const allCourses = response.data;
        setAvailableCourses(allCourses);

        // Get course IDs from URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const courseIds = searchParams.get("courses")?.split(",") || [];

        if (courseIds.length > 0) {
          // Filter selected courses from all courses
          const selected = allCourses.filter((course) =>
            courseIds.includes(course._id)
          );
          setSelectedCourses(selected);

          // Update available courses (excluding selected ones)
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
      return; // Course already in comparison
    }

    const newSelectedCourses = [...selectedCourses, course];
    setSelectedCourses(newSelectedCourses);
    updateURL(newSelectedCourses);

    // Remove from available courses
    setAvailableCourses((prev) => prev.filter((c) => c._id !== course._id));
  };

  const removeCourseFromComparison = (courseId: string) => {
    const courseToRemove = selectedCourses.find((c) => c._id === courseId);
    if (!courseToRemove) return;

    const newSelectedCourses = selectedCourses.filter(
      (c) => c._id !== courseId
    );
    setSelectedCourses(newSelectedCourses);
    updateURL(newSelectedCourses);

    // Add back to available courses
    setAvailableCourses((prev) => [...prev, courseToRemove]);
  };

  const clearAllCourses = () => {
    setSelectedCourses([]);
    // Reset available courses by fetching all courses again
    courseService
      .getCourses({ limit: 100, page: 1 })
      .then((response) => {
        setAvailableCourses(response.data);
      })
      .catch((err) => {
        console.error("Error resetting courses:", err);
      });
    updateURL([]);
  };

  const updateURL = (courses: Course[]) => {
    const courseIds = courses.map((course) => course._id).join(",");
    const newSearchParams = courseIds ? `?courses=${courseIds}` : "";
    navigate(`/compare${newSearchParams}`, { replace: true });
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
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        alert("Comparison link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Comparison link copied to clipboard!");
    }
  };

  const handleExportComparison = () => {
    // Generate CSV data
    const headers = [
      "Course",
      "University",
      "Degree Type",
      "Field of Study",
      "Duration",
      "Location",
      "Tuition Fee",
      "Intake Months",
      "Language",
      "Minimum GPA",
      "Language Tests",
      "Application Deadline",
      "Website",
    ];

    const csvData = selectedCourses.map((course) => [
      course.title,
      course.university,
      course.degree_type,
      course.field_of_study,
      course.duration,
      `${course.location.city}, ${course.location.country}`,
      course.tuition_fee
        ? `${course.tuition_fee.currency} ${course.tuition_fee.amount} ${course.tuition_fee.period}`
        : "Contact for pricing",
      course.intake_months.join(", "),
      course.language,
      course.entry_requirements?.minimum_gpa?.toString() || "Not specified",
      course.entry_requirements?.language_tests
        ?.map((t) => `${t.test_type}: ${t.minimum_score}`)
        .join("; ") || "Not specified",
      course.application_deadline
        ? new Date(course.application_deadline).toLocaleDateString()
        : "Rolling admissions",
      course.website_url || "Not available",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((field) => `"${field}"`).join(",")),
    ].join("\n");

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `course-comparison-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
          <div className="container mx-auto px-8 max-900px:px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/courses"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span className="font-medium">Back to Courses</span>
                </Link>

                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Compare Courses{" "}
                  {selectedCourses.length > 0 && `(${selectedCourses.length})`}
                </h1>
              </div>

              {selectedCourses.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleShareComparison}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Share2 size={18} />
                    <span className="hidden sm:inline">Share</span>
                  </button>

                  <button
                    onClick={handleExportComparison}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Download size={18} />
                    <span className="hidden sm:inline">Export CSV</span>
                  </button>

                  <button
                    onClick={clearAllCourses}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={18} />
                    <span className="hidden sm:inline">Clear All</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-8 max-900px:px-4 py-8">
          {selectedCourses.length === 0 ? (
            <EmptyComparison availableCoursesCount={availableCourses.length} />
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Comparison Content */}
              <div className="flex-1">
                <CompareHeader
                  selectedCourses={selectedCourses}
                  onRemoveCourse={removeCourseFromComparison}
                />

                <ComparisonTable courses={selectedCourses} />
              </div>

              {/* Sidebar for Adding Courses */}
              <CompareSidebar
                availableCourses={availableCourses}
                onAddCourse={addCourseToComparison}
                selectedCount={selectedCourses.length}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareCourses;
