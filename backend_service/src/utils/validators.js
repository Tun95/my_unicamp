// backend_service/src/utils/validators.js
const { body, param, query, validationResult } = require("express-validator");
const { STATUS, ERROR_MESSAGES } = require("../constants/constants");
const { sendResponse } = require("./utils");

// Common validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: STATUS.FAILED,
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      errors: errors.array(),
    });
  }
  next();
};

// Validate MongoDB ObjectId
const validateObjectId = (paramName) => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName} format`),
  handleValidationErrors,
];

// ID Validation
const idValidation = validateObjectId("id");

// Get courses validation
const getCoursesValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search query too long")
    .escape(),
  query("university")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("University filter too long")
    .escape(),
  query("degree_type")
    .optional()
    .isString()
    .trim()
    .custom((value) => {
      const validTypes = [
        "bachelor",
        "master",
        "phd",
        "diploma",
        "certificate",
      ];
      if (!validTypes.includes(value.toLowerCase())) {
        throw new Error(
          `Invalid degree type. Must be: ${validTypes.join(", ")}`
        );
      }
      return true;
    })
    .withMessage("Invalid degree type")
    .customSanitizer((value) => {
      // Convert to proper case for consistency
      if (value) {
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      }
      return value;
    }),
  query("field_of_study")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Field of study filter too long")
    .escape(),
  query("location")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location filter too long")
    .escape(),
  handleValidationErrors,
];

// Get admin courses validation
const getAdminCoursesValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search query too long")
    .escape(),
  query("university")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("University filter too long")
    .escape(),
  query("degree_type")
    .optional()
    .isString()
    .trim()
    .isIn(["Bachelor", "Master", "PhD", "Diploma", "Certificate"])
    .withMessage(
      "Invalid degree type. Must be: Bachelor, Master, PhD, Diploma, or Certificate"
    ),
  query("field_of_study")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Field of study filter too long")
    .escape(),
  query("location")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location filter too long")
    .escape(),
  query("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean")
    .toBoolean(),
  handleValidationErrors,
];

// Create course validation
const createCourseValidation = [
  body("title")
    .notEmpty()
    .withMessage("Course title is required")
    .isLength({ max: 200 })
    .withMessage("Course title too long")
    .trim()
    .escape(),
  body("university")
    .notEmpty()
    .withMessage("University name is required")
    .isLength({ max: 150 })
    .withMessage("University name too long")
    .trim()
    .escape(),
  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isLength({ max: 50 })
    .withMessage("Duration description too long")
    .trim()
    .escape(),
  body("location")
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 100 })
    .withMessage("Location too long")
    .trim()
    .escape(),
  body("fees")
    .notEmpty()
    .withMessage("Fees information is required")
    .isLength({ max: 100 })
    .withMessage("Fees description too long")
    .trim()
    .escape(),
  body("degree_type")
    .isIn(["Bachelor", "Master", "PhD", "Diploma", "Certificate"])
    .withMessage("Invalid degree type"),
  body("field_of_study")
    .notEmpty()
    .withMessage("Field of study is required")
    .isLength({ max: 100 })
    .withMessage("Field of study too long")
    .trim()
    .escape(),
  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description too long")
    .escape(),
  body("intake_months")
    .optional()
    .isArray()
    .withMessage("Intake months must be an array"),
  body("intake_months.*")
    .optional()
    .isIn([
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ])
    .withMessage("Invalid month"),
  body("application_deadline")
    .optional()
    .isISO8601()
    .withMessage("Invalid application deadline date"),
  body("language").optional().isString().trim().escape(),
  body("website_url").optional().isURL().withMessage("Invalid website URL"),
  body("contact_email")
    .optional()
    .isEmail()
    .withMessage("Invalid contact email"),
  handleValidationErrors,
];

// Update course validation
const updateCourseValidation = [
  body("title")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Course title too long")
    .trim()
    .escape(),
  body("university")
    .optional()
    .isLength({ max: 150 })
    .withMessage("University name too long")
    .trim()
    .escape(),
  body("duration")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Duration description too long")
    .trim()
    .escape(),
  body("location")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Location too long")
    .trim()
    .escape(),
  body("fees")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Fees description too long")
    .trim()
    .escape(),
  body("degree_type")
    .optional()
    .isIn(["Bachelor", "Master", "PhD", "Diploma", "Certificate"])
    .withMessage("Invalid degree type"),
  body("field_of_study")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Field of study too long")
    .trim()
    .escape(),
  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description too long")
    .escape(),
  body("intake_months")
    .optional()
    .isArray()
    .withMessage("Intake months must be an array"),
  body("intake_months.*")
    .optional()
    .isIn([
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ])
    .withMessage("Invalid month"),
  body("application_deadline")
    .optional()
    .isISO8601()
    .withMessage("Invalid application deadline date"),
  body("language").optional().isString().trim().escape(),
  body("website_url").optional().isURL().withMessage("Invalid website URL"),
  body("contact_email")
    .optional()
    .isEmail()
    .withMessage("Invalid contact email"),
  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean"),
  handleValidationErrors,
];

// Toggle course visibility validation
const toggleCourseVisibilityValidation = [
  body("action")
    .optional()
    .isString()
    .trim()
    .isIn(["hide", "unhide"])
    .withMessage("Action must be either 'hide' or 'unhide'")
    .toLowerCase(),

  handleValidationErrors,
];

// Get MSc courses validation
const getMscCoursesValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50")
    .toInt(),
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search query too long")
    .escape(),
  query("university")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("University filter too long")
    .escape(),
  query("department")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Department filter too long")
    .escape(),
  query("location")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location filter too long")
    .escape(),
  query("max_fees")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Max fees must be a positive number")
    .toFloat(),
  handleValidationErrors,
];

// Import MSc courses validation
const importMscCoursesValidation = [
  body("university")
    .notEmpty()
    .withMessage("University name is required")
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("University name must be between 2 and 100 characters")
    .escape()
    .custom((value) => {
      const supportedUniversities = [
        "university of manchester",
        "university of edinburgh",
        "imperial college london",
        "university of cambridge",
        "university of oxford",
      ];
      if (!supportedUniversities.includes(value.toLowerCase())) {
        throw new Error(
          `Currently supported universities: ${supportedUniversities.join(
            ", "
          )}`
        );
      }
      return true;
    }),
  body("department")
    .notEmpty()
    .withMessage("Department is required")
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Department must be between 2 and 100 characters")
    .escape()
    .custom((value) => {
      const validDepartments = [
        "Computer Science",
        "Engineering",
        "Business",
        "Data Science",
        "Artificial Intelligence",
        "Mathematics",
        "Physics",
        "Chemistry",
      ];
      if (!validDepartments.includes(value)) {
        throw new Error(
          `Supported departments: ${validDepartments.join(", ")}`
        );
      }
      return true;
    }),
  body("options.overwrite")
    .optional()
    .isBoolean()
    .withMessage("Overwrite option must be a boolean")
    .toBoolean(),
  body("options.limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
  body("options.delay")
    .optional()
    .isInt({ min: 0, max: 10000 })
    .withMessage("Delay must be between 0 and 10000 milliseconds")
    .toInt(),
  handleValidationErrors,
];

// Compare MSc courses validation
const compareMscCoursesValidation = [
  query("courseIds")
    .notEmpty()
    .withMessage("Course IDs are required")
    .custom((value) => {
      if (typeof value === "string") {
        value = value.split(",");
      }

      if (!Array.isArray(value)) {
        throw new Error(
          "Course IDs must be an array or comma-separated string"
        );
      }

      if (value.length < 2) {
        throw new Error("At least 2 courses required for comparison");
      }

      if (value.length > 5) {
        throw new Error("Maximum 5 courses can be compared at once");
      }

      // Validate each ID is a valid MongoDB ObjectId
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      for (const id of value) {
        if (!objectIdRegex.test(id.trim())) {
          throw new Error(`Invalid course ID format: ${id}`);
        }
      }

      return true;
    })
    .customSanitizer((value) => {
      if (typeof value === "string") {
        return value.split(",").map((id) => id.trim());
      }
      return value;
    }),
  handleValidationErrors,
];

// MSc course ID validation (for single operations)
const mscCourseIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid course ID format")
    .custom(async (value, { req }) => {
      // Additional validation to ensure it's an MSc course
      try {
        const Course = require("../../models/course.model");
        const course = await Course.findById(value);

        if (!course) {
          throw new Error("Course not found");
        }

        if (course.degree_type !== "Master") {
          throw new Error("This endpoint is for MSc courses only");
        }

        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    }),
  handleValidationErrors,
];

// Bulk MSc operations validation
const bulkMscOperationsValidation = [
  body("courseIds")
    .notEmpty()
    .withMessage("Course IDs are required")
    .isArray({ min: 1 })
    .withMessage("Course IDs must be a non-empty array")
    .custom((value) => {
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      for (const id of value) {
        if (!objectIdRegex.test(id)) {
          throw new Error(`Invalid course ID format: ${id}`);
        }
      }
      return true;
    }),
  body("action")
    .notEmpty()
    .withMessage("Action is required")
    .isIn(["hide", "unhide", "delete"])
    .withMessage("Action must be one of: hide, unhide, delete"),
  handleValidationErrors,
];

module.exports = {
  idValidation,
  getCoursesValidation,

  getAdminCoursesValidation,

  createCourseValidation,
  updateCourseValidation,
  toggleCourseVisibilityValidation,

  getMscCoursesValidation,
  importMscCoursesValidation,
  compareMscCoursesValidation,
  mscCourseIdValidation,
  bulkMscOperationsValidation,

  handleValidationErrors,
};
