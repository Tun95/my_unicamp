const { HEALTH_STATUS } = require("../constants/constants");
const aggregationController = require("../controllers/aggregation.controller");
const courseController = require("../controllers/course.controller");
const ukMScCoursesController = require("../controllers/uk-msc-courses.controller");
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
  getLimitedCoursesValidation,
  getRelatedCoursesValidation,
  getRelatedCoursesBySlugValidation,
} = require("../utils/validators");

setupRoutes = (server) => {
  // Course Routes
  server
    .route("/api/courses")
    .get(getCoursesValidation, courseController.getCourses);

  server
    .route("/api/courses/limited")
    .get(getLimitedCoursesValidation, courseController.getLimitedCourses);

  server
    .route("/api/courses/featured")
    .get(getFeaturedCoursesValidation, courseController.getFeaturedCourses);

  server.route("/api/courses/filters").get(courseController.getFilterOptions);

  server
    .route("/api/courses/:id")
    .get(idValidation, courseController.getCourseById);

  server
    .route("/api/courses/slug/:slug")
    .get(getCourseBySlugValidation, courseController.getCourseBySlug);

  server
    .route("/api/courses/:id/related")
    .get(getRelatedCoursesValidation, courseController.getRelatedCourses);

  server
    .route("/api/courses/slug/:slug/related")
    .get(
      getRelatedCoursesBySlugValidation,
      courseController.getRelatedCoursesBySlug
    );

  server
    .route("/api/admin/courses")
    .post(createCourseValidation, courseController.createCourse);

  // Latest courses
  server
    .route("/api/admin/courses/latest")
    .get(courseController.getLatestCourses);

  server
    .route("/api/admin/courses")
    .get(getAdminCoursesValidation, courseController.getAdminCourses);

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

  // UK MSc Courses Routes
  server
    .route("/api/uk-msc/courses")
    .get(ukMScCoursesController.getUKMScCourses);

  server
    .route("/api/uk-msc/universities")
    .get(ukMScCoursesController.getUKUniversities);

  server
    .route("/api/uk-msc/fields-of-study")
    .get(ukMScCoursesController.getMScFieldsOfStudy);

  server.route("/api/uk-msc/cities").get(ukMScCoursesController.getUKCities);

  server
    .route("/api/uk-msc/filters")
    .get(ukMScCoursesController.getFilterOptions);

  server.get("/health", async (req, res) => {
    res.status(200).json({ status: HEALTH_STATUS.UP });
  });

  server.get("/", async (req, res) => {
    res.status(200).json({ status: HEALTH_STATUS.UP });
  });
};

module.exports = { setupRoutes };
