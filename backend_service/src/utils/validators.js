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

// Get courses validation with enhanced filters
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
  query("country")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Country filter too long")
    .escape(),
  query("city")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("City filter too long")
    .escape(),
  query("min_tuition")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum tuition must be a positive number")
    .toFloat(),
  query("max_tuition")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum tuition must be a positive number")
    .toFloat(),
  query("intake_month")
    .optional()
    .isString()
    .trim()
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
    .withMessage("Invalid intake month"),
  query("duration")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Duration filter too long")
    .escape(),
  query("is_featured")
    .optional()
    .isBoolean()
    .withMessage("is_featured must be a boolean")
    .toBoolean(),
  query("sort_by")
    .optional()
    .isString()
    .trim()
    .isIn([
      "title",
      "university",
      "tuition_fee.amount",
      "createdAt",
      "updatedAt",
    ])
    .withMessage("Invalid sort field"),
  query("sort_order")
    .optional()
    .isString()
    .trim()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be 'asc' or 'desc'"),
  handleValidationErrors,
];

// Limited courses validation (same filters but no pagination)
const getLimitedCoursesValidation = [
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
  query("country")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Country filter too long")
    .escape(),
  query("city")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("City filter too long")
    .escape(),
  query("min_tuition")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum tuition must be a positive number")
    .toFloat(),
  query("max_tuition")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum tuition must be a positive number")
    .toFloat(),
  query("intake_month")
    .optional()
    .isString()
    .trim()
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
    .withMessage("Invalid intake month"),
  query("duration")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Duration filter too long")
    .escape(),
  query("is_featured")
    .optional()
    .isBoolean()
    .withMessage("is_featured must be a boolean")
    .toBoolean(),
  query("sort_by")
    .optional()
    .isString()
    .trim()
    .isIn([
      "title",
      "university",
      "tuition_fee.amount",
      "createdAt",
      "updatedAt",
    ])
    .withMessage("Invalid sort field"),
  query("sort_order")
    .optional()
    .isString()
    .trim()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be 'asc' or 'desc'"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 6 })
    .withMessage("Limit must be between 1 and 6")
    .toInt(),
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
  query("country")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Country filter too long")
    .escape(),
  query("city")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("City filter too long")
    .escape(),
  query("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean")
    .toBoolean(),
  query("is_featured")
    .optional()
    .isBoolean()
    .withMessage("is_featured must be a boolean")
    .toBoolean(),
  handleValidationErrors,
];

// Location object validation
const validateLocation = (prefix = "") => {
  const field = prefix ? `${prefix}.` : "";
  return [
    body(`${field}address`)
      .optional()
      .isString()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Address too long")
      .escape(),
    body(`${field}city`)
      .notEmpty()
      .withMessage("City is required")
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage("City name too long")
      .escape(),
    body(`${field}state`)
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage("State name too long")
      .escape(),
    body(`${field}country`)
      .notEmpty()
      .withMessage("Country is required")
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Country name too long")
      .escape(),
    body(`${field}postal_code`)
      .optional()
      .isString()
      .trim()
      .isLength({ max: 20 })
      .withMessage("Postal code too long")
      .escape(),
    body(`${field}coordinates.latitude`)
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude must be between -90 and 90")
      .toFloat(),
    body(`${field}coordinates.longitude`)
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude must be between -180 and 180")
      .toFloat(),
  ];
};

// Tuition fee object validation
const validateTuitionFee = (prefix = "") => {
  const field = prefix ? `${prefix}.` : "";
  return [
    body(`${field}amount`)
      .notEmpty()
      .withMessage("Tuition amount is required")
      .isFloat({ min: 0 })
      .withMessage("Tuition amount must be a positive number")
      .toFloat(),
    body(`${field}currency`)
      .optional()
      .isString()
      .trim()
      .isLength({ max: 10 })
      .withMessage("Currency code too long")
      .escape(),
    body(`${field}period`)
      .optional()
      .isString()
      .trim()
      .isIn(["per_year", "per_semester", "total_course"])
      .withMessage("Invalid tuition period"),
  ];
};

// Entry requirements validation
const validateEntryRequirements = (prefix = "") => {
  const field = prefix ? `${prefix}.` : "";
  return [
    body(`${field}minimum_gpa`)
      .optional()
      .isFloat({ min: 0, max: 4.0 })
      .withMessage("Minimum GPA must be between 0 and 4.0")
      .toFloat(),
    body(`${field}language_tests`)
      .optional()
      .isArray()
      .withMessage("Language tests must be an array"),
    body(`${field}language_tests.*.test_type`)
      .optional()
      .isString()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Test type too long")
      .escape(),
    body(`${field}language_tests.*.minimum_score`)
      .optional()
      .isString()
      .trim()
      .isLength({ max: 20 })
      .withMessage("Minimum score too long")
      .escape(),
    body(`${field}prerequisites`)
      .optional()
      .isArray()
      .withMessage("Prerequisites must be an array"),
    body(`${field}prerequisites.*`)
      .optional()
      .isString()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Prerequisite too long")
      .escape(),
  ];
};

// Create course validation with enhanced schema
const createCourseValidation = [
  body("title")
    .notEmpty()
    .withMessage("Course title is required")
    .isLength({ max: 200 })
    .withMessage("Course title too long")
    .trim()
    .escape(),
  body("slug")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Slug too long")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
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
    .isLength({ max: 2000 })
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
  body("language")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Language too long")
    .escape(),
  body("website_url")
    .optional()
    .isURL()
    .withMessage("Invalid website URL")
    .isLength({ max: 500 })
    .withMessage("Website URL too long"),
  body("contact_email")
    .optional()
    .isEmail()
    .withMessage("Invalid contact email")
    .normalizeEmail(),
  body("is_featured")
    .optional()
    .isBoolean()
    .withMessage("is_featured must be a boolean")
    .toBoolean(),
  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean")
    .toBoolean(),

  // Location validation
  ...validateLocation("location"),

  // Tuition fee validation
  ...validateTuitionFee("tuition_fee"),

  // Entry requirements validation
  ...validateEntryRequirements("entry_requirements"),

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
  body("slug")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Slug too long")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
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
    .isLength({ max: 2000 })
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
  body("language")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Language too long")
    .escape(),
  body("website_url")
    .optional()
    .isURL()
    .withMessage("Invalid website URL")
    .isLength({ max: 500 })
    .withMessage("Website URL too long"),
  body("contact_email")
    .optional()
    .isEmail()
    .withMessage("Invalid contact email")
    .normalizeEmail(),
  body("is_featured")
    .optional()
    .isBoolean()
    .withMessage("is_featured must be a boolean")
    .toBoolean(),
  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean")
    .toBoolean(),

  // Location validation (optional for update)
  body("location.address")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Address too long")
    .escape(),
  body("location.city")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("City name too long")
    .escape(),
  body("location.state")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("State name too long")
    .escape(),
  body("location.country")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Country name too long")
    .escape(),
  body("location.postal_code")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Postal code too long")
    .escape(),
  body("location.coordinates.latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90")
    .toFloat(),
  body("location.coordinates.longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180")
    .toFloat(),

  // Tuition fee validation (optional for update)
  body("tuition_fee.amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Tuition amount must be a positive number")
    .toFloat(),
  body("tuition_fee.currency")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Currency code too long")
    .escape(),
  body("tuition_fee.period")
    .optional()
    .isString()
    .trim()
    .isIn(["per_year", "per_semester", "total_course"])
    .withMessage("Invalid tuition period"),

  // Entry requirements validation (optional for update)
  body("entry_requirements.minimum_gpa")
    .optional()
    .isFloat({ min: 0, max: 4.0 })
    .withMessage("Minimum GPA must be between 0 and 4.0")
    .toFloat(),
  body("entry_requirements.language_tests")
    .optional()
    .isArray()
    .withMessage("Language tests must be an array"),
  body("entry_requirements.language_tests.*.test_type")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Test type too long")
    .escape(),
  body("entry_requirements.language_tests.*.minimum_score")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Minimum score too long")
    .escape(),
  body("entry_requirements.prerequisites")
    .optional()
    .isArray()
    .withMessage("Prerequisites must be an array"),
  body("entry_requirements.prerequisites.*")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Prerequisite too long")
    .escape(),

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

// Toggle featured status validation
const toggleFeaturedValidation = [
  body("is_featured")
    .notEmpty()
    .withMessage("is_featured is required")
    .isBoolean()
    .withMessage("is_featured must be a boolean")
    .toBoolean(),
  handleValidationErrors,
];

// Get featured courses validation
const getFeaturedCoursesValidation = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Limit must be between 1 and 20")
    .toInt(),
  handleValidationErrors,
];

// Get course by slug validation
const getCourseBySlugValidation = [
  param("slug")
    .notEmpty()
    .withMessage("Slug is required")
    .isString()
    .trim()
    // phd-in-data-science-and-machine-learning-stanford-university-410544
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .escape(),
  handleValidationErrors,
];

// Get related courses by ID validation
const getRelatedCoursesValidation = [
  param("id")
    .notEmpty()
    .withMessage("Course ID is required")
    .isMongoId()
    .withMessage("Course ID must be a valid MongoDB ObjectId"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Limit must be between 1 and 10")
    .toInt(),
  handleValidationErrors,
];

// Get related courses by slug validation
const getRelatedCoursesBySlugValidation = [
  param("slug")
    .notEmpty()
    .withMessage("Slug is required")
    .isString()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .escape(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Limit must be between 1 and 10")
    .toInt(),
  handleValidationErrors,
];

module.exports = {
  idValidation,
  getCoursesValidation,
  getLimitedCoursesValidation,

  getAdminCoursesValidation,

  createCourseValidation,
  updateCourseValidation,
  toggleCourseVisibilityValidation,
  toggleFeaturedValidation,
  getFeaturedCoursesValidation,
  getCourseBySlugValidation,
  getRelatedCoursesValidation,
  getRelatedCoursesBySlugValidation,

  handleValidationErrors,
};
