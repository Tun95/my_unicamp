// backend_service/controllers/aggregation.controller.js
const logger = require("../../config/logger");
const { sendResponse } = require("../utils/utils");
const { ERROR_MESSAGES, STATUS } = require("../constants/constants");
const aggregationService = require("../services/aggregation.service");

class AggregationController {
  // Get comprehensive dashboard overview
  async getDashboardOverview(req, res) {
    try {
      const dashboardData = await aggregationService.getDashboardOverview();

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: dashboardData,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "AggregationController",
        method: "getDashboardOverview",
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

module.exports = new AggregationController();
