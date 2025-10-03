// backend_service/src/constants/messages.js

// Server Health
const HEALTH_STATUS = {
  UP: "UP",
  DOWN: "DOWN",
};

// Status messages
const STATUS = {
  FAILED: "failed",
  SUCCESS: "success",
  ERROR: "error",
};

const ERROR_MESSAGES = {
  // Course related messages
  COURSE_NOT_FOUND: "Course not found",
  COURSE_NOT_AVAILABLE: "Course not available",

  // Validation messages
  VALIDATION_ERROR: "Validation failed",

  // General messages
  INTERNAL_SERVER_ERROR: "Internal server error",
};

module.exports = {
  STATUS,
  HEALTH_STATUS,
  ERROR_MESSAGES,
};
