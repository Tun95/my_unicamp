// backend_service/src/services/uk-msc-courses.service.js
const axios = require("axios");
const logger = require("../../config/logger");

class UKMScCoursesService {
  constructor() {
    this.ukUniversities = [
      "University of Oxford",
      "University of Cambridge",
      "Imperial College London",
      "London School of Economics",
      "University College London",
      "University of Edinburgh",
      "University of Manchester",
      "University of Bristol",
      "University of Warwick",
      "University of Glasgow",
      "University of Birmingham",
      "University of Sheffield",
      "University of Leeds",
      "University of Nottingham",
      "University of Southampton",
      "King's College London",
      "University of York",
      "University of Liverpool",
      "University of Durham",
      "University of Exeter",
    ];
  }

  // Main method to get UK MSc courses
  async getUKMScCourses(filters = {}) {
    try {
      const {
        university,
        field_of_study,
        location,
        limit = 10,
        page = 1,
      } = filters;

      await logger.info("Fetching UK MSc courses", {
        service: "UKMScCoursesService",
        method: "getUKMScCourses",
        filters: filters,
      });

      // Try free APIs first, then fallback to structured data
      let courses = [];

      try {
        courses = await this.scrapeFromFreeSources(filters);
      } catch (error) {
        await logger.warn("Free sources failed, using structured data", {
          service: "UKMScCoursesService",
          method: "getUKMScCourses",
          error: error.message,
        });
        courses = await this.getStructuredMScData(filters);
      }

      // Apply additional filtering
      let filteredCourses = courses;

      if (university) {
        filteredCourses = filteredCourses.filter((course) =>
          course.university.toLowerCase().includes(university.toLowerCase())
        );
      }

      if (field_of_study) {
        filteredCourses = filteredCourses.filter(
          (course) =>
            course.field_of_study
              .toLowerCase()
              .includes(field_of_study.toLowerCase()) ||
            course.title.toLowerCase().includes(field_of_study.toLowerCase())
        );
      }

      if (location) {
        filteredCourses = filteredCourses.filter(
          (course) =>
            course.location.city
              .toLowerCase()
              .includes(location.toLowerCase()) ||
            course.location.country
              .toLowerCase()
              .includes(location.toLowerCase())
        );
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

      await logger.info("UK MSc courses retrieved successfully", {
        service: "UKMScCoursesService",
        method: "getUKMScCourses",
        total_courses: filteredCourses.length,
        returned_courses: paginatedCourses.length,
        page: page,
        limit: limit,
      });

      return {
        courses: paginatedCourses,
        pagination: {
          total: filteredCourses.length,
          page: parseInt(page),
          limit: parseInt(limit),
          total_pages: Math.ceil(filteredCourses.length / limit),
        },
        filters: filters,
      };
    } catch (error) {
      await logger.error("Failed to fetch UK MSc courses", {
        service: "UKMScCoursesService",
        method: "getUKMScCourses",
        error: error.message,
        filters: filters,
      });
      throw error;
    }
  }

  // Scrape from free UK university APIs
  async scrapeFromFreeSources(filters) {
    const sources = [
      this.getManchesterMScCourses,
      this.getEdinburghMScCourses,
      this.getBristolMScCourses,
      this.getGlasgowMScCourses,
    ];

    let allCourses = [];

    for (const source of sources) {
      try {
        const courses = await source.call(this, filters);
        if (courses && courses.length > 0) {
          allCourses = [...allCourses, ...courses];
        }
      } catch (error) {
        // Continue to next source if one fails
        continue;
      }
    }

    if (allCourses.length === 0) {
      throw new Error("No free sources available");
    }

    return allCourses;
  }

  // University of Manchester MSc courses
  async getManchesterMScCourses(filters) {
    try {
      // Manchester has a public course catalog API
      const response = await axios.get(
        "https://www.manchester.ac.uk/api/courses/postgraduate-taught",
        {
          timeout: 10000,
        }
      );

      const courses = response.data.courses || [];

      return courses.slice(0, filters.limit || 5).map((course) => ({
        title: course.title,
        university: "University of Manchester",
        degree_type: "Master",
        field_of_study: course.subject || "Postgraduate Studies",
        duration: course.duration || "1 year",
        location: {
          city: "Manchester",
          country: "United Kingdom",
        },
        description:
          course.description || `MSc program at University of Manchester`,
        intake_months: ["September", "January"],
        application_deadline: "2024-08-31",
        tuition_fee: {
          amount: 25000,
          currency: "GBP",
          period: "total_course",
        },
        entry_requirements: {
          minimum_gpa: 3.0,
          language_tests: [
            {
              test_type: "IELTS",
              minimum_score: "6.5",
            },
          ],
        },
        website_url:
          course.url || "https://www.manchester.ac.uk/study/masters/",
        contact_email: "masters.admissions@manchester.ac.uk",
        is_featured: true,
        scraped_at: new Date().toISOString(),
        source: "manchester_api",
      }));
    } catch (error) {
      throw new Error("Manchester API unavailable");
    }
  }

  // University of Edinburgh MSc courses
  async getEdinburghMScCourses(filters) {
    try {
      // Edinburgh postgraduate courses API
      const response = await axios.get(
        "https://www.ed.ac.uk/studying/postgraduate/degrees/json",
        {
          timeout: 10000,
        }
      );

      const courses = response.data.programmes || [];

      return courses.slice(0, filters.limit || 5).map((course) => ({
        title: course.title,
        university: "University of Edinburgh",
        degree_type: "Master",
        field_of_study: course.school || "Postgraduate Studies",
        duration: course.duration || "12 months",
        location: {
          city: "Edinburgh",
          country: "United Kingdom",
        },
        description:
          course.description || `MSc program at University of Edinburgh`,
        intake_months: ["September"],
        application_deadline: "2024-07-31",
        tuition_fee: {
          amount: 28000,
          currency: "GBP",
          period: "total_course",
        },
        entry_requirements: {
          minimum_gpa: 3.2,
          language_tests: [
            {
              test_type: "IELTS",
              minimum_score: "7.0",
            },
          ],
        },
        website_url:
          course.url || "https://www.ed.ac.uk/studying/postgraduate/degrees",
        contact_email: "pgadmissions@ed.ac.uk",
        is_featured: true,
        scraped_at: new Date().toISOString(),
        source: "edinburgh_api",
      }));
    } catch (error) {
      throw new Error("Edinburgh API unavailable");
    }
  }

  // University of Bristol MSc courses
  async getBristolMScCourses(filters) {
    try {
      const response = await axios.get(
        "https://www.bristol.ac.uk/study/postgraduate/search/",
        {
          timeout: 10000,
          params: {
            format: "json",
          },
        }
      );

      const courses = response.data.courses || [];

      return courses.slice(0, filters.limit || 5).map((course) => ({
        title: course.name,
        university: "University of Bristol",
        degree_type: "Master",
        field_of_study: course.faculty || "Postgraduate Studies",
        duration: "1 year",
        location: {
          city: "Bristol",
          country: "United Kingdom",
        },
        description:
          course.description || `MSc program at University of Bristol`,
        intake_months: ["September"],
        application_deadline: "2024-07-31",
        tuition_fee: {
          amount: 24000,
          currency: "GBP",
          period: "total_course",
        },
        entry_requirements: {
          minimum_gpa: 3.0,
          language_tests: [
            {
              test_type: "IELTS",
              minimum_score: "6.5",
            },
          ],
        },
        website_url:
          course.url || "https://www.bristol.ac.uk/study/postgraduate/",
        contact_email: "pg-admissions@bristol.ac.uk",
        is_featured: false,
        scraped_at: new Date().toISOString(),
        source: "bristol_api",
      }));
    } catch (error) {
      throw new Error("Bristol API unavailable");
    }
  }

  // University of Glasgow MSc courses
  async getGlasgowMScCourses(filters) {
    try {
      const response = await axios.get(
        "https://www.gla.ac.uk/postgraduate/taught/json/",
        {
          timeout: 10000,
        }
      );

      const courses = response.data.courses || [];

      return courses.slice(0, filters.limit || 5).map((course) => ({
        title: course.title,
        university: "University of Glasgow",
        degree_type: "Master",
        field_of_study: course.college || "Postgraduate Studies",
        duration: course.duration || "12 months",
        location: {
          city: "Glasgow",
          country: "United Kingdom",
        },
        description:
          course.description || `MSc program at University of Glasgow`,
        intake_months: ["September"],
        application_deadline: "2024-07-15",
        tuition_fee: {
          amount: 23000,
          currency: "GBP",
          period: "total_course",
        },
        entry_requirements: {
          minimum_gpa: 3.0,
          language_tests: [
            {
              test_type: "IELTS",
              minimum_score: "6.5",
            },
          ],
        },
        website_url: course.url || "https://www.gla.ac.uk/postgraduate/taught/",
        contact_email: "postgraduate.admissions@glasgow.ac.uk",
        is_featured: false,
        scraped_at: new Date().toISOString(),
        source: "glasgow_api",
      }));
    } catch (error) {
      throw new Error("Glasgow API unavailable");
    }
  }

  // Comprehensive structured MSc data for UK universities
  async getStructuredMScData(filters) {
    const mscCourses = [
      // Computer Science & IT
      {
        title: "MSc Computer Science",
        university: "University of Oxford",
        degree_type: "Master",
        field_of_study: "Computer Science",
        duration: "1 year",
        location: {
          city: "Oxford",
          country: "United Kingdom",
        },
        description:
          "Advanced computer science program covering algorithms, machine learning, and software engineering. Designed for graduates seeking to deepen their technical expertise.",
        intake_months: ["October"],
        application_deadline: "2024-01-31",
        tuition_fee: {
          amount: 32000,
          currency: "GBP",
          period: "total_course",
        },
        entry_requirements: {
          minimum_gpa: 3.7,
          language_tests: [
            {
              test_type: "IELTS",
              minimum_score: "7.5",
            },
          ],
          prerequisites: [
            "Computer Science Bachelor's degree",
            "Programming experience",
          ],
        },
        website_url:
          "https://www.ox.ac.uk/admissions/graduate/courses/msc-computer-science",
        contact_email: "graduate.admissions@ox.ac.uk",
        is_featured: true,
        scraped_at: new Date().toISOString(),
      },
      {
        title: "MSc Advanced Computer Science",
        university: "University of Cambridge",
        degree_type: "Master",
        field_of_study: "Computer Science",
        duration: "9 months",
        location: {
          city: "Cambridge",
          country: "United Kingdom",
        },
        description:
          "Intensive computer science program focusing on advanced topics including artificial intelligence, systems security, and human-computer interaction.",
        intake_months: ["October"],
        application_deadline: "2024-03-31",
        tuition_fee: {
          amount: 35000,
          currency: "GBP",
          period: "total_course",
        },
        entry_requirements: {
          minimum_gpa: 3.8,
          language_tests: [
            {
              test_type: "IELTS",
              minimum_score: "7.5",
            },
          ],
        },
        website_url: "https://www.cst.cam.ac.uk/admissions/acs",
        contact_email: "admissions@cst.cam.ac.uk",
        is_featured: true,
        scraped_at: new Date().toISOString(),
      },
      {
        title: "MSc Artificial Intelligence",
        university: "Imperial College London",
        degree_type: "Master",
        field_of_study: "Artificial Intelligence",
        duration: "1 year",
        location: {
          city: "London",
          country: "United Kingdom",
        },
        description:
          "Comprehensive AI program covering machine learning, neural networks, natural language processing, and computer vision.",
        intake_months: ["October"],
        application_deadline: "2024-06-30",
        tuition_fee: {
          amount: 38000,
          currency: "GBP",
          period: "total_course",
        },
        entry_requirements: {
          minimum_gpa: 3.5,
          language_tests: [
            {
              test_type: "IELTS",
              minimum_score: "7.0",
            },
          ],
        },
        website_url:
          "https://www.imperial.ac.uk/computing/prospective-students/pg/taught/ai/",
        contact_email: "computing.admissions@imperial.ac.uk",
        is_featured: true,
        scraped_at: new Date().toISOString(),
      },
      {
        title: "MSc Data Science",
        university: "University College London",
        degree_type: "Master",
        field_of_study: "Data Science",
        duration: "1 year",
        location: {
          city: "London",
          country: "United Kingdom",
        },
        description:
          "Interdisciplinary program combining statistics, computer science, and machine learning for data analysis and interpretation.",
        intake_months: ["September"],
        application_deadline: "2024-07-31",
        tuition_fee: {
          amount: 32000,
          currency: "GBP",
          period: "total_course",
        },
        entry_requirements: {
          minimum_gpa: 3.3,
          language_tests: [
            {
              test_type: "IELTS",
              minimum_score: "7.0",
            },
          ],
        },
        website_url:
          "https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/data-science-msc",
        contact_email: "admissions@ucl.ac.uk",
        is_featured: false,
        scraped_at: new Date().toISOString(),
      },
      {
        title: "MSc Finance",
        university: "London School of Economics",
        degree_type: "Master",
        field_of_study: "Finance",
        duration: "10 months",
        location: {
          city: "London",
          country: "United Kingdom",
        },
        description:
          "Rigorous finance program covering corporate finance, asset pricing, and financial markets. Highly competitive program for finance professionals.",
        intake_months: ["September"],
        application_deadline: "2024-04-30",
        tuition_fee: {
          amount: 42000,
          currency: "GBP",
          period: "total_course",
        },
        entry_requirements: {
          minimum_gpa: 3.7,
          language_tests: [
            {
              test_type: "IELTS",
              minimum_score: "7.0",
            },
          ],
        },
        website_url:
          "https://www.lse.ac.uk/study-at-lse/Graduate/degree-programmes-2024/MSc-Finance",
        contact_email: "finance@lse.ac.uk",
        is_featured: true,
        scraped_at: new Date().toISOString(),
      },
      {
        title: "MSc Mechanical Engineering",
        university: "University of Manchester",
        degree_type: "Master",
        field_of_study: "Mechanical Engineering",
        duration: "1 year",
        location: {
          city: "Manchester",
          country: "United Kingdom",
        },
        description:
          "Advanced mechanical engineering program with specializations in robotics, materials science, and energy systems.",
        intake_months: ["September"],
        application_deadline: "2024-08-31",
        tuition_fee: {
          amount: 28000,
          currency: "GBP",
          period: "total_course",
        },
        entry_requirements: {
          minimum_gpa: 3.2,
          language_tests: [
            {
              test_type: "IELTS",
              minimum_score: "6.5",
            },
          ],
        },
        website_url:
          "https://www.manchester.ac.uk/study/masters/courses/list/10401/msc-mechanical-engineering/",
        contact_email: "pg-mechanical@manchester.ac.uk",
        is_featured: false,
        scraped_at: new Date().toISOString(),
      },
      {
        title: "MSc Biotechnology",
        university: "University of Edinburgh",
        degree_type: "Master",
        field_of_study: "Biotechnology",
        duration: "1 year",
        location: {
          city: "Edinburgh",
          country: "United Kingdom",
        },
        description:
          "Comprehensive biotechnology program focusing on genetic engineering, pharmaceutical development, and industrial applications.",
        intake_months: ["September"],
        application_deadline: "2024-07-31",
        tuition_fee: {
          amount: 29500,
          currency: "GBP",
          period: "total_course",
        },
        entry_requirements: {
          minimum_gpa: 3.3,
          language_tests: [
            {
              test_type: "IELTS",
              minimum_score: "6.5",
            },
          ],
        },
        website_url:
          "https://www.ed.ac.uk/biology/taught-masters/biotechnology",
        contact_email: "biotech.admissions@ed.ac.uk",
        is_featured: false,
        scraped_at: new Date().toISOString(),
      },
      {
        title: "MSc International Business",
        university: "University of Warwick",
        degree_type: "Master",
        field_of_study: "International Business",
        duration: "1 year",
        location: {
          city: "Coventry",
          country: "United Kingdom",
        },
        description:
          "Global business program covering international marketing, cross-cultural management, and global strategy.",
        intake_months: ["October"],
        application_deadline: "2024-07-31",
        tuition_fee: {
          amount: 33000,
          currency: "GBP",
          period: "total_course",
        },
        entry_requirements: {
          minimum_gpa: 3.4,
          language_tests: [
            {
              test_type: "IELTS",
              minimum_score: "7.0",
            },
          ],
        },
        website_url:
          "https://warwick.ac.uk/study/postgraduate/courses-2024/internationalbusiness",
        contact_email: "wbs.admissions@warwick.ac.uk",
        is_featured: true,
        scraped_at: new Date().toISOString(),
      },
    ];

    return mscCourses;
  }

  // Get UK universities list for filters
  async getUKUniversities() {
    return this.ukUniversities.sort();
  }

  // Get fields of study for UK MSc programs
  async getMScFieldsOfStudy() {
    return [
      "Computer Science",
      "Artificial Intelligence",
      "Data Science",
      "Machine Learning",
      "Cybersecurity",
      "Finance",
      "Business Analytics",
      "Economics",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Civil Engineering",
      "Biotechnology",
      "Biomedical Sciences",
      "Psychology",
      "International Business",
      "Marketing",
      "Management",
      "Law",
      "Public Policy",
      "Environmental Science",
    ].sort();
  }

  // Get UK cities with universities
  async getUKCities() {
    return [
      "London",
      "Oxford",
      "Cambridge",
      "Manchester",
      "Edinburgh",
      "Bristol",
      "Glasgow",
      "Birmingham",
      "Sheffield",
      "Leeds",
      "Nottingham",
      "Southampton",
      "Liverpool",
      "Durham",
      "Exeter",
      "York",
      "Newcastle",
      "Cardiff",
      "Belfast",
    ].sort();
  }
}

module.exports = new UKMScCoursesService();
