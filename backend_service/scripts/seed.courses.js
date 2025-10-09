// backend_service/scripts/seed.courses.js
const mongoose = require("mongoose");
const Course = require("../models/course.model");
require("dotenv").config({ path: "./.env" });

// Sample course data
const sampleCourses = [
  {
    title: "Computer Science Bachelor",
    university: "Stanford University",
    duration: "4 years",
    location: {
      address: "450 Serra Mall",
      city: "Stanford",
      state: "California",
      country: "USA",
      postal_code: "94305",
      coordinates: {
        latitude: 37.4275,
        longitude: -122.1697,
      },
    },
    description:
      "Comprehensive computer science program covering algorithms, data structures, software engineering, and artificial intelligence. Students gain hands-on experience through projects and research opportunities.",
    degree_type: "Bachelor",
    field_of_study: "Computer Science",
    intake_months: ["September"],
    application_deadline: new Date("2024-12-15"),
    language: "English",
    tuition_fee: {
      amount: 55000,
      currency: "USD",
      period: "per_year",
    },
    entry_requirements: {
      minimum_gpa: 3.8,
      language_tests: [
        {
          test_type: "TOEFL",
          minimum_score: "100",
        },
        {
          test_type: "IELTS",
          minimum_score: "7.0",
        },
      ],
      prerequisites: [
        "Advanced Mathematics",
        "Computer Programming",
        "Physics",
      ],
    },
    website_url: "https://www.stanford.edu/cs",
    contact_email: "cs-admissions@stanford.edu",
    is_featured: true,
    is_active: true,
  },
  {
    title: "Business Administration MBA",
    university: "Harvard Business School",
    duration: "2 years",
    location: {
      address: "Soldiers Field Road",
      city: "Boston",
      state: "Massachusetts",
      country: "USA",
      postal_code: "02163",
      coordinates: {
        latitude: 42.3668,
        longitude: -71.1216,
      },
    },
    description:
      "World-renowned MBA program focusing on leadership, strategy, and business innovation. Case method approach with global business perspectives.",
    degree_type: "Master",
    field_of_study: "Business Administration",
    intake_months: ["September"],
    application_deadline: new Date("2024-09-01"),
    language: "English",
    tuition_fee: {
      amount: 73000,
      currency: "USD",
      period: "per_year",
    },
    entry_requirements: {
      minimum_gpa: 3.7,
      language_tests: [
        {
          test_type: "TOEFL",
          minimum_score: "109",
        },
        {
          test_type: "IELTS",
          minimum_score: "7.5",
        },
      ],
      prerequisites: [
        "Bachelor's Degree",
        "Work Experience (2+ years)",
        "GMAT/GRE Scores",
      ],
    },
    website_url: "https://www.hbs.edu/mba",
    contact_email: "mbaadmissions@hbs.edu",
    is_featured: true,
    is_active: true,
  },
  {
    title: "Mechanical Engineering Bachelor",
    university: "Massachusetts Institute of Technology",
    duration: "4 years",
    location: {
      address: "77 Massachusetts Avenue",
      city: "Cambridge",
      state: "Massachusetts",
      country: "USA",
      postal_code: "02139",
      coordinates: {
        latitude: 42.3601,
        longitude: -71.0942,
      },
    },
    description:
      "Rigorous engineering program with focus on mechanics, thermodynamics, robotics, and design. Hands-on laboratory experience and research opportunities.",
    degree_type: "Bachelor",
    field_of_study: "Mechanical Engineering",
    intake_months: ["September"],
    application_deadline: new Date("2024-01-01"),
    language: "English",
    tuition_fee: {
      amount: 55878,
      currency: "USD",
      period: "per_year",
    },
    entry_requirements: {
      minimum_gpa: 3.9,
      language_tests: [
        {
          test_type: "TOEFL",
          minimum_score: "100",
        },
      ],
      prerequisites: [
        "Advanced Mathematics",
        "Physics",
        "Chemistry",
        "Calculus",
      ],
    },
    website_url: "https://meche.mit.edu",
    contact_email: "meche-admissions@mit.edu",
    is_featured: true,
    is_active: true,
  },
  {
    title: "International Relations Bachelor",
    university: "University of Oxford",
    duration: "3 years",
    location: {
      address: "Wellington Square",
      city: "Oxford",
      country: "United Kingdom",
      postal_code: "OX1 2JD",
      coordinates: {
        latitude: 51.7548,
        longitude: -1.2544,
      },
    },
    description:
      "Study of international affairs, diplomacy, global politics, and international law. Tutorial-based learning system with world-class faculty.",
    degree_type: "Bachelor",
    field_of_study: "Political Science",
    intake_months: ["October"],
    application_deadline: new Date("2024-10-15"),
    language: "English",
    tuition_fee: {
      amount: 9250,
      currency: "GBP",
      period: "per_year",
    },
    entry_requirements: {
      minimum_gpa: 3.7,
      language_tests: [
        {
          test_type: "IELTS",
          minimum_score: "7.5",
        },
      ],
      prerequisites: ["History", "Political Science", "Essay Writing Sample"],
    },
    website_url: "https://www.ox.ac.uk/politics",
    contact_email: "politics-admissions@ox.ac.uk",
    is_featured: false,
    is_active: true,
  },
  {
    title: "Data Science Master",
    university: "University of Toronto",
    duration: "1.5 years",
    location: {
      address: "27 King's College Circle",
      city: "Toronto",
      state: "Ontario",
      country: "Canada",
      postal_code: "M5S 1A1",
      coordinates: {
        latitude: 43.6629,
        longitude: -79.3957,
      },
    },
    description:
      "Advanced program in data analysis, machine learning, statistical modeling, and big data technologies. Industry partnerships and capstone project.",
    degree_type: "Master",
    field_of_study: "Data Science",
    intake_months: ["January", "September"],
    application_deadline: new Date("2024-03-31"),
    language: "English",
    tuition_fee: {
      amount: 45000,
      currency: "CAD",
      period: "total_course",
    },
    entry_requirements: {
      minimum_gpa: 3.3,
      language_tests: [
        {
          test_type: "TOEFL",
          minimum_score: "93",
        },
        {
          test_type: "IELTS",
          minimum_score: "7.0",
        },
      ],
      prerequisites: [
        "Statistics",
        "Linear Algebra",
        "Programming (Python/R)",
        "Calculus",
      ],
    },
    website_url: "https://www.utoronto.ca/datascience",
    contact_email: "datascience@utoronto.ca",
    is_featured: true,
    is_active: true,
  },
  {
    title: "Digital Marketing Certificate",
    university: "Google Career Certificates",
    duration: "6 months",
    location: {
      address: "Online Program",
      city: "Online",
      country: "Global",
    },
    description:
      "Comprehensive online certificate program covering SEO, social media marketing, analytics, email marketing, and digital advertising strategies.",
    degree_type: "Certificate",
    field_of_study: "Marketing",
    intake_months: ["January", "April", "July", "October"],
    application_deadline: new Date("2024-12-31"),
    language: "English",
    tuition_fee: {
      amount: 3000,
      currency: "USD",
      period: "total_course",
    },
    entry_requirements: {
      language_tests: [
        {
          test_type: "IELTS",
          minimum_score: "6.0",
        },
      ],
      prerequisites: [],
    },
    website_url: "https://grow.google/certificates/digital-marketing/",
    contact_email: "certificates-support@google.com",
    is_featured: false,
    is_active: true,
  },
  {
    title: "PhD in Artificial Intelligence",
    university: "Carnegie Mellon University",
    duration: "5 years",
    location: {
      address: "5000 Forbes Avenue",
      city: "Pittsburgh",
      state: "Pennsylvania",
      country: "USA",
      postal_code: "15213",
      coordinates: {
        latitude: 40.4432,
        longitude: -79.9428,
      },
    },
    description:
      "Research-intensive doctoral program focusing on advanced AI, machine learning, natural language processing, and robotics. Cutting-edge research with industry collaborations.",
    degree_type: "PhD",
    field_of_study: "Computer Science",
    intake_months: ["August"],
    application_deadline: new Date("2024-12-01"),
    language: "English",
    tuition_fee: {
      amount: 52000,
      currency: "USD",
      period: "per_year",
    },
    entry_requirements: {
      minimum_gpa: 3.8,
      language_tests: [
        {
          test_type: "TOEFL",
          minimum_score: "102",
        },
      ],
      prerequisites: [
        "Master's Degree in CS/AI",
        "Research Publications",
        "Strong Mathematics Background",
      ],
    },
    website_url: "https://www.cs.cmu.edu/ai-phd",
    contact_email: "ai-phd-admissions@cmu.edu",
    is_featured: true,
    is_active: true,
  },
  {
    title: "Diploma in Hospitality Management",
    university: "Les Roches Global Hospitality Education",
    duration: "2 years",
    location: {
      address: "3975 Bluche",
      city: "Crans-Montana",
      country: "Switzerland",
      postal_code: "3975",
      coordinates: {
        latitude: 46.3081,
        longitude: 7.4736,
      },
    },
    description:
      "Comprehensive hospitality management program with international internships, focusing on hotel operations, tourism, and service excellence.",
    degree_type: "Diploma",
    field_of_study: "Hospitality Management",
    intake_months: ["January", "July"],
    application_deadline: new Date("2024-05-30"),
    language: "English",
    tuition_fee: {
      amount: 35000,
      currency: "CHF",
      period: "per_year",
    },
    entry_requirements: {
      minimum_gpa: 3.0,
      language_tests: [
        {
          test_type: "IELTS",
          minimum_score: "5.5",
        },
      ],
      prerequisites: ["High School Diploma", "Personal Interview"],
    },
    website_url: "https://www.lesroches.edu",
    contact_email: "admissions@lesroches.edu",
    is_featured: false,
    is_active: true,
  },
];

const seedCourses = async () => {
  try {
    console.log("Attempting to connect to:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing courses
    await Course.deleteMany({});
    console.log("Cleared existing courses");

    // Create and save each course individually to trigger pre-save middleware
    console.log("Creating courses with slugs...");
    const createdCourses = [];

    for (const courseData of sampleCourses) {
      const course = new Course(courseData);
      await course.save();
      createdCourses.push(course);
      console.log(`Created: ${course.title} -> Slug: ${course.slug}`);
    }

    console.log(
      `\nSuccessfully created ${createdCourses.length} courses with slugs`
    );

    // Display summary
    console.log("\nCourse Summary:");
    createdCourses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title}`);
      console.log(`   University: ${course.university}`);
      console.log(`   Slug: ${course.slug}`);
      console.log(`   Featured: ${course.is_featured}`);
      console.log(`   Active: ${course.is_active}`);
      console.log("---");
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding courses:", error);
    process.exit(1);
  }
};

seedCourses();
