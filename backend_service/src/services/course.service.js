// backend_service/src/services/course.service.js - Course service implementation
const Course = require("../../models/course.model");
const logger = require("../../config/logger");

class CourseService {
  // Get all courses with filtering and pagination
  async getCourses({
    page = 1,
    limit = 10,
    search,
    university,
    degree_type,
    field_of_study,
    location,
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
      if (location) {
        query.location = { $regex: location, $options: "i" };
      }

      const courses = await Course.find(query)
        .select(
          "-entry_requirements -contact_email -website_url -is_active -createdAt -updatedAt -__v"
        )
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ university: 1, title: 1 });

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
      const locations = await Course.distinct("location", { is_active: true });

      return {
        universities: universities.sort(),
        degree_types: degreeTypes.sort(),
        fields_of_study: fieldsOfStudy.sort(),
        locations: locations.sort(),
      };
    } catch (error) {
      await logger.error(error, {
        service: "CourseService",
        method: "getFilterOptions",
      });
      throw error;
    }
  }

  // Create new course (for admin panel - bonus feature)
  async createCourse(courseData) {
    try {
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

  // Update course (for admin panel - bonus feature)
  async updateCourse(courseId, updateData) {
    try {
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
}

module.exports = new CourseService();
