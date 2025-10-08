// backend_service/src/controllers/msc-course.controller.js
const mscCoursesService = require("../services/msc-course.service");
const { sendResponse } = require("../utils/utils");
const { STATUS, ERROR_MESSAGES } = require("../constants/constants");
const logger = require("../../config/logger");

class MscCourseController {
  // Import MSc courses for a specific university and department
  async importMScCourses(req, res) {
    try {
      const { university, department } = req.body;
      const options = req.body.options || {};

      // Validate required fields
      if (!university || !department) {
        return sendResponse(res, 400, {
          status: STATUS.FAILED,
          message: "University and department are required fields",
        });
      }

      const importResults = await mscCoursesService.importMScCourses(
        university,
        department,
        options
      );

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        message: `Successfully imported ${importResults.created} courses for ${department} at ${university}`,
        data: importResults,
        summary: {
          university,
          department,
          total_attempted:
            importResults.created +
            importResults.skipped +
            importResults.errors.length,
          successfully_imported: importResults.created,
          skipped_duplicates: importResults.skipped,
          errors: importResults.errors.length,
        },
      });
    } catch (error) {
      await logger.error(error, {
        controller: "MscCourseController",
        method: "importMScCourses",
        university: req.body?.university,
        department: req.body?.department,
      });

      if (error.message.includes("not a recognized UK university")) {
        return sendResponse(res, 400, {
          status: STATUS.FAILED,
          message: error.message,
          suggestion:
            "Please verify the university name and ensure it's a UK institution",
        });
      }

      if (error.message.includes("No MSc courses found")) {
        return sendResponse(res, 404, {
          status: STATUS.FAILED,
          message: error.message,
          suggestion:
            "Try different search terms or check if the department offers MSc programs",
        });
      }

      if (
        error.message.includes("search failed") ||
        error.message.includes("timeout")
      ) {
        return sendResponse(res, 503, {
          status: STATUS.FAILED,
          message: "Course search services are temporarily unavailable",
          error: error.message,
        });
      }

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Verify if a university is a recognized UK institution
  async verifyUKUniversity(req, res) {
    try {
      const { university } = req.query;

      if (!university) {
        return sendResponse(res, 400, {
          status: STATUS.FAILED,
          message: "University name is required",
        });
      }

      const isUKUniversity = await mscCoursesService.verifyUKUniversity(
        university
      );

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: {
          university,
          is_uk_university: isUKUniversity,
          verified: isUKUniversity,
        },
        message: isUKUniversity
          ? `${university} is a recognized UK university`
          : `${university} is not recognized as a UK university`,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "MscCourseController",
        method: "verifyUKUniversity",
        university: req.query?.university,
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Search for courses across multiple providers without importing
  async searchMScCourses(req, res) {
    try {
      const { university, department, provider } = req.query;

      if (!university || !department) {
        return sendResponse(res, 400, {
          status: STATUS.FAILED,
          message: "University and department are required fields",
        });
      }

      let courses = [];
      let searchProvider = "multiple";

      // Search via specific provider if specified
      if (provider) {
        switch (provider.toLowerCase()) {
          case "ucas":
            courses = await mscCoursesService.searchViaUCAS(
              university,
              department
            );
            searchProvider = "UCAS";
            break;
          case "hedd":
            courses = await mscCoursesService.searchViaHEDD(
              university,
              department
            );
            searchProvider = "HEDD";
            break;
          case "website":
            courses = await mscCoursesService.searchViaUniversityWebsite(
              university,
              department
            );
            searchProvider = "University Website";
            break;
          default:
            return sendResponse(res, 400, {
              status: STATUS.FAILED,
              message:
                "Invalid provider. Available providers: ucas, hedd, website",
            });
        }
      } else {
        // Search across all providers
        for (const searchProviderFunc of mscCoursesService.courseSearchProviders) {
          try {
            const results = await searchProviderFunc(university, department);
            if (results && results.length > 0) {
              courses = results;
              searchProvider = searchProviderFunc.name || "auto-detected";
              break;
            }
          } catch (error) {
            continue; // Try next provider
          }
        }
      }

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: courses,
        meta: {
          university,
          department,
          provider: searchProvider,
          count: courses.length,
          search_performed: new Date().toISOString(),
        },
        message:
          courses.length > 0
            ? `Found ${courses.length} MSc courses in ${department} at ${university}`
            : `No MSc courses found in ${department} at ${university}`,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "MscCourseController",
        method: "searchMScCourses",
        university: req.query?.university,
        department: req.query?.department,
        provider: req.query?.provider,
      });

      if (error.message.includes("search failed")) {
        return sendResponse(res, 503, {
          status: STATUS.FAILED,
          message: "Search service temporarily unavailable",
          error: error.message,
        });
      }

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Test a specific search provider
  async testSearchProvider(req, res) {
    try {
      const { university, department, provider } = req.body;

      if (!university || !department || !provider) {
        return sendResponse(res, 400, {
          status: STATUS.FAILED,
          message: "University, department, and provider are required fields",
        });
      }

      let courses = [];
      let providerName = "";

      switch (provider.toLowerCase()) {
        case "ucas":
          courses = await mscCoursesService.searchViaUCAS(
            university,
            department
          );
          providerName = "UCAS";
          break;
        case "hedd":
          courses = await mscCoursesService.searchViaHEDD(
            university,
            department
          );
          providerName = "HEDD";
          break;
        case "website":
          courses = await mscCoursesService.searchViaUniversityWebsite(
            university,
            department
          );
          providerName = "University Website";
          break;
        case "google":
          courses = await mscCoursesService.searchViaGooglePrograms(
            university,
            department
          );
          providerName = "Google Programs";
          break;
        default:
          return sendResponse(res, 400, {
            status: STATUS.FAILED,
            message:
              "Invalid provider. Available providers: ucas, hedd, website, google",
          });
      }

      return sendResponse(res, 200, {
        status: STATUS.SUCCESS,
        data: {
          provider: providerName,
          courses,
          test_results: {
            university,
            department,
            courses_found: courses.length,
            success_rate: courses.length > 0 ? "HIGH" : "LOW",
            timestamp: new Date().toISOString(),
          },
        },
        message: `Tested ${providerName} provider: Found ${courses.length} courses`,
      });
    } catch (error) {
      await logger.error(error, {
        controller: "MscCourseController",
        method: "testSearchProvider",
        university: req.body?.university,
        department: req.body?.department,
        provider: req.body?.provider,
      });

      return sendResponse(res, 500, {
        status: STATUS.FAILED,
        message: `Provider test failed: ${error.message}`,
      });
    }
  }
}

const mscCourseController = new MscCourseController();
module.exports = mscCourseController;
