// backend_service/src/controllers/uk-msc-live.controller.js
const ukMScLiveService = require("../services/uk-msc-courses.service");
const { sendResponse } = require("../utils/utils");
const { STATUS, ERROR_MESSAGES } = require("../constants/constants");
const logger = require("../../config/logger");

class UKMScLiveController {
  // Get UK MSc courses - LIVE DATA ONLY
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

      const result = await ukMScLiveService.getUKMScCourses(filters);

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: result.courses,
        pagination: result.pagination,
        filters: result.filters,
        meta: {
          description: "LIVE UK MSc courses from university APIs",
          data_source: result.data_source,
          last_updated: result.last_updated,
          total_live_courses: result.pagination.total,
        },
      });
    } catch (error) {
      await logger.error("LIVE UK MSc courses controller error", {
        controller: "UKMScLiveController",
        method: "getUKMScCourses",
        error: error.message,
        query: req.query,
      });

      return sendResponse(res, 503, {
        status: STATUS.FAILED,
        message:
          error.message ||
          "Live data currently unavailable from UK universities",
      });
    }
  }

  // Get available universities with live data
  async getAvailableUniversities(req, res) {
    try {
      const universities = await ukMScLiveService.getAvailableUniversities();

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: universities,
        meta: {
          count: universities.length,
          description: "UK universities with currently available live data",
          note: "List may vary based on API availability",
        },
      });
    } catch (error) {
      await logger.error("Failed to get available universities", {
        controller: "UKMScLiveController",
        method: "getAvailableUniversities",
        error: error.message,
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Check service health
  async getServiceHealth(req, res) {
    try {
      const universities = await ukMScLiveService.getAvailableUniversities();

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: {
          service: "uk_msc_live",
          status: universities.length > 0 ? "healthy" : "degraded",
          available_universities: universities.length,
          universities: universities,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      return sendResponse(res, 503, {
        status: STATUS.FAILED,
        message: "Service unhealthy: " + error.message,
      });
    }
  }
}

const ukMScLiveController = new UKMScLiveController();
module.exports = ukMScLiveController;
