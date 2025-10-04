const { HEALTH_STATUS } = require("../constants/constants");
const courseController = require("../controllers/course.controller");
const {
  idValidation,
  getCoursesValidation,
  createCourseValidation,
  updateCourseValidation,
  toggleCourseVisibilityValidation,
} = require("../utils/validators");

setupRoutes = (server) => {
  // Course Routes
  server
    .route("/api/courses")
    .get(getCoursesValidation, courseController.getCourses)
    .post(createCourseValidation, courseController.createCourse);

  server.route("/api/courses/filters").get(courseController.getFilterOptions);

  server
    .route("/api/courses/:id")
    .get(idValidation, courseController.getCourseById)
    .put(idValidation, updateCourseValidation, courseController.updateCourse)
    .patch(
      idValidation,
      toggleCourseVisibilityValidation,
      courseController.toggleCourseVisibility
    );

  server
    .route("/api/courses/:id/permanent")
    .delete(idValidation, courseController.permanentDeleteCourse);

  server.get("/health", async (req, res) => {
    res.status(200).json({ status: HEALTH_STATUS.UP });
  });

  server.get("/", async (req, res) => {
    res.status(200).json({ status: HEALTH_STATUS.UP });
  });
};

module.exports = { setupRoutes };
