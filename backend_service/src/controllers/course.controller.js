// backend_service/src/controllers/course.controller.js - Course controller implementation
const courseService = require("../services/course.service");
const { sendResponse } = require("../utils/utils");
const { STATUS, ERROR_MESSAGES } = require("../constants/constants");
const logger = require("../../config/logger");

class CourseController {
  // Get all courses with advanced filtering (for courses page with load more)
  async getCourses(req, res) {
    try {
      const {
        page = 1,
        limit = 6,
        search,
        university,
        degree_type,
        field_of_study,
        country,
        city,
        min_tuition,
        max_tuition,
        intake_month,
        duration,
        is_featured,
        sort_by = "createdAt",
        sort_order = "desc",
      } = req.query;

      const result = await courseService.getCourses({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        university,
        degree_type,
        field_of_study,
        country,
        city,
        min_tuition,
        max_tuition,
        intake_month,
        duration,
        is_featured,
        sort_by,
        sort_order,
      });

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: result.courses,
        pagination: result.pagination,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "CourseController",
        method: "getCourses",
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Get limited courses without pagination (max 6 courses)
  async getLimitedCourses(req, res) {
    try {
      const {
        search,
        university,
        degree_type,
        field_of_study,
        country,
        city,
        min_tuition,
        max_tuition,
        intake_month,
        duration,
        is_featured,
        sort_by = "createdAt",
        sort_order = "desc",
        limit = 6,
      } = req.query;

      const result = await courseService.getLimitedCourses({
        search,
        university,
        degree_type,
        field_of_study,
        country,
        city,
        min_tuition,
        max_tuition,
        intake_month,
        duration,
        is_featured,
        sort_by,
        sort_order,
        limit: parseInt(limit),
      });

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: result.courses,
        count: result.count,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "CourseController",
        method: "getLimitedCourses",
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Get featured courses for homepage
  async getFeaturedCourses(req, res) {
    try {
      const { limit = 6 } = req.query;

      const courses = await courseService.getFeaturedCourses(parseInt(limit));

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: courses,
        meta: {
          count: courses.length,
          limit: parseInt(limit),
          description: "Featured courses for homepage",
        },
      });
    } catch (error) {
      await logger.error(error, {
        controller: "CourseController",
        method: "getFeaturedCourses",
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Get course by slug
  async getCourseBySlug(req, res) {
    try {
      const { slug } = req.params;
      const course = await courseService.getCourseBySlug(slug);

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: course,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "CourseController",
        method: "getCourseBySlug",
        slug: req.params.slug,
      });

      if (error.message === "COURSE_NOT_FOUND") {
        return sendResponse(res, 404, {
          status: STATUS.FAILED,
          message: ERROR_MESSAGES.COURSE_NOT_FOUND,
        });
      }

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Get latest courses for admin (limited to 5)
  async getLatestCourses(req, res) {
    try {
      const { limit = 5 } = req.query;

      const courses = await courseService.getLatestCourses(parseInt(limit));

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: courses,
        meta: {
          count: courses.length,
          limit: parseInt(limit),
          description: "Latest active courses sorted by creation date",
        },
      });
    } catch (error) {
      await logger.error(error, {
        controller: "CourseController",
        method: "getLatestCourses",
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Get all courses for admin (including inactive courses)
  async getAdminCourses(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        university,
        degree_type,
        field_of_study,
        country,
        city,
        is_featured,
        is_active,
      } = req.query;

      const result = await courseService.getAdminCourses({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        university,
        degree_type,
        field_of_study,
        country,
        city,
        is_featured:
          is_featured !== undefined ? is_featured === "true" : undefined,

        is_active: is_active !== undefined ? is_active === "true" : undefined,
      });

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: result.courses,
        pagination: result.pagination,
        filters: {
          search,
          university,
          degree_type,
          field_of_study,
          location: { country, city },
          is_featured,
          is_active,
        },
      });
    } catch (error) {
      await logger.error(error, {
        controller: "CourseController",
        method: "getAdminCourses",
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Get course by ID
  async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const course = await courseService.getCourseById(id);

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: course,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "CourseController",
        method: "getCourseById",
        course_id: req.params.id,
      });

      if (error.message === "COURSE_NOT_FOUND") {
        return sendResponse(res, 404, {
          status: STATUS.FAILED,
          message: ERROR_MESSAGES.COURSE_NOT_FOUND,
        });
      }

      if (error.message === "COURSE_NOT_AVAILABLE") {
        return sendResponse(res, 404, {
          status: STATUS.FAILED,
          message: ERROR_MESSAGES.COURSE_NOT_AVAILABLE,
        });
      }

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Get filter options
  async getFilterOptions(req, res) {
    try {
      const filterOptions = await courseService.getFilterOptions();

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: filterOptions,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "CourseController",
        method: "getFilterOptions",
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Create new course
  async createCourse(req, res) {
    try {
      const courseData = req.body;
      const course = await courseService.createCourse(courseData);

      return sendResponse(res, 201, {
        status: STATUS.SUCCESS,
        message: "Course created successfully",
        data: course,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "CourseController",
        method: "createCourse",
      });

      if (error.name === "ValidationError") {
        return sendResponse(res, 400, {
          status: STATUS.FAILED,
          message: "Validation error",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Update course
  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const course = await courseService.updateCourse(id, updateData);

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        message: "Course updated successfully",
        data: course,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "CourseController",
        method: "updateCourse",
        course_id: req.params.id,
      });

      if (error.message === "COURSE_NOT_FOUND") {
        return sendResponse(res, 404, {
          status: STATUS.FAILED,
          message: ERROR_MESSAGES.COURSE_NOT_FOUND,
        });
      }

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Toggle course featured status
  async toggleFeaturedStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_featured } = req.body;

      const course = await courseService.toggleFeaturedStatus(id, is_featured);

      const message = is_featured
        ? "Course marked as featured"
        : "Course removed from featured";

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        message: message,
        data: course,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "CourseController",
        method: "toggleFeaturedStatus",
        course_id: req.params.id,
        is_featured: req.body?.is_featured,
      });

      if (error.message === "COURSE_NOT_FOUND") {
        return sendResponse(res, 404, {
          status: STATUS.FAILED,
          message: ERROR_MESSAGES.COURSE_NOT_FOUND,
        });
      }

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Toggle course visibility (hide/unhide)
  async toggleCourseVisibility(req, res) {
    try {
      const { id } = req.params;
      const { action } = req.body;

      const course = await courseService.toggleCourseVisibility(id, action);

      const message = course.is_active
        ? "Course unhidden successfully"
        : "Course hidden successfully";

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        message: message,
        data: course,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "CourseController",
        method: "toggleCourseVisibility",
        course_id: req.params.id,
        action: req.body?.action,
      });

      if (error.message === "COURSE_NOT_FOUND") {
        return sendResponse(res, 404, {
          status: STATUS.FAILED,
          message: ERROR_MESSAGES.COURSE_NOT_FOUND,
        });
      }

      if (error.message === "DUPLICATE_COURSE_ACTIVE") {
        return sendResponse(res, 409, {
          status: STATUS.FAILED,
          message:
            "Cannot unhide course: An active course with the same title, university, and degree type already exists",
        });
      }

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Permanent delete course
  async permanentDeleteCourse(req, res) {
    try {
      const { id } = req.params;
      const course = await courseService.permanentDeleteCourse(id);

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        message: "Course permanently deleted",
        data: course,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "CourseController",
        method: "permanentDeleteCourse",
        course_id: req.params.id,
      });

      if (error.message === "COURSE_NOT_FOUND") {
        return sendResponse(res, 404, {
          status: STATUS.FAILED,
          message: ERROR_MESSAGES.COURSE_NOT_FOUND,
        });
      }

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

const courseController = new CourseController();
module.exports = courseController;
