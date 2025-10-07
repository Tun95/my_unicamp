// services/data-import.service.js
const Course = require("../../models/course.model");
const CourseService = require("./course.service");
const logger = require("../../config/logger");
const axios = require("axios");
const cheerio = require("cheerio");

class DataImportService {
  constructor() {
    this.courseService = CourseService;
  }

  // Main method to import MSc courses for a specific university and department
  async importMScCourses(university, department, options = {}) {
    try {
      await logger.info("Starting MSc course import", {
        service: "DataImportService",
        method: "importMScCourses",
        university,
        department,
        options,
      });

      let coursesData = [];

      // Choose import strategy based on university
      switch (university.toLowerCase()) {
        case "university of manchester":
          coursesData = await this.scrapeManchesterMSc(department);
          break;
        case "university of edinburgh":
          coursesData = await this.scrapeEdinburghMSc(department);
          break;
        case "imperial college london":
          coursesData = await this.scrapeImperialMSc(department);
          break;
        default:
          throw new Error(`Unsupported university: ${university}`);
      }

      // Import courses using existing service
      const importResults = await this.importCoursesToDatabase(
        coursesData,
        options
      );

      await logger.info("MSc course import completed", {
        service: "DataImportService",
        method: "importMScCourses",
        university,
        department,
        attempted: coursesData.length,
        created: importResults.created,
        skipped: importResults.skipped,
        errors: importResults.errors,
      });

      return importResults;
    } catch (error) {
      await logger.error(error, {
        service: "DataImportService",
        method: "importMScCourses",
        university,
        department,
      });
      throw error;
    }
  }

  // University of Manchester MSc scraper (Computer Science department example)
  async scrapeManchesterMSc(department) {
    try {
      const courses = [];

      // Example structure - you'll need to adapt to actual university website
      const baseUrl = "https://www.manchester.ac.uk";
      const departmentUrl = `${baseUrl}/study/masters/courses/list/${this.getDepartmentSlug(
        department
      )}/`;

      const response = await axios.get(departmentUrl, {
        timeout: 10000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      const $ = cheerio.load(response.data);

      // Extract course information - this will vary by university website structure
      $(".course-listing").each((index, element) => {
        const $course = $(element);

        const courseData = {
          title: $course.find(".course-title").text().trim(),
          university: "University of Manchester",
          degree_type: "Master",
          field_of_study: department,
          duration: this.extractDuration($course.find(".duration").text()),
          location: "Manchester, UK",
          fees: this.extractFees($course.find(".fees").text()),
          description: $course.find(".course-description").text().trim(),
          website_url: baseUrl + $course.find("a").attr("href"),
          intake_months: ["September"], // Most UK MSc start in September
          application_deadline: this.calculateDeadline(),
          language: "English",
          tuition_fee: {
            amount: this.extractTuitionAmount($course.find(".fees").text()),
            currency: "GBP",
            period: "per_year",
          },
          entry_requirements: {
            minimum_gpa: 3.0, // Typical for UK MSc
            language_tests: [
              {
                test_type: "IELTS",
                minimum_score: "6.5",
              },
            ],
            prerequisites: this.extractPrerequisites(
              $course.find(".requirements").text()
            ),
          },
          is_active: true,
        };

        // Clean and validate data
        if (this.validateCourseData(courseData)) {
          courses.push(courseData);
        }
      });

      return courses;
    } catch (error) {
      await logger.error(error, {
        service: "DataImportService",
        method: "scrapeManchesterMSc",
        department,
      });
      throw new Error(`Failed to scrape Manchester courses: ${error.message}`);
    }
  }

  // Import courses to database using existing service
  async importCoursesToDatabase(coursesData, options = {}) {
    const results = {
      created: 0,
      skipped: 0,
      errors: [],
    };

    for (const courseData of coursesData) {
      try {
        // Use existing course service to handle duplicates and validation
        const course = await this.courseService.createCourse(courseData);
        results.created++;

        await logger.info("Course imported successfully", {
          service: "DataImportService",
          method: "importCoursesToDatabase",
          course_id: course._id,
          title: course.title,
        });
      } catch (error) {
        if (error.message === "COURSE_ALREADY_EXISTS") {
          results.skipped++;
          await logger.info("Course already exists, skipped", {
            service: "DataImportService",
            method: "importCoursesToDatabase",
            title: courseData.title,
          });
        } else {
          results.errors.push({
            course: courseData.title,
            error: error.message,
          });
          await logger.error("Failed to import course", {
            service: "DataImportService",
            method: "importCoursesToDatabase",
            title: courseData.title,
            error: error.message,
          });
        }
      }
    }

    return results;
  }

  // Helper methods
  getDepartmentSlug(department) {
    const slugs = {
      "Computer Science": "computer-science",
      Engineering: "engineering",
      Business: "business",
      "Data Science": "data-science",
      "Artificial Intelligence": "artificial-intelligence",
    };
    return slugs[department] || department.toLowerCase().replace(/\s+/g, "-");
  }

  extractDuration(durationText) {
    // Extract duration from various formats
    const match = durationText.match(/(\d+)\s*(year|month)/i);
    return match ? `${match[1]} ${match[2]}s` : "12 months";
  }

  extractFees(feesText) {
    const match = feesText.match(/(£|GBP)\s*(\d+[,\.\d]*)/);
    return match ? `£${match[2]} per year` : "Contact university for fees";
  }

  extractTuitionAmount(feesText) {
    const match = feesText.match(/(\d+[,\.\d]*)/);
    return match ? parseFloat(match[1].replace(",", "")) : null;
  }

  extractPrerequisites(requirementsText) {
    const prerequisites = [];
    if (
      requirementsText.includes("computer science") ||
      requirementsText.includes("programming")
    ) {
      prerequisites.push("Background in Computer Science or related field");
    }
    if (requirementsText.includes("mathematics")) {
      prerequisites.push("Strong mathematics background");
    }
    return prerequisites;
  }

  calculateDeadline() {
    // Typically August for September intake
    const nextYear = new Date().getFullYear() + 1;
    return new Date(`${nextYear}-08-31`);
  }

  validateCourseData(courseData) {
    return (
      courseData.title &&
      courseData.university &&
      courseData.field_of_study &&
      courseData.duration
    );
  }

  // Get import status and statistics
  async getImportStatus() {
    const stats = await Course.aggregate([
      {
        $group: {
          _id: "$university",
          total: { $sum: 1 },
          masters: {
            $sum: {
              $cond: [{ $eq: ["$degree_type", "Master"] }, 1, 0],
            },
          },
        },
      },
    ]);

    return stats;
  }

  // Helper method to get unique departments
  async getUniqueDepartments() {
    const departments = await Course.distinct("field_of_study", {
      is_active: true,
      degree_type: "Master",
    });
    return departments.sort();
  }
}

module.exports = new DataImportService();
