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

interface FeaturedCoursesProps {
  courses: Course[];
}

const FeaturedCourses = ({ courses }: FeaturedCoursesProps) => {
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

  return (
    <section className="py-10 pt-0 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-8 max-900px:px-4">
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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next slide"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ChevronRight
              size={24}
              className="text-gray-700 dark:text-gray-300"
            />
          </button>
        </div>

        {/* Custom Pagination */}
        <div className="featured-courses-pagination flex justify-center gap-2 mt-8" />

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
            View All Courses
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
