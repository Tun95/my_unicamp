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

module.exports = {
  idValidation,
  getCoursesValidation,
  createCourseValidation,
  updateCourseValidation,
  handleValidationErrors,
};
