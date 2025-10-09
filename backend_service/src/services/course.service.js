// backend_service/src/services/course.service.js - Course service implementation
const Course = require("../../models/course.model");
const logger = require("../../config/logger");
const { ERROR_MESSAGES } = require("../constants/constants");

class CourseService {
  // Get all courses with filtering and pagination
  async getCourses({
    page = 1,
    limit = 10,
    search,
    university,
    degree_type,
    field_of_study,
    country,
    city,
    min_tuition,
    max_tuition,
    intake_month,
    is_featured,
    sort_by = "createdAt",
    sort_order = "desc",
  }) {
    try {
      let query = { is_active: true };

      // Search across multiple fields
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { university: { $regex: search, $options: "i" } },
          { field_of_study: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { "location.city": { $regex: search, $options: "i" } },
          { "location.country": { $regex: search, $options: "i" } },
        ];
      }

      // Filter by university
      if (university) {
        query.university = { $regex: university, $options: "i" };
      }

      // Filter by degree type
      if (degree_type) {
        query.degree_type = degree_type;
      }

      // Filter by field of study
      if (field_of_study) {
        query.field_of_study = { $regex: field_of_study, $options: "i" };
      }

      // Filter by location
      if (country) {
        query["location.country"] = { $regex: country, $options: "i" };
      }

      if (city) {
        query["location.city"] = { $regex: city, $options: "i" };
      }

      // Filter by tuition fee range
      if (min_tuition || max_tuition) {
        query["tuition_fee.amount"] = {};
        if (min_tuition)
          query["tuition_fee.amount"].$gte = parseInt(min_tuition);
        if (max_tuition)
          query["tuition_fee.amount"].$lte = parseInt(max_tuition);
      }

      // Filter by intake month
      if (intake_month) {
        query.intake_months = { $in: [intake_month] };
      }

      // Filter by featured status
      if (is_featured !== undefined) {
        query.is_featured = is_featured === "true";
      }

      // Sort options
      const sortOptions = {};
      sortOptions[sort_by] = sort_order === "desc" ? -1 : 1;

      const courses = await Course.find(query)
        .select(
          "-entry_requirements -contact_email -website_url -is_active -createdAt -updatedAt -__v"
        )
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort(sortOptions);

      const total = await Course.countDocuments(query);

      await logger.info("Courses retrieved successfully", {
        service: "CourseService",
        method: "getCourses",
        count: courses.length,
        total,
        page,
        limit,
      });

      return {
        courses,
        pagination: {
          total_pages: Math.ceil(total / limit),
          current_page: parseInt(page),
          total,
          limit: parseInt(limit),
        },
      };
    } catch (error) {
      await logger.error(error, {
        service: "CourseService",
        method: "getCourses",
      });
      throw error;
    }
  }

  // Get featured courses for homepage
  async getFeaturedCourses(limit = 6) {
    try {
      const courses = await Course.find({
        is_active: true,
        is_featured: true,
      })
        .select(
          "-entry_requirements -contact_email -website_url -createdAt -updatedAt -__v"
        )
        .sort({ createdAt: -1 })
        .limit(limit);

      await logger.info("Featured courses retrieved successfully", {
        service: "CourseService",
        method: "getFeaturedCourses",
        count: courses.length,
        limit,
      });

      return courses;
    } catch (error) {
      await logger.error(error, {
        service: "CourseService",
        method: "getFeaturedCourses",
        limit,
      });
      throw error;
    }
  }

  // Get latest courses (Public - only active)
  async getLatestCourses(limit = 5) {
    try {
      const courses = await Course.find({ is_active: true })
        .select(
          "-entry_requirements -contact_email -website_url -createdAt -updatedAt -__v"
        )
        .sort({ createdAt: -1 })
        .limit(limit);

      await logger.info("Latest courses retrieved successfully", {
        service: "CourseService",
        method: "getLatestCourses",
        count: courses.length,
        limit,
      });

      return courses;
    } catch (error) {
      await logger.error(error, {
        service: "CourseService",
        method: "getLatestCourses",
        limit,
      });
      throw error;
    }
  }

  // Get course by slug
  async getCourseBySlug(slug) {
    try {
      const course = await Course.findOne({ slug, is_active: true });

      if (!course) {
        throw new Error("COURSE_NOT_FOUND");
      }

      await logger.info("Course retrieved successfully by slug", {
        service: "CourseService",
        method: "getCourseBySlug",
        slug: slug,
      });

      return course;
    } catch (error) {
      await logger.error(error, {
        service: "CourseService",
        method: "getCourseBySlug",
        slug: slug,
      });
      throw error;
    }
  }

  // Get all courses for admin (including inactive courses)
  async getAdminCourses({
    page = 1,
    limit = 10,
    search,
    university,
    degree_type,
    field_of_study,
    country,
    city,
    is_active,
    is_featured,
  }) {
    try {
      let query = {};

      // Filter by active status if provided
      if (is_active !== undefined) {
        query.is_active = is_active;
      }

      // Filter by featured status if provided
      if (is_featured !== undefined) {
        query.is_featured = is_featured;
      }

      // Search across multiple fields (including inactive)
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { university: { $regex: search, $options: "i" } },
          { field_of_study: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { "location.city": { $regex: search, $options: "i" } },
          { "location.country": { $regex: search, $options: "i" } },
        ];
      }

      // Filter by university
      if (university) {
        query.university = { $regex: university, $options: "i" };
      }

      // Filter by degree type
      if (degree_type) {
        query.degree_type = degree_type;
      }

      // Filter by field of study
      if (field_of_study) {
        query.field_of_study = { $regex: field_of_study, $options: "i" };
      }

      // Filter by location
      if (country) {
        query["location.country"] = { $regex: country, $options: "i" };
      }

      if (city) {
        query["location.city"] = { $regex: city, $options: "i" };
      }

      const courses = await Course.find(query)
        .select("-__v")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await Course.countDocuments(query);

      // Get statistics for admin
      const activeCount = await Course.countDocuments({ is_active: true });
      const inactiveCount = await Course.countDocuments({ is_active: false });
      const featuredCount = await Course.countDocuments({ is_featured: true });

      await logger.info("Admin courses retrieved successfully", {
        service: "CourseService",
        method: "getAdminCourses",
        count: courses.length,
        total,
        active_count: activeCount,
        inactive_count: inactiveCount,
        featured_count: featuredCount,
        page,
        limit,
      });

      return {
        courses,
        pagination: {
          total_pages: Math.ceil(total / limit),
          current_page: parseInt(page),
          total,
          limit: parseInt(limit),
        },
        statistics: {
          total_courses: total,
          active_courses: activeCount,
          inactive_courses: inactiveCount,
          featured_courses: featuredCount,
        },
      };
    } catch (error) {
      await logger.error(error, {
        service: "CourseService",
        method: "getAdminCourses",
      });
      throw error;
    }
  }

  // Get course by ID with full details
  async getCourseById(courseId) {
    try {
      const course = await Course.findById(courseId);

      if (!course) {
        throw new Error("COURSE_NOT_FOUND");
      }

      if (!course.is_active) {
        throw new Error("COURSE_NOT_AVAILABLE");
      }

      await logger.info("Course retrieved successfully", {
        service: "CourseService",
        method: "getCourseById",
        course_id: courseId,
      });

      return course;
    } catch (error) {
      await logger.error(error, {
        service: "CourseService",
        method: "getCourseById",
        course_id: courseId,
      });
      throw error;
    }
  }

  // Get unique values for filters
  async getFilterOptions() {
    try {
      const universities = await Course.distinct("university", {
        is_active: true,
      });
      const degreeTypes = await Course.distinct("degree_type", {
        is_active: true,
      });
      const fieldsOfStudy = await Course.distinct("field_of_study", {
        is_active: true,
      });
      const countries = await Course.distinct("location.country", {
        is_active: true,
      });
      const cities = await Course.distinct("location.city", {
        is_active: true,
      });

      // Get tuition fee range
      const tuitionRange = await Course.aggregate([
        { $match: { is_active: true } },
        {
          $group: {
            _id: null,
            minTuition: { $min: "$tuition_fee.amount" },
            maxTuition: { $max: "$tuition_fee.amount" },
          },
        },
      ]);

      return {
        universities: universities.sort(),
        degree_types: degreeTypes.sort(),
        fields_of_study: fieldsOfStudy.sort(),
        countries: countries.sort(),
        cities: cities.sort(),
        tuition_range: tuitionRange[0] || { minTuition: 0, maxTuition: 100000 },
      };
    } catch (error) {
      await logger.error(error, {
        service: "CourseService",
        method: "getFilterOptions",
      });
      throw error;
    }
  }

  // Create new course with duplicate check
  async createCourse(courseData) {
    try {
      // Check for existing active course with same title, university, and degree type
      const existingCourse = await Course.findOne({
        title: courseData.title,
        university: courseData.university,
        degree_type: courseData.degree_type,
        is_active: true,
      });

      if (existingCourse) {
        throw new Error(ERROR_MESSAGES.COURSE_ALREADY_EXISTS);
      }

      const course = new Course(courseData);
      await course.save();

      await logger.info("Course created successfully", {
        service: "CourseService",
        method: "createCourse",
        course_id: course._id,
      });

      return course;
    } catch (error) {
      await logger.error(error, {
        service: "CourseService",
        method: "createCourse",
      });
      throw error;
    }
  }

  // Update course with duplicate check (excluding current course)
  async updateCourse(courseId, updateData) {
    try {
      // If updating title, university, or degree_type, check for duplicates
      if (updateData.title || updateData.university || updateData.degree_type) {
        const currentCourse = await Course.findById(courseId);
        if (!currentCourse) {
          throw new Error("COURSE_NOT_FOUND");
        }

        const duplicateCourse = await Course.findOne({
          _id: { $ne: courseId }, // Exclude current course
          title: updateData.title || currentCourse.title,
          university: updateData.university || currentCourse.university,
          degree_type: updateData.degree_type || currentCourse.degree_type,
          is_active: true,
        });

        if (duplicateCourse) {
          throw new Error("COURSE_ALREADY_EXISTS");
        }
      }

      const course = await Course.findByIdAndUpdate(courseId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!course) {
        throw new Error("COURSE_NOT_FOUND");
      }

      await logger.info("Course updated successfully", {
        service: "CourseService",
        method: "updateCourse",
        course_id: courseId,
      });

      return course;
    } catch (error) {
      await logger.error(error, {
        service: "CourseService",
        method: "updateCourse",
        course_id: courseId,
      });
      throw error;
    }
  }

  // Toggle course featured status
  async toggleFeaturedStatus(courseId, is_featured) {
    try {
      const course = await Course.findByIdAndUpdate(
        courseId,
        { is_featured },
        { new: true, runValidators: true }
      );

      if (!course) {
        throw new Error("COURSE_NOT_FOUND");
      }

      await logger.info("Course featured status updated", {
        service: "CourseService",
        method: "toggleFeaturedStatus",
        course_id: courseId,
        is_featured: is_featured,
      });

      return course;
    } catch (error) {
      await logger.error(error, {
        service: "CourseService",
        method: "toggleFeaturedStatus",
        course_id: courseId,
        is_featured: is_featured,
      });
      throw error;
    }
  }

  // Toggle course visibility (hide/unhide)
  async toggleCourseVisibility(courseId, action) {
    try {
      const course = await Course.findById(courseId);
      if (!course) {
        throw new Error("COURSE_NOT_FOUND");
      }

      let newVisibility;

      // Determine new visibility state based on action parameter
      if (action === "hide") {
        newVisibility = false;
      } else if (action === "unhide") {
        newVisibility = true;
      } else {
        // Toggle if no specific action provided
        newVisibility = !course.is_active;
      }

      // If unhiding, check for potential duplicates
      if (newVisibility === true) {
        const duplicateCourse = await this.findDuplicateCourse(
          {
            title: course.title,
            university: course.university,
            degree_type: course.degree_type,
          },
          courseId
        );

        if (duplicateCourse) {
          throw new Error("DUPLICATE_COURSE_ACTIVE");
        }
      }

      // Update the course visibility
      course.is_active = newVisibility;
      await course.save();

      const actionText = newVisibility ? "unhidden" : "hidden";
      await logger.info(`Course ${actionText} successfully`, {
        service: "CourseService",
        method: "toggleCourseVisibility",
        course_id: courseId,
        previous_state: !newVisibility,
        new_state: newVisibility,
      });

      return course;
    } catch (error) {
      await logger.error(error, {
        service: "CourseService",
        method: "toggleCourseVisibility",
        course_id: courseId,
        action: action,
      });
      throw error;
    }
  }

  // Permanent delete course
  async permanentDeleteCourse(courseId) {
    try {
      const course = await Course.findByIdAndDelete(courseId);

      if (!course) {
        throw new Error("COURSE_NOT_FOUND");
      }

      await logger.info("Course permanently deleted", {
        service: "CourseService",
        method: "permanentDeleteCourse",
        course_id: courseId,
      });

      return course;
    } catch (error) {
      await logger.error(error, {
        service: "CourseService",
        method: "permanentDeleteCourse",
        course_id: courseId,
      });
      throw error;
    }
  }

  // Helper method to find duplicate courses
  async findDuplicateCourse(courseData, excludeCourseId = null) {
    const query = {
      is_active: true,
      $or: [
        // Exact match on key fields
        {
          title: courseData.title,
          university: courseData.university,
          degree_type: courseData.degree_type,
        },
        // Similar course check (case insensitive)
        {
          title: { $regex: new RegExp(courseData.title, "i") },
          university: { $regex: new RegExp(courseData.university, "i") },
          degree_type: courseData.degree_type,
        },
      ],
    };

    // Exclude current course when updating or toggling
    if (excludeCourseId) {
      query._id = { $ne: excludeCourseId };
    }

    return await Course.findOne(query);
  }
}

module.exports = new CourseService();
