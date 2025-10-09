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
  toggleFeaturedValidation,
  getFeaturedCoursesValidation,
  getCourseBySlugValidation,
} = require("../utils/validators");

setupRoutes = (server) => {
  // Course Routes
  server
    .route("/api/courses")
    .get(getCoursesValidation, courseController.getCourses);

  server
    .route("/api/admin/courses")
    .post(createCourseValidation, courseController.createCourse);

  server
    .route("/api/courses/featured")
    .get(getFeaturedCoursesValidation, courseController.getFeaturedCourses);

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
    .route("/api/courses/slug/:slug")
    .get(getCourseBySlugValidation, courseController.getCourseBySlug);

  server
    .route("/api/admin/courses/:id")
    .put(idValidation, updateCourseValidation, courseController.updateCourse)
    .patch(
      idValidation,
      toggleCourseVisibilityValidation,
      courseController.toggleCourseVisibility
    );

  server
    .route("/api/admin/courses/:id/featured")
    .patch(
      idValidation,
      toggleFeaturedValidation,
      courseController.toggleFeaturedStatus
    );

  server
    .route("/api/admin/courses/:id/permanent")
    .delete(idValidation, courseController.permanentDeleteCourse);

  // Dashboard Aggregation Route
  server
    .route("/api/admin/dashboard/overview")
    .get(aggregationController.getDashboardOverview);

  // MSc Course Import Routes
  server
    .route("/api/admin/msc-courses/import")
    .post(mscCourseController.importMScCourses);

  server
    .route("/api/admin/msc-courses/search")
    .get(mscCourseController.searchMScCourses);

  server
    .route("/api/admin/msc-courses/verify-university")
    .get(mscCourseController.verifyUKUniversity);

  server
    .route("/api/admin/msc-courses/test-provider")
    .post(mscCourseController.testSearchProvider);

  server.get("/health", async (req, res) => {
    res.status(200).json({ status: HEALTH_STATUS.UP });
  });

  server.get("/", async (req, res) => {
    res.status(200).json({ status: HEALTH_STATUS.UP });
  });
};

module.exports = { setupRoutes };
