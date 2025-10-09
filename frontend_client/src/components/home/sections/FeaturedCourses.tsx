// FEATURED COURSES.tsx
import { useRef, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import CourseCard from "../../../common/course card/CourseCard";
import { Course } from "../../../types/course/course";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useNavigate } from "react-router-dom";

interface FeaturedCoursesProps {
  courses: Course[];
  loading?: boolean;
}

const FeaturedCourses = ({
  courses,
  loading = false,
}: FeaturedCoursesProps) => {
  const navigate = useNavigate();

  const featuredCourses = courses.slice(0, 6);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    // Re-initialize navigation when component mounts
    if (
      swiperRef.current &&
      navigationPrevRef.current &&
      navigationNextRef.current
    ) {
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="py-10 pt-0 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-8 max-900px:px-4 max-900px:px-4 max-480px:py-6 max-480px:px-2 max-w-7xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="text-yellow-500" size={24} />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Featured Courses
              </h2>
              <Star className="text-yellow-500" size={24} />
            </div>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Loading featured courses...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 pt-0 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-8 max-900px:px-4 max-900px:px-4 max-480px:py-6 max-480px:px-2 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="text-yellow-500" size={24} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Featured Courses
            </h2>
            <Star className="text-yellow-500" size={24} />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our handpicked selection of top-rated courses from
            prestigious universities around the world
          </p>
        </div>

        {/* Swiper Slider */}
        {featuredCourses.length > 0 ? (
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 25,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              navigation={{
                prevEl: navigationPrevRef.current,
                nextEl: navigationNextRef.current,
              }}
              pagination={{
                clickable: true,
                el: ".featured-courses-pagination",
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              // Add these for equal height slides
              watchSlidesProgress={true}
              observer={true}
              observeParents={true}
              className="featured-courses-slider"
            >
              {featuredCourses.map((course) => (
                <SwiperSlide key={course._id} className="!h-auto">
                  <div className="h-full">
                    <CourseCard course={course} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button
              ref={navigationPrevRef}
              className="max-480px:hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous slide"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <ChevronLeft
                size={24}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>

            <button
              ref={navigationNextRef}
              className="max-480px:hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next slide"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <ChevronRight
                size={24}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              ⭐
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No featured courses available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for featured course updates.
            </p>
          </div>
        )}

        {/* Custom Pagination */}
        {featuredCourses.length > 0 && (
          <div className="featured-courses-pagination flex justify-center gap-2 mt-8" />
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/courses")}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            View All Courses
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
