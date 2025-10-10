// components/common/modal/CompareCoursesModal.tsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Course } from "../../types/course/course";
import { courseService } from "../../services/courseService";
import CompareSidebar from "../../components/compare/sections/CompareSidebar";
import EmptyComparison from "../../components/compare/sections/EmptyComparison";
import CompareHeader from "../../components/compare/sections/CompareHeader";
import ComparisonTable from "../../components/compare/sections/ComparisonTable";
import { toast } from "sonner";

interface CompareCoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedCourses?: string[]; // Course IDs that should be pre-selected
}

const CompareCoursesModal = ({
  isOpen,
  onClose,
  preSelectedCourses = [],
}: CompareCoursesModalProps) => {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await courseService.getCourses({ limit: 100, page: 1 });
      const allCourses = response.data;

      setAvailableCourses(allCourses);

      // Pre-select courses if provided
      if (preSelectedCourses.length > 0) {
        const selected = allCourses.filter((course) =>
          preSelectedCourses.includes(course._id)
        );
        setSelectedCourses(selected);
        setAvailableCourses((prev) =>
          prev.filter((course) => !preSelectedCourses.includes(course._id))
        );
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCourseToComparison = (course: Course) => {
    if (selectedCourses.length >= 4) {
      toast.error("Maximum 4 courses can be compared at once");
      return;
    }

    const newSelectedCourses = [...selectedCourses, course];
    setSelectedCourses(newSelectedCourses);
    setAvailableCourses((prev) => prev.filter((c) => c._id !== course._id));
  };

  const removeCourseFromComparison = (courseId: string) => {
    const courseToRemove = selectedCourses.find((c) => c._id === courseId);
    if (!courseToRemove) return;

    setSelectedCourses((prev) => prev.filter((c) => c._id !== courseId));
    setAvailableCourses((prev) => [...prev, courseToRemove]);
  };

  //   const clearAllCourses = () => {
  //     setSelectedCourses([]);
  //     // Reset available courses
  //     courseService
  //       .getCourses({ limit: 100, page: 1 })
  //       .then((response) => {
  //         setAvailableCourses(response.data);
  //       })
  //       .catch((err) => {
  //         console.error("Error resetting courses:", err);
  //       });
  //   };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-7xl h-[96vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Compare Courses
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Compare up to 4 courses side by side
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar - Always visible */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
            <CompareSidebar
              availableCourses={availableCourses}
              onAddCourse={addCourseToComparison}
              selectedCount={selectedCourses.length}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : selectedCourses.length === 0 ? (
              <EmptyComparison
                availableCoursesCount={availableCourses.length}
              />
            ) : (
              <div className="p-6">
                <CompareHeader
                  selectedCourses={selectedCourses}
                  onRemoveCourse={removeCourseFromComparison}
                />
                <ComparisonTable courses={selectedCourses} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareCoursesModal;
