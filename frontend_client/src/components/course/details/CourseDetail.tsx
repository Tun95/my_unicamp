import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Calendar,
  MapPin,
  Clock,
  GraduationCap,
} from "lucide-react";
import { Course } from "../../../types/course/course";
import CourseHeader from "./sections/CourseHeader";
import CourseOverview from "./sections/CourseOverview";
import RequirementsSection from "./sections/RequirementsSection";
import TuitionSection from "./sections/TuitionSection";
import ContactSection from "./sections/ContactSection";
import IntakeSection from "./sections/IntakeSection";
import RelatedCourses from "./sections/RelatedCourses";
import { dummyCourses } from "../../../data/dummyCourses";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const foundCourse = dummyCourses.find((c) => c._id === id);
        setCourse(foundCourse || null);
      } catch (error) {
        console.error("Error fetching course:", error);
        setCourse(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically make an API call to save/remove bookmark
  };

  const handleShare = async () => {
    if (navigator.share && course) {
      try {
        await navigator.share({
          title: course.title,
          text: course.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/courses"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>
          {course.title} | {course.university} | UNICAMP
        </title>
        <meta name="description" content={course.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navigation Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-8 max-900px:px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Courses</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Share2 size={18} />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                    isBookmarked
                      ? "text-yellow-600 hover:text-yellow-700"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Bookmark
                    size={18}
                    fill={isBookmarked ? "currentColor" : "none"}
                  />
                  <span className="hidden sm:inline">
                    {isBookmarked ? "Saved" : "Save"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-8 max-900px:px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Header */}
              <CourseHeader course={course} />

              {/* Course Overview */}
              <CourseOverview course={course} />

              {/* Requirements Section */}
              <RequirementsSection requirements={course.entry_requirements} />

              {/* Tuition Section */}
              <TuitionSection tuitionFee={course.tuition_fee} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Facts */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Facts
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                      <GraduationCap
                        className="text-blue-600 dark:text-blue-400"
                        size={18}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Degree Type
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {course.degree_type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                      <Clock
                        className="text-green-600 dark:text-green-400"
                        size={18}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Duration
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {course.duration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                      <MapPin
                        className="text-purple-600 dark:text-purple-400"
                        size={18}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Location
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {course.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                      <Calendar
                        className="text-orange-600 dark:text-orange-400"
                        size={18}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Next Intake
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {course.intake_months[0] || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Deadline */}
              {course.application_deadline && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar
                      className="text-yellow-600 dark:text-yellow-400"
                      size={20}
                    />
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Application Deadline
                    </h3>
                  </div>
                  <p className="text-yellow-700 dark:text-yellow-300 text-lg font-medium">
                    {new Date(course.application_deadline).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-2">
                    Apply before this date to be considered
                  </p>
                </div>
              )}

              {/* Contact Information */}
              <ContactSection
                website={course.website_url}
                email={course.contact_email}
              />

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-center">
                  Apply Now
                </button>
                <button className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-lg font-medium transition-colors text-center">
                  Request Information
                </button>
              </div>
            </div>
          </div>

          {/* Intake Section - Full Width */}
          <div className="mt-12">
            <IntakeSection intakeMonths={course.intake_months} />
          </div>

          {/* Related Courses */}
          <div className="mt-16">
            <RelatedCourses currentCourseId={course._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
