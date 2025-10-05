const { HEALTH_STATUS } = require("../constants/constants");
const aggregationController = require("../controllers/aggregation.controller");
const courseController = require("../controllers/course.controller");
const {
  idValidation,
  getCoursesValidation,
  createCourseValidation,
  updateCourseValidation,
  toggleCourseVisibilityValidation,
  getAdminCoursesValidation,
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

  server.get("/health", async (req, res) => {
    res.status(200).json({ status: HEALTH_STATUS.UP });
  });

  server.get("/", async (req, res) => {
    res.status(200).json({ status: HEALTH_STATUS.UP });
  });
};

module.exports = { setupRoutes };
