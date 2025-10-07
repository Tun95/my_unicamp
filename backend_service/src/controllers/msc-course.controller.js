// backend_service/src/controllers/msc-course.controller.js
const courseService = require("../services/course.service");
const dataImportService = require("../services/data-import.service");
const { sendResponse } = require("../utils/utils");
const { STATUS, ERROR_MESSAGES } = require("../constants/constants");
const logger = require("../../config/logger");

class MscCourseController {
  // Get MSc courses with department filtering
  async getMscCourses(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        university,
        department,
        location,
        max_fees,
      } = req.query;

      // Build enhanced query for MSc courses
      let query = {
        is_active: true,
        degree_type: "Master",
      };

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

      // Filter by department (field_of_study)
      if (department) {
        query.field_of_study = { $regex: department, $options: "i" };
      }

      // Filter by location
      if (location) {
        query.location = { $regex: location, $options: "i" };
      }

      // Filter by maximum fees
      if (max_fees) {
        query["tuition_fee.amount"] = { $lte: parseFloat(max_fees) };
      }

      const courses = await courseService.getCourses({
        page: parseInt(page),
        limit: parseInt(limit),
        query, // Pass custom query
      });

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: courses.courses,
        pagination: courses.pagination,
        filters: {
          search,
          university,
          department,
          location,
          max_fees,
        },
      });
    } catch (error) {
      await logger.error(error, {
        controller: "MscCourseController",
        method: "getMscCourses",
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Import MSc courses from external source
  async importMscCourses(req, res) {
    try {
      const { university, department, options = {} } = req.body;

      if (!university || !department) {
        return sendResponse(res, 400, {
          status: STATUS.FAILED,
          message: "University and department are required",
        });
      }

      const importResult = await dataImportService.importMScCourses(
        university,
        department,
        options
      );

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        message: "MSc courses import completed",
        data: importResult,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "MscCourseController",
        method: "importMscCourses",
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Compare multiple MSc courses
  async compareMscCourses(req, res) {
    try {
      const { courseIds } = req.query;

      if (!courseIds || !Array.isArray(courseIds)) {
        return sendResponse(res, 400, {
          status: STATUS.FAILED,
          message: "Course IDs array is required",
        });
      }

      const comparisonData = await Promise.all(
        courseIds.map((id) => courseService.getCourseById(id))
      );

      // Structure data for comparison view
      const comparison = {
        courses: comparisonData,
        comparison_fields: [
          "title",
          "university",
          "duration",
          "fees",
          "tuition_fee",
          "entry_requirements",
          "intake_months",
          "location",
        ],
      };

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: comparison,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "MscCourseController",
        method: "compareMscCourses",
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Get MSc-specific filter options
  async getMscFilterOptions(req, res) {
    try {
      const filterOptions = await courseService.getFilterOptions();

      // Enhance with MSc-specific options
      const mscFilterOptions = {
        ...filterOptions,
        departments: await dataImportService.getUniqueDepartments(),
        study_modes: ["Full-time", "Part-time", "Distance learning"],
        fee_ranges: [
          { label: "Under £10,000", min: 0, max: 10000 },
          { label: "£10,000 - £20,000", min: 10000, max: 20000 },
          { label: "Over £20,000", min: 20000, max: 999999 },
        ],
      };

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: mscFilterOptions,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "MscCourseController",
        method: "getMscFilterOptions",
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

const mscCourseController = new MscCourseController();
module.exports = mscCourseController;
