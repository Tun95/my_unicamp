// src/components/courses/CreateCourseModal.tsx
import { useState, useEffect } from "react";
import { X, Plus, Minus, Calendar, Globe, Mail } from "lucide-react";
import { courseService } from "../../services/courseService";
import { CreateCourseData } from "../../types/course/course";
import { FilterOptions } from "../../types/course/course";
import { toast } from "sonner";
import { commonIntakeMonths } from "../../utilities/utils/Utils";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchCourses: () => void;
  filterOptions: FilterOptions | null;
}

function CreateCourseModal({
  isOpen,
  onClose,
  fetchCourses,
  filterOptions,
}: CreateCourseModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCourseData>({
    title: "",
    university: "",
    duration: "",
    location: "",
    fees: "",
    description: "",
    degree_type: "",
    field_of_study: "",
    intake_months: ["September"],
    language: "English",
    tuition_fee: {
      amount: 0,
      currency: "USD",
      period: "per_year",
    },
    entry_requirements: {
      minimum_gpa: 3.0,
      language_tests: [],
      prerequisites: [],
    },
  });

  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newLanguageTest, setNewLanguageTest] = useState({
    test_type: "",
    minimum_score: "",
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        university: "",
        duration: "",
        location: "",
        fees: "",
        description: "",
        degree_type: "",
        field_of_study: "",
        intake_months: ["September"],
        language: "English",
        tuition_fee: {
          amount: 0,
          currency: "USD",
          period: "per_year",
        },
        entry_requirements: {
          minimum_gpa: 3.0,
          language_tests: [],
          prerequisites: [],
        },
      });
      setNewPrerequisite("");
      setNewLanguageTest({ test_type: "", minimum_score: "" });
    }
  }, [isOpen]);

  const handleInputChange = (
    field: string,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (
    parentField: string,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField as keyof CreateCourseData] as object),
        [field]: value,
      },
    }));
  };

  const handleAddPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setFormData((prev) => ({
        ...prev,
        entry_requirements: {
          ...prev.entry_requirements!,
          prerequisites: [
            ...(prev.entry_requirements?.prerequisites || []),
            newPrerequisite.trim(),
          ],
        },
      }));
      setNewPrerequisite("");
    }
  };

  const handleRemovePrerequisite = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      entry_requirements: {
        ...prev.entry_requirements!,
        prerequisites:
          prev.entry_requirements?.prerequisites?.filter(
            (_, i) => i !== index
          ) || [],
      },
    }));
  };

  const handleAddLanguageTest = () => {
    if (
      newLanguageTest.test_type.trim() &&
      newLanguageTest.minimum_score.trim()
    ) {
      setFormData((prev) => ({
        ...prev,
        entry_requirements: {
          ...prev.entry_requirements!,
          language_tests: [
            ...(prev.entry_requirements?.language_tests || []),
            {
              test_type: newLanguageTest.test_type.trim(),
              minimum_score: newLanguageTest.minimum_score.trim(),
            },
          ],
        },
      }));
      setNewLanguageTest({ test_type: "", minimum_score: "" });
    }
  };

  const handleRemoveLanguageTest = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      entry_requirements: {
        ...prev.entry_requirements!,
        language_tests:
          prev.entry_requirements?.language_tests?.filter(
            (_, i) => i !== index
          ) || [],
      },
    }));
  };

  const handleAddIntakeMonth = (month: string) => {
    if (!formData.intake_months.includes(month)) {
      setFormData((prev) => ({
        ...prev,
        intake_months: [...prev.intake_months, month],
      }));
    }
  };

  const handleRemoveIntakeMonth = (month: string) => {
    setFormData((prev) => ({
      ...prev,
      intake_months: prev.intake_months.filter((m) => m !== month),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await courseService.createCourse(formData);
      toast.success("Course created successfully!");
      fetchCourses();
      onClose();
    } catch (error: unknown) {
      console.error("Error creating course:", error);

      if (error instanceof Error) {
        toast.error(error.message || "Failed to create course");
      } else if (typeof error === "string") {
        toast.error(error);
      } else {
        toast.error("Failed to create course");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="max-900px:h-[100vh] fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full h-full flex flex-col overflow-hidden shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 max-480px:px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div>
            <h2 className="text-2xl max-420px:text-[22px] font-bold text-gray-900 dark:text-white">
              Create New Course
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 mt-1 max-420px:mt-0 max-420px:text-[13px]">
              Add a new course to the system
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
          <form onSubmit={handleSubmit} className="p-6 max-w-7xl mx-auto">
            {/* Basic Information & Program Details */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              {/* Basic Information Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Basic Information
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Computer Science Bachelor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      University *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.university}
                      onChange={(e) =>
                        handleInputChange("university", e.target.value)
                      }
                      list="universities"
                      className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Type or select university"
                    />
                    <datalist id="universities">
                      {filterOptions?.universities.map((uni) => (
                        <option key={uni} value={uni} />
                      ))}
                    </datalist>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Degree Type *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.degree_type}
                        onChange={(e) =>
                          handleInputChange("degree_type", e.target.value)
                        }
                        list="degreeTypes"
                        className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Select degree type"
                      />
                      <datalist id="degreeTypes">
                        {filterOptions?.degree_types.map((type) => (
                          <option key={type} value={type} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Field of Study *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.field_of_study}
                        onChange={(e) =>
                          handleInputChange("field_of_study", e.target.value)
                        }
                        list="fieldsOfStudy"
                        className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Select field"
                      />
                      <datalist id="fieldsOfStudy">
                        {filterOptions?.fields_of_study.map((field) => (
                          <option key={field} value={field} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      list="locations"
                      className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Type or select location"
                    />
                    <datalist id="locations">
                      {filterOptions?.locations.map((location) => (
                        <option key={location} value={location} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Program Details Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-6 bg-green-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Program Details
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.duration}
                        onChange={(e) =>
                          handleInputChange("duration", e.target.value)
                        }
                        className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., 4 years"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Display Fees *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fees}
                        onChange={(e) =>
                          handleInputChange("fees", e.target.value)
                        }
                        className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., $50,000 per year"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tuition Amount *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.tuition_fee?.amount || 0}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "tuition_fee",
                          "amount",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 50000"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Currency
                      </label>
                      <select
                        value={formData.tuition_fee?.currency || "USD"}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "tuition_fee",
                            "currency",
                            e.target.value
                          )
                        }
                        className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Period
                      </label>
                      <select
                        value={formData.tuition_fee?.period || "per_year"}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "tuition_fee",
                            "period",
                            e.target.value
                          )
                        }
                        className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="per_year">Per Year</option>
                        <option value="per_semester">Per Semester</option>
                        <option value="total_course">Total Program</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Language *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.language}
                      onChange={(e) =>
                        handleInputChange("language", e.target.value)
                      }
                      list="languages"
                      className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., English"
                    />
                    <datalist id="languages">
                      <option value="English" />
                      <option value="Spanish" />
                      <option value="French" />
                      <option value="German" />
                      <option value="Chinese" />
                      <option value="Japanese" />
                    </datalist>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-purple-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Course Description
                </h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Provide a detailed description of the course, including key features, learning outcomes, and any other relevant information..."
                />
              </div>
            </div>

            {/* Intake Months Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-orange-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Intake Months
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.intake_months.map((month) => (
                  <span
                    key={month}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium border border-orange-200 dark:border-orange-800"
                  >
                    {month}
                    <button
                      type="button"
                      onClick={() => handleRemoveIntakeMonth(month)}
                      className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 transition-colors duration-200"
                    >
                      <Minus size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value=""
                  onChange={(e) => handleAddIntakeMonth(e.target.value)}
                  className="flex-1 px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select intake month to add</option>
                  {commonIntakeMonths
                    .filter((month) => !formData.intake_months.includes(month))
                    .map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Entry Requirements Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-red-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Entry Requirements
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Prerequisites Section */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                    Academic Requirements
                  </h4>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum GPA
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="4.0"
                      value={formData.entry_requirements?.minimum_gpa || 3.0}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "entry_requirements",
                          "minimum_gpa",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Prerequisites
                    </label>
                    <div className="space-y-2 mb-3">
                      {formData.entry_requirements?.prerequisites?.map(
                        (prereq, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {prereq}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemovePrerequisite(index)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                            >
                              <Minus size={16} />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPrerequisite}
                        onChange={(e) => setNewPrerequisite(e.target.value)}
                        placeholder="Add prerequisite course or requirement"
                        className="flex-1 px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), handleAddPrerequisite())
                        }
                      />
                      <button
                        type="button"
                        onClick={handleAddPrerequisite}
                        className="px-4 h-9 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Language Tests Section */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                    Language Tests
                  </h4>
                  <div className="space-y-4">
                    {formData.entry_requirements?.language_tests?.map(
                      (test, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                          <div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {test.test_type}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                              Minimum Score: {test.minimum_score}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveLanguageTest(index)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      )
                    )}

                    <div className="space-y-3 p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                      <input
                        type="text"
                        value={newLanguageTest.test_type}
                        onChange={(e) =>
                          setNewLanguageTest((prev) => ({
                            ...prev,
                            test_type: e.target.value,
                          }))
                        }
                        list="testTypes"
                        placeholder="Test type (e.g., TOEFL, IELTS)"
                        className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <datalist id="testTypes">
                        <option value="TOEFL" />
                        <option value="IELTS" />
                        <option value="PTE" />
                        <option value="Duolingo" />
                        <option value="Cambridge English" />
                      </datalist>
                      <input
                        type="text"
                        value={newLanguageTest.minimum_score}
                        onChange={(e) =>
                          setNewLanguageTest((prev) => ({
                            ...prev,
                            minimum_score: e.target.value,
                          }))
                        }
                        placeholder="Minimum score (e.g., 6.5, 90)"
                        className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={handleAddLanguageTest}
                        className="w-full px-4 h-9 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <Plus size={16} />
                        Add Language Test
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Additional Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.application_deadline || ""}
                    onChange={(e) =>
                      handleInputChange("application_deadline", e.target.value)
                    }
                    className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Globe size={16} />
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website_url || ""}
                    onChange={(e) =>
                      handleInputChange("website_url", e.target.value)
                    }
                    className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Mail size={16} />
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email || ""}
                    onChange={(e) =>
                      handleInputChange("contact_email", e.target.value)
                    }
                    className="w-full px-4 h-9 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="admissions@university.edu"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-8 h-9 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 h-9 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium shadow-lg shadow-blue-500/25"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating Course...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create Course
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCourseModal;
