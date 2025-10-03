const { HEALTH_STATUS } = require("../constants/constants");
const courseController = require("../controllers/course.controller");
const {
  idValidation,
  getCoursesValidation,
  createCourseValidation,
  updateCourseValidation,
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
    .put(idValidation, updateCourseValidation, courseController.updateCourse);

  server.get("/health", async (req, res) => {
    res.status(200).json({ status: HEALTH_STATUS.UP });
  });

  server.get("/", async (req, res) => {
    res.status(200).json({ status: HEALTH_STATUS.UP });
  });
};

module.exports = { setupRoutes };
