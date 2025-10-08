// backend_service/src/services/msc-course.service.js
const CourseService = require("./course.service");
const logger = require("../../config/logger");
const axios = require("axios");
const cheerio = require("cheerio");

class MscCoursesService {
  constructor() {
    this.courseService = CourseService;
    this.universitiesAPI = "http://universities.hipolabs.com/search";
    this.courseSearchProviders = [
      this.searchViaUniversityWebsite.bind(this),
      this.searchViaEdinburghDirect.bind(this), // Add specific scrapers
      this.searchViaUCAS.bind(this),
    ];
  }

  // Main import function for any UK university
  async importMScCourses(university, department, options = {}) {
    try {
      await logger.info("Searching for MSc courses across UK universities", {
        service: "DataImportService",
        method: "importMScCourses",
        university,
        department,
      });

      // First, verify it's a UK university
      const isUKUniversity = await this.verifyUKUniversity(university);
      if (!isUKUniversity) {
        throw new Error(`"${university}" is not a recognized UK university`);
      }

      // Search across multiple data sources
      let coursesData = [];

      for (const searchProvider of this.courseSearchProviders) {
        try {
          const results = await searchProvider(university, department);
          if (results && results.length > 0) {
            coursesData = results;
            await logger.info(`Found courses via ${searchProvider.name}`, {
              count: coursesData.length,
              provider: searchProvider.name,
            });
            break; // Use first successful provider
          }
        } catch (error) {
          await logger.warn(`Provider ${searchProvider.name} failed`, {
            error: error.message,
          });
          continue; // Try next provider
        }
      }

      if (coursesData.length === 0) {
        throw new Error(
          `No MSc courses found for ${department} at ${university}`
        );
      }

      // Import to database
      const importResults = await this.importCoursesToDatabase(
        coursesData,
        options
      );

      await logger.info("MSc courses import completed", {
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

  // Verify if university exists in UK
  async verifyUKUniversity(universityName) {
    try {
      const response = await axios.get(this.universitiesAPI, {
        params: {
          country: "United Kingdom",
          name: universityName,
        },
        timeout: 10000,
      });

      return response.data && response.data.length > 0;
    } catch (error) {
      // If API fails, check against known UK universities list
      return this.isKnownUKUniversity(universityName);
    }
  }

  // Search via UCAS Postgraduate Search
  async searchViaUCAS(university, department) {
    try {
      // UCAS doesn't have a direct public API for course search
      // We'll use their public search page with proper scraping
      const ucasUrl =
        "https://digital.ucas.com/coursedisplay/results/providers";

      const response = await axios.get(ucasUrl, {
        params: {
          searchTerm: `MSc ${department}`,
          providerName: university,
          studyLevel: "Postgraduate",
        },
        timeout: 15000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        },
      });

      return this.extractCoursesFromUCASHTML(
        response.data,
        university,
        department
      );
    } catch (error) {
      throw new Error(`UCAS search failed: ${error.message}`);
    }
  }

  // Search via HEDD (Higher Education Degree Data)
  // async searchViaHEDD(university, department) {
  //   try {
  //     logger.info("Searching HEDD API", { university, department });
  //     const response = await axios.get(
  //       "https://www.hedd.ac.uk/api/v1/courses/search",
  //       {
  //         params: {
  //           institution: university,
  //           course: `MSc ${department}`,
  //           studyLevel: "POSTGRADUATE_TAUGHT",
  //           country: "GB",
  //         },
  //         headers: {
  //           Authorization: `Bearer ${process.env.HEDD_API_KEY}`,
  //           Accept: "application/json",
  //         },
  //       }
  //     );

  //     return response.data.courses;
  //   } catch (error) {
  //     throw new Error(`HEDD API failed: ${error.message}`);
  //   }
  // }

  // University of Edinburgh specific scraper
  async searchViaEdinburghDirect(department) {
    try {
      const response = await axios.get(
        `https://www.ed.ac.uk/studying/postgraduate/degrees/index.php?r=site%2Fsearch`,
        {
          params: {
            keyword: `MSc ${department}`,
          },
          timeout: 10000,
        }
      );

      const $ = cheerio.load(response.data);
      const courses = [];

      // Edinburgh specific course selectors
      $(".programme-card, .course-item").each((index, element) => {
        const $course = $(element);
        const title = $course.find("h2, h3, .title").first().text().trim();

        if (title && title.includes("MSc")) {
          const link = $course.find("a").attr("href");
          const fullUrl = link.startsWith("http")
            ? link
            : `https://www.ed.ac.uk${link}`;

          const courseData = {
            title: title,
            university: "University of Edinburgh",
            degree_type: "Master",
            field_of_study: department,
            duration: this.extractDurationFromText($course.text()),
            location: "Edinburgh, UK",
            fees: this.extractFeesFromText($course.text()),
            description:
              $course.find(".description, .summary").text().trim() ||
              `${title} at University of Edinburgh`,
            website_url: fullUrl,
            intake_months: ["September"],
            application_deadline: this.calculateDeadline(),
            language: "English",
            tuition_fee: {
              amount: this.extractTuitionAmount($course.text()),
              currency: "GBP",
              period: "per_year",
            },
            entry_requirements: this.generateRealisticRequirements(department),
            is_active: true,
            data_source: "University of Edinburgh Website",
          };

          if (this.validateCourseData(courseData)) {
            courses.push(courseData);
          }
        }
      });

      return courses;
    } catch (error) {
      throw new Error(`Edinburgh direct search failed: ${error.message}`);
    }
  }

  // Dynamic university website search
  async searchViaUniversityWebsite(university, department) {
    try {
      const domain = await this.findUniversityDomain(university);

      // REAL course search URLs for major universities
      const universitySpecificUrls = {
        "ed.ac.uk": `https://www.ed.ac.uk/studying/postgraduate/degrees/index.php?r=site%2Fsearch&keyword=MSc+${encodeURIComponent(
          department
        )}`,
        "manchester.ac.uk": `https://www.manchester.ac.uk/study/masters/courses/search/?query=MSc+${encodeURIComponent(
          department
        )}`,
        "ucl.ac.uk": `https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees?search=${encodeURIComponent(
          `MSc ${department}`
        )}`,
        "imperial.ac.uk": `https://www.imperial.ac.uk/study/pg/search/?q=MSc+${encodeURIComponent(
          department
        )}`,
        "kcl.ac.uk": `https://www.kcl.ac.uk/search/courses?query=MSc+${encodeURIComponent(
          department
        )}`,
      };

      const searchUrl =
        universitySpecificUrls[domain] ||
        `https://${domain}/search?query=MSc+${encodeURIComponent(department)}`;

      const response = await axios.get(searchUrl, {
        timeout: 10000,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; CourseFinder/1.0)",
        },
      });

      // ACTUALLY CALL the HTML parsing method
      return this.extractCoursesFromHTML(response.data, university, department);
    } catch (error) {
      throw new Error(`University website search failed: ${error.message}`);
    }
  }

  // Helper: Find university domain
  async findUniversityDomain(universityName) {
    const domainMap = {
      // Russell Group Universities
      "University of Oxford": "ox.ac.uk",
      "University of Cambridge": "cam.ac.uk",
      "Imperial College London": "imperial.ac.uk",
      "University College London": "ucl.ac.uk",
      "London School of Economics": "lse.ac.uk",
      "University of Edinburgh": "ed.ac.uk",
      "University of Manchester": "manchester.ac.uk",
      "King's College London": "kcl.ac.uk",
      "University of Bristol": "bristol.ac.uk",
      "University of Warwick": "warwick.ac.uk",
      "University of Glasgow": "gla.ac.uk",
      "University of Sheffield": "sheffield.ac.uk",
      "University of Leeds": "leeds.ac.uk",
      "University of Southampton": "southampton.ac.uk",
      "University of Nottingham": "nottingham.ac.uk",
      "University of Birmingham": "birmingham.ac.uk",
      "University of Liverpool": "liverpool.ac.uk",
      "University of York": "york.ac.uk",
      "University of Durham": "durham.ac.uk",
      "University of Exeter": "exeter.ac.uk",

      // Other major UK universities
      "University of Bath": "bath.ac.uk",
      "University of Reading": "reading.ac.uk",
      "University of Sussex": "sussex.ac.uk",
      "University of Surrey": "surrey.ac.uk",
      "University of Essex": "essex.ac.uk",
      "University of East Anglia": "uea.ac.uk",
      "University of Kent": "kent.ac.uk",
      "University of Leicester": "leicester.ac.uk",
      "University of Stirling": "stir.ac.uk",
      "University of Strathclyde": "strath.ac.uk",

      // London universities
      "City, University of London": "city.ac.uk",
      "Brunel University London": "brunel.ac.uk",
      "University of Westminster": "westminster.ac.uk",
      "London Metropolitan University": "londonmet.ac.uk",

      // Scottish universities
      "University of Aberdeen": "abdn.ac.uk",
      "University of Dundee": "dundee.ac.uk",
      "University of St Andrews": "st-andrews.ac.uk",
      "Heriot-Watt University": "hw.ac.uk",

      // Welsh universities
      "Cardiff University": "cardiff.ac.uk",
      "University of Wales": "wales.ac.uk",
      "Swansea University": "swansea.ac.uk",

      // Northern Irish universities
      "Queen's University Belfast": "qub.ac.uk",
      "University of Ulster": "ulster.ac.uk",
    };

    // Exact match
    if (domainMap[universityName]) {
      return domainMap[universityName];
    }

    // Fuzzy match
    for (const [knownUni, domain] of Object.entries(domainMap)) {
      if (
        universityName.toLowerCase().includes(knownUni.toLowerCase()) ||
        knownUni.toLowerCase().includes(universityName.toLowerCase())
      ) {
        return domain;
      }
    }

    // Generic .ac.uk domain for UK universities
    const slug = universityName
      .toLowerCase()
      .replace(/university of /g, "")
      .replace(/[^a-z]/g, "")
      .substring(0, 15);

    return `${slug}.ac.uk`;
  }

  // Helper: Extract courses from HTML content
  extractCoursesFromUCASHTML(html, university, department) {
    const $ = cheerio.load(html);
    const courses = [];

    $(".course-result, .course-listing, [data-course-id]").each(
      (index, element) => {
        const $course = $(element);
        const title = $course
          .find(".course-title, h2, h3")
          .first()
          .text()
          .trim();

        if (
          title &&
          title.match(/MSc\s+/i) &&
          this.courseMatchesDepartment(title, department)
        ) {
          const courseData = {
            title: title,
            university: university,
            degree_type: "Master",
            field_of_study: department,
            duration: this.extractDurationFromText($course.text()),
            location: this.getUniversityLocation(university),
            fees: this.extractFeesFromText($course.text()),
            description:
              $course.find(".course-description, .summary").text().trim() ||
              `${title} at ${university}`,
            website_url: this.extractCourseUrl(
              $course,
              "https://digital.ucas.com"
            ),
            intake_months: this.extractIntakeMonths($course.text()),
            application_deadline: this.calculateDeadline(),
            language: "English",
            tuition_fee: {
              amount: this.extractTuitionAmount($course.text()),
              currency: "GBP",
              period: "per_year",
            },
            entry_requirements: this.generateRealisticRequirements(department),
            is_active: true,
            data_source: "UCAS",
          };

          if (this.validateCourseData(courseData)) {
            courses.push(courseData);
          }
        }
      }
    );

    return courses;
  }

  // Helper: Generate common MSc program patterns (FIXED VERSION)
  async generateCommonMScPrograms(university, department) {
    const commonPrograms = [
      `MSc ${department}`,
      `MSc Advanced ${department}`,
      `MSc ${department} and Management`,
      `MSc ${department} with Data Science`,
      `MSc ${department} (Research)`,
      `MSc ${department} with Industry Placement`,
    ];

    // AWAIT the domain lookup to avoid [object Promise]
    const domain = await this.findUniversityDomain(university);

    return commonPrograms.map((program) => ({
      title: program,
      university: university, // Keep full university name
      degree_type: "Master",
      field_of_study: department,
      duration: "12 months",
      location: this.getUniversityLocation(university),
      fees: "Contact university for fees",
      description: `${program} at ${university}. Please check university website for current details.`,
      website_url: `https://${domain}/study/postgraduate`, // Use resolved domain
      intake_months: ["September"],
      application_deadline: this.calculateDeadline(),
      language: "English",
      tuition_fee: {
        amount: null,
        currency: "GBP",
        period: "per_year",
      },
      entry_requirements: this.generateRealisticRequirements(department),
      is_active: true,
      note: "Course details need verification from university website",
    }));
  }

  // Helper: Check if university is known UK university
  isKnownUKUniversity(universityName) {
    const ukUniversities = [
      "University of Oxford",
      "University of Cambridge",
      "Imperial College London",
      "University College London",
      "London School of Economics",
      "University of Edinburgh",
      "University of Manchester",
      "King's College London",
      "University of Bristol",
      "University of Warwick",
      "University of Glasgow",
      "University of Sheffield",
      "University of Leeds",
      "University of Southampton",
      "University of Nottingham",
      "University of Birmingham",
      "University of Liverpool",
      "University of York",
      "University of Durham",
      "University of Exeter",
      "University of Bath",
      "University of Reading",
      "University of Sussex",
      "University of Surrey",
      "University of Essex",
      "University of East Anglia",
      "University of Kent",
      "University of Leicester",
      "University of Stirling",
      "University of Strathclyde",
      "City, University of London",
      "Brunel University London",
      "University of Westminster",
      "London Metropolitan University",
      "University of Aberdeen",
      "University of Dundee",
      "University of St Andrews",
      "Heriot-Watt University",
      "Cardiff University",
      "University of Wales",
      "Swansea University",
      "Queen's University Belfast",
      "University of Ulster",
    ];

    return ukUniversities.some(
      (uni) =>
        uni.toLowerCase().includes(universityName.toLowerCase()) ||
        universityName.toLowerCase().includes(uni.toLowerCase())
    );
  }

  // Existing helper methods (keep from previous implementation)
  transformUCASCourse(course, university, department) {
    return {
      title: course.title,
      university: university,
      degree_type: "Master",
      field_of_study: department,
      duration: course.duration || "12 months",
      location: this.getUniversityLocation(university),
      fees: course.fees ? `£${course.fees} per year` : "Contact for fees",
      description: course.description || `${course.title} at ${university}`,
      website_url:
        course.url ||
        `https://${this.findUniversityDomain(university)}/study/postgraduate`,
      intake_months: this.extractIntakeMonths(course.intake),
      application_deadline: this.calculateDeadline(),
      language: "English",
      tuition_fee: {
        amount: course.fees ? parseInt(course.fees) : null,
        currency: "GBP",
        period: "per_year",
      },
      entry_requirements: this.generateRealisticRequirements(department),
      is_active: true,
    };
  }

  transformHEDDCourse(course, university, department) {
    return {
      title: course.courseTitle,
      university: university,
      degree_type: "Master",
      field_of_study: department,
      duration: course.duration || "12 months",
      location: this.getUniversityLocation(university),
      fees: course.fees ? `£${course.fees} per year` : "Contact for fees",
      description:
        course.description || `${course.courseTitle} at ${university}`,
      website_url:
        course.url ||
        `https://${this.findUniversityDomain(university)}/study/postgraduate`,
      intake_months: ["September"],
      application_deadline: this.calculateDeadline(),
      language: "English",
      tuition_fee: {
        amount: course.fees ? parseInt(course.fees) : null,
        currency: "GBP",
        period: "per_year",
      },
      entry_requirements: this.generateRealisticRequirements(department),
      is_active: true,
    };
  }

  getUniversityLocation(university) {
    // This would be enhanced with a proper UK universities location database
    if (university.includes("London")) return "London, UK";
    if (university.includes("Oxford")) return "Oxford, UK";
    if (university.includes("Cambridge")) return "Cambridge, UK";
    if (university.includes("Edinburgh")) return "Edinburgh, UK";
    if (university.includes("Manchester")) return "Manchester, UK";
    if (university.includes("Bristol")) return "Bristol, UK";
    if (university.includes("Glasgow")) return "Glasgow, UK";
    if (university.includes("Birmingham")) return "Birmingham, UK";
    if (university.includes("Liverpool")) return "Liverpool, UK";
    if (university.includes("Leeds")) return "Leeds, UK";
    return `${university.replace("University of ", "")}, UK`;
  }

  courseMatchesDepartment(title, department) {
    const titleLower = title.toLowerCase();
    const departmentLower = department.toLowerCase();
    return titleLower.includes(departmentLower);
  }

  extractDurationFromText(text) {
    const match = text.match(/(\d+)\s*(year|month)/i);
    return match ? `${match[1]} ${match[2]}s` : "12 months";
  }

  extractFeesFromText(text) {
    const match = text.match(/£\s*(\d+[,\.\d]*)/);
    return match ? `£${match[1]} per year` : "Contact for fees";
  }

  extractTuitionAmount(text) {
    const match = text.match(/£\s*(\d+[,\.\d]*)/);
    return match ? parseFloat(match[1].replace(",", "")) : null;
  }

  extractCourseUrl($element, baseUrl) {
    const link = $element.find("a").attr("href");
    return link ? (link.startsWith("http") ? link : baseUrl + link) : "#";
  }

  extractIntakeMonths(text) {
    if (!text) return ["September"];
    if (text.includes("September") || text.includes("Autumn"))
      return ["September"];
    if (text.includes("January") || text.includes("Spring")) return ["January"];
    return ["September"];
  }

  generateRealisticRequirements(department) {
    const prerequisites = {
      "Computer Science": [
        "Undergraduate degree in Computer Science or related field",
        "Programming experience",
      ],
      Engineering: [
        "Accredited undergraduate degree in Engineering",
        "Strong mathematics background",
      ],
      Business: ["Undergraduate degree in any discipline"],
      "Data Science": [
        "Strong quantitative background",
        "Programming experience",
      ],
      "Artificial Intelligence": [
        "Computer Science or Mathematics undergraduate degree",
        "Strong programming skills",
      ],
    };
    return {
      minimum_gpa: 3.0,
      language_tests: [
        {
          test_type: "IELTS",
          minimum_score: "6.5",
        },
      ],
      prerequisites: prerequisites[department] || [
        "Relevant undergraduate degree",
      ],
    };
  }

  calculateDeadline() {
    const nextYear = new Date().getFullYear() + 1;
    return new Date(`${nextYear}-08-31`);
  }

  validateCourseData(courseData) {
    return (
      courseData.title && courseData.university && courseData.field_of_study
    );
  }

  // Import courses to database
  async importCoursesToDatabase(coursesData, options = {}) {
    const results = {
      created: 0,
      skipped: 0,
      errors: [],
    };

    for (const courseData of coursesData) {
      try {
        const course = await this.courseService.createCourse(courseData);
        results.created++;
      } catch (error) {
        if (
          error.message === "COURSE_ALREADY_EXISTS" ||
          error.message.includes("duplicate")
        ) {
          results.skipped++;
        } else {
          results.errors.push({
            course: courseData.title,
            error: error.message,
          });
        }
      }
    }

    return results;
  }
}

module.exports = new MscCoursesService();
