// backend_service/src/controllers/uk-msc-courses.controller.js
const ukMScCoursesService = require("../services/uk-msc-courses.service");
const { sendResponse } = require("../utils/utils");
const { STATUS, ERROR_MESSAGES } = require("../constants/constants");
const logger = require("../../config/logger");

class UKMScCoursesController {
  // Get UK MSc courses with filtering
  async getUKMScCourses(req, res) {
    try {
      const {
        university,
        field_of_study,
        location,
        limit = 10,
        page = 1,
      } = req.query;

      const filters = {
        university,
        field_of_study,
        location,
        limit: parseInt(limit),
        page: parseInt(page),
      };

      const result = await ukMScCoursesService.getUKMScCourses(filters);

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: result.courses,
        pagination: result.pagination,
        filters: result.filters,
        meta: {
          description: "UK MSc courses from top universities",
          total_courses: result.pagination.total,
        },
      });
    } catch (error) {
      await logger.error("UK MSc courses controller error", {
        controller: "UKMScCoursesController",
        method: "getUKMScCourses",
        error: error.message,
        query: req.query,
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Get UK universities list
  async getUKUniversities(req, res) {
    try {
      const universities = await ukMScCoursesService.getUKUniversities();

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: universities,
        meta: {
          count: universities.length,
          description: "List of UK universities offering MSc programs",
        },
      });
    } catch (error) {
      await logger.error("Failed to get UK universities", {
        controller: "UKMScCoursesController",
        method: "getUKUniversities",
        error: error.message,
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Get MSc fields of study
  async getMScFieldsOfStudy(req, res) {
    try {
      const fields = await ukMScCoursesService.getMScFieldsOfStudy();

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: fields,
        meta: {
          count: fields.length,
          description: "Fields of study available for MSc programs in UK",
        },
      });
    } catch (error) {
      await logger.error("Failed to get MSc fields of study", {
        controller: "UKMScCoursesController",
        method: "getMScFieldsOfStudy",
        error: error.message,
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Get UK cities with universities
  async getUKCities(req, res) {
    try {
      const cities = await ukMScCoursesService.getUKCities();

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: cities,
        meta: {
          count: cities.length,
          description: "UK cities with universities offering MSc programs",
        },
      });
    } catch (error) {
      await logger.error("Failed to get UK cities", {
        controller: "UKMScCoursesController",
        method: "getUKCities",
        error: error.message,
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Get filter options for UK MSc courses
  async getFilterOptions(req, res) {
    try {
      const [universities, fields, cities] = await Promise.all([
        ukMScCoursesService.getUKUniversities(),
        ukMScCoursesService.getMScFieldsOfStudy(),
        ukMScCoursesService.getUKCities(),
      ]);

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: {
          universities,
          fields_of_study: fields,
          cities,
          degree_types: ["Master"], // Only MSc for this endpoint
        },
        meta: {
          description: "Filter options for UK MSc courses search",
        },
      });
    } catch (error) {
      await logger.error("Failed to get filter options", {
        controller: "UKMScCoursesController",
        method: "getFilterOptions",
        error: error.message,
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

const ukMScCoursesController = new UKMScCoursesController();
module.exports = ukMScCoursesController;
