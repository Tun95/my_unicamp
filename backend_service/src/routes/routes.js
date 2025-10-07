const { HEALTH_STATUS } = require("../constants/constants");
const aggregationController = require("../controllers/aggregation.controller");
const courseController = require("../controllers/course.controller");
const mscCourseController = require("../controllers/msc-course.controller");
const {
  idValidation,
  getCoursesValidation,
  createCourseValidation,
  updateCourseValidation,
  toggleCourseVisibilityValidation,
  getAdminCoursesValidation,
  getMscCoursesValidation,
  compareMscCoursesValidation,
  importMscCoursesValidation,
  mscCourseIdValidation,
  bulkMscOperationsValidation,
} = require("../utils/validators");

setupRoutes = (server) => {
  // Course Routes
  server
    .route("/api/courses")
    .get(getCoursesValidation, courseController.getCourses);

  server
    .route("/api/admin/courses")
    .post(createCourseValidation, courseController.createCourse);

  server.route("/api/courses/filters").get(courseController.getFilterOptions);

  // Latest courses
  server
    .route("/api/admin/courses/latest")
    .get(courseController.getLatestCourses);

  server
    .route("/api/admin/courses")
    .get(getAdminCoursesValidation, courseController.getAdminCourses);

  server
    .route("/api/courses/:id")
    .get(idValidation, courseController.getCourseById);

  server
    .route("/api/admin/courses/:id")
    .put(idValidation, updateCourseValidation, courseController.updateCourse)
    .patch(
      idValidation,
      toggleCourseVisibilityValidation,
      courseController.toggleCourseVisibility
    );

  server
    .route("/api/admin/courses/:id/permanent")
    .delete(idValidation, courseController.permanentDeleteCourse);

  // Dashboard Aggregation Route
  server
    .route("/api/admin/dashboard/overview")
    .get(aggregationController.getDashboardOverview);

  // MSc Course Routes
  server
    .route("/api/msc-courses")
    .get(getMscCoursesValidation, mscCourseController.getMscCourses);

  server
    .route("/api/msc-courses/filters")
    .get(mscCourseController.getMscFilterOptions);

  server
    .route("/api/msc-courses/compare")
    .get(compareMscCoursesValidation, mscCourseController.compareMscCourses);

  server
    .route("/api/admin/msc-courses/import")
    .post(importMscCoursesValidation, mscCourseController.importMscCourses);

  server
    .route("/api/msc-courses/:id")
    .get(mscCourseIdValidation, mscCourseController.getMscCourseById);

  server
    .route("/api/admin/msc-courses/bulk")
    .post(bulkMscOperationsValidation, mscCourseController.bulkMscOperations);

  server.get("/health", async (req, res) => {
    res.status(200).json({ status: HEALTH_STATUS.UP });
  });

  server.get("/", async (req, res) => {
    res.status(200).json({ status: HEALTH_STATUS.UP });
  });
};

module.exports = { setupRoutes };
