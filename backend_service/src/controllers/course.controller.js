// backend_service/src/controllers/course.controller.js - Course controller implementation
const courseService = require("../services/course.service");
const { sendResponse } = require("../utils/utils");
const { STATUS, ERROR_MESSAGES } = require("../constants/constants");
const logger = require("../../config/logger");

class CourseController {
  // Get all courses with filtering
  async getCourses(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        university,
        degree_type,
        field_of_study,
        location,
      } = req.query;

      const result = await courseService.getCourses({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        university,
        degree_type,
        field_of_study,
        location,
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

  // Delete course (soft delete)
  async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      const course = await courseService.deleteCourse(id);

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        message: "Course deleted successfully",
        data: course,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "CourseController",
        method: "deleteCourse",
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

module.exports = new CourseController();
