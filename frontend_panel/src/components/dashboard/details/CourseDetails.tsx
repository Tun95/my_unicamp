// CourseDetailSidebar.tsx
import { X, Edit, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useTheme } from "../../../custom hooks/Hooks";
import { Course } from "../../../types/dashboard/dashboard";
import { courseService } from "../../../services/courseService";
import { useState, useEffect } from "react"; // Add useEffect import
import { toast } from "sonner";
import { getStatusColor } from "../../../utilities/status/status";
import { formatDate } from "../../../utilities/utils/Utils";

interface CourseDetailSidebarProps {
  course: Course;
  currentPage?: number;
  fetchCourses?: (page?: number) => Promise<void>;
  fetchDashboardData?: () => Promise<void>;
  loading?: boolean;
  onClose: () => void;
  onCourseUpdate?: (course: Course) => void;
}

function CourseDetailSidebar({
  course,
  onClose,
  currentPage,
  fetchCourses,
  fetchDashboardData,
  onCourseUpdate,
}: CourseDetailSidebarProps) {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState(course);
  const [loading, setLoading] = useState(false);

  // Reset state when course prop changes
  useEffect(() => {
    // Reset to the new course data and exit edit mode
    setEditedCourse(course);
    setIsEditing(false);
  }, [course]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing, reset to original course
      setEditedCourse(course);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedCourse = await courseService.updateCourse(
        course._id,
        editedCourse
      );
      if (onCourseUpdate) {
        onCourseUpdate(updatedCourse);
      }
      setIsEditing(false);
      if (fetchCourses) {
        fetchCourses(currentPage);
      }
      if (fetchDashboardData) {
        fetchDashboardData();
      }
      toast.success("Course updated successfully!");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    try {
      setLoading(true);
      // Determine the action based on current state
      const action = course.is_active ? "hide" : "unhide";

      const updatedCourse = await courseService.toggleCourseVisibility(
        course._id,
        action
      );

      if (onCourseUpdate) {
        onCourseUpdate(updatedCourse);
      }
      if (fetchCourses) {
        fetchCourses(currentPage);
      }
      if (fetchDashboardData) {
        fetchDashboardData();
      }
      toast.success(
        `Course ${
          updatedCourse.is_active ? "activated" : "deactivated"
        } successfully!`
      );
    } catch (error) {
      console.error("Error toggling course visibility:", error);
      toast.error("Failed to update course status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await courseService.deleteCourse(course._id);
      if (fetchCourses) {
        fetchCourses(currentPage);
      }
      if (fetchDashboardData) {
        fetchDashboardData();
      }
      toast.success("Course deleted successfully!");
      onClose();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-y-0 right-0 pointer-events-auto">
        <div
          className={`w-96 h-full shadow-xl max-w-[480px] transition-transform duration-200 ease-in-out ${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } max-480px:w-full`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-l h-16 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Course Details
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  disabled={loading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-6">
                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    <Edit size={16} />
                    {isEditing ? "Cancel" : "Edit"}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={handleToggleActive}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                      disabled={loading}
                    >
                      {course.is_active ? (
                        <ToggleRight size={16} />
                      ) : (
                        <ToggleLeft size={16} />
                      )}
                      {course.is_active ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Course Title */}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Course Title
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedCourse.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                      {course.title}
                    </h3>
                  )}
                </div>

                {/* Basic Information Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      University
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedCourse.university}
                        onChange={(e) =>
                          handleInputChange("university", e.target.value)
                        }
                        className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white mt-1">
                        {course.university}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Degree Type
                    </label>
                    {isEditing ? (
                      <select
                        value={editedCourse.degree_type}
                        onChange={(e) =>
                          handleInputChange("degree_type", e.target.value)
                        }
                        className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Bachelor">Bachelor</option>
                        <option value="Master">Master</option>
                        <option value="PhD">PhD</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Certificate">Certificate</option>
                      </select>
                    ) : (
                      <span
                        className={`block w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(
                          course.degree_type
                        )}-100 text-${getStatusColor(
                          course.degree_type
                        )}-800 dark:bg-${getStatusColor(
                          course.degree_type
                        )}-900 dark:text-${getStatusColor(
                          course.degree_type
                        )}-200 mt-1`}
                      >
                        {course.degree_type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Field of Study */}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Field of Study
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedCourse.field_of_study}
                      onChange={(e) =>
                        handleInputChange("field_of_study", e.target.value)
                      }
                      className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white mt-1">
                      {course.field_of_study}
                    </p>
                  )}
                </div>

                {/* Duration and Fees */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Duration
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedCourse.duration}
                        onChange={(e) =>
                          handleInputChange("duration", e.target.value)
                        }
                        className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white mt-1">
                        {course.duration}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Fees
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedCourse.fees}
                        onChange={(e) =>
                          handleInputChange("fees", e.target.value)
                        }
                        className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white mt-1">
                        {course.fees}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedCourse.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white mt-1">
                      {course.location}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedCourse.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={3}
                      className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white mt-1 line-clamp-3 overflow-hidden">
                      {course.description}
                    </p>
                  )}
                </div>

                {/* Created Date */}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created Date
                  </label>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {formatDate(course.createdAt)}
                  </p>
                </div>

                {/* Save Button when editing */}
                {isEditing && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailSidebar;
