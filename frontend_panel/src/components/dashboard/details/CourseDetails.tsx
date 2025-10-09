// CourseDetailSidebar.tsx
import { X, Edit, ToggleLeft, ToggleRight, Trash2, Star } from "lucide-react";
import { useTheme } from "../../../custom hooks/Hooks";
import { Course } from "../../../types/dashboard/dashboard";
import { courseService } from "../../../services/courseService";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getStatusColorClasses } from "../../../utilities/status/status";
import { formatDate, formatTuitionFee } from "../../../utilities/utils/Utils";

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
  const [editedCourse, setEditedCourse] = useState<Course>(course);
  const [loading, setLoading] = useState(false);

  // Reset state when course prop changes
  useEffect(() => {
    setEditedCourse(course);
    setIsEditing(false);
  }, [course]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedCourse(course);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (
    field: string,
    value: string | number | string[]
  ) => {
    setEditedCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTuitionFeeChange = (field: string, value: string | number) => {
    setEditedCourse((prev) => ({
      ...prev,
      tuition_fee: {
        ...prev.tuition_fee!,
        [field]: value,
      },
    }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setEditedCourse((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
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

  const handleToggleFeatured = async () => {
    try {
      setLoading(true);
      const updatedCourse = await courseService.toggleFeaturedStatus(
        course._id,
        !course.is_featured
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
          updatedCourse.is_featured
            ? "marked as featured"
            : "removed from featured"
        }!`
      );
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast.error("Failed to update featured status");
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
          className={`max-900px:h-[100vh] w-96 h-full shadow-xl max-w-[480px] transition-transform duration-200 ease-in-out ${
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
                <div className="flex flex-col gap-3">
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
                        onClick={handleToggleFeatured}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-yellow-700 disabled:opacity-50 ${
                          course.is_featured
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                        }`}
                        disabled={loading}
                      >
                        <Star
                          size={16}
                          fill={course.is_featured ? "currentColor" : "none"}
                        />
                        {course.is_featured ? "Featured" : "Feature"}
                      </button>

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
                    </div>
                  </div>

                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 w-full py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                    Delete Permanently
                  </button>
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
                        className={`block w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClasses(
                          course.degree_type
                        )}`}
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
                      Tuition Fee
                    </label>
                    {isEditing ? (
                      <div className="space-y-2 mt-1">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={editedCourse.tuition_fee?.amount || ""}
                          onChange={(e) =>
                            handleTuitionFeeChange(
                              "amount",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                        <select
                          value={editedCourse.tuition_fee?.currency || "USD"}
                          onChange={(e) =>
                            handleTuitionFeeChange("currency", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </select>
                        <select
                          value={editedCourse.tuition_fee?.period || "per_year"}
                          onChange={(e) =>
                            handleTuitionFeeChange("period", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        >
                          <option value="per_year">Per Year</option>
                          <option value="per_semester">Per Semester</option>
                          <option value="total_course">Total Course</option>
                        </select>
                      </div>
                    ) : (
                      <p className="text-gray-900 dark:text-white mt-1">
                        {formatTuitionFee(course.tuition_fee)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      City
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedCourse.location.city}
                        onChange={(e) =>
                          handleLocationChange("city", e.target.value)
                        }
                        className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white mt-1">
                        {course.location.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Country
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedCourse.location.country}
                        onChange={(e) =>
                          handleLocationChange("country", e.target.value)
                        }
                        className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white mt-1">
                        {course.location.country}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Location Info */}
                {(isEditing ||
                  course.location.address ||
                  course.location.state) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedCourse.location.address || ""}
                          onChange={(e) =>
                            handleLocationChange("address", e.target.value)
                          }
                          className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white mt-1">
                          {course.location.address || "Not specified"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        State/Province
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedCourse.location.state || ""}
                          onChange={(e) =>
                            handleLocationChange("state", e.target.value)
                          }
                          className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white mt-1">
                          {course.location.state || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Language */}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Language
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedCourse.language}
                      onChange={(e) =>
                        handleInputChange("language", e.target.value)
                      }
                      className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white mt-1">
                      {course.language}
                    </p>
                  )}
                </div>

                {/* Intake Months */}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Intake Months
                  </label>
                  {isEditing ? (
                    <div className="mt-1">
                      <select
                        multiple
                        value={editedCourse.intake_months}
                        onChange={(e) => {
                          const selected = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          );
                          handleInputChange("intake_months", selected);
                        }}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        size={4}
                      >
                        {[
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ].map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Hold Ctrl/Cmd to select multiple
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {course.intake_months.map((month) => (
                        <span
                          key={month}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md dark:bg-blue-900 dark:text-blue-200"
                        >
                          {month}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Application Deadline */}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Application Deadline
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedCourse.application_deadline || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "application_deadline",
                          e.target.value
                        )
                      }
                      className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white mt-1">
                      {course.application_deadline
                        ? formatDate(course.application_deadline)
                        : "Not specified"}
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

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editedCourse.website_url || ""}
                        onChange={(e) =>
                          handleInputChange("website_url", e.target.value)
                        }
                        className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white mt-1 truncate">
                        {course.website_url || "Not specified"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Contact Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedCourse.contact_email || ""}
                        onChange={(e) =>
                          handleInputChange("contact_email", e.target.value)
                        }
                        className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white mt-1 truncate">
                        {course.contact_email || "Not specified"}
                      </p>
                    )}
                  </div>
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
