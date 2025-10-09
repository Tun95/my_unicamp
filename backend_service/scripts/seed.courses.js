// backend_service/scripts/seed.courses.js
const mongoose = require("mongoose");
const Course = require("../models/course.model");
require("dotenv").config({ path: "./.env" });

// Sample course data
const sampleCourses = [
  {
    title: "Computer Science Bachelor",
    university: "University of Cambridge",
    duration: "3 years",
    location: {
      address: "The Old Schools, Trinity Lane",
      city: "Cambridge",
      country: "United Kingdom",
      postal_code: "CB2 1TN",
      coordinates: {
        latitude: 52.2053,
        longitude: 0.1178,
      },
    },
    description:
      "Comprehensive computer science program covering algorithms, data structures, software engineering, and artificial intelligence. Students gain hands-on experience through projects and research opportunities.",
    degree_type: "Bachelor",
    field_of_study: "Computer Science",
    intake_months: ["October"],
    application_deadline: new Date("2024-10-15"),
    language: "English",
    tuition_fee: {
      amount: 9250,
      currency: "GBP",
      period: "per_year",
    },
    entry_requirements: {
      minimum_gpa: 3.8,
      language_tests: [
        {
          test_type: "IELTS",
          minimum_score: "7.5",
        },
      ],
      prerequisites: [
        "Advanced Mathematics",
        "Computer Programming",
        "Physics",
      ],
    },
    website_url: "https://www.cam.ac.uk/cs",
    contact_email: "cs-admissions@cam.ac.uk",
    is_featured: true,
    is_active: true,
  },
  {
    title: "Business Administration MBA",
    university: "London Business School",
    duration: "15-21 months",
    location: {
      address: "Regent's Park",
      city: "London",
      country: "United Kingdom",
      postal_code: "NW1 4SA",
      coordinates: {
        latitude: 51.5266,
        longitude: -0.1577,
      },
    },
    description:
      "World-renowned MBA program focusing on leadership, strategy, and business innovation. Case method approach with global business perspectives.",
    degree_type: "Master",
    field_of_study: "Business Administration",
    intake_months: ["August"],
    application_deadline: new Date("2024-09-01"),
    language: "English",
    tuition_fee: {
      amount: 115000,
      currency: "GBP",
      period: "total_course",
    },
    entry_requirements: {
      minimum_gpa: 3.5,
      language_tests: [
        {
          test_type: "IELTS",
          minimum_score: "7.5",
        },
      ],
      prerequisites: [
        "Bachelor's Degree",
        "Work Experience (3+ years)",
        "GMAT/GRE Scores",
      ],
    },
    website_url: "https://www.london.edu/mba",
    contact_email: "mbaadmissions@london.edu",
    is_featured: true,
    is_active: true,
  },
  {
    title: "Mechanical Engineering Bachelor",
    university: "Imperial College London",
    duration: "4 years",
    location: {
      address: "Exhibition Road",
      city: "London",
      country: "United Kingdom",
      postal_code: "SW7 2AZ",
      coordinates: {
        latitude: 51.4988,
        longitude: -0.1749,
      },
    },
    description:
      "Rigorous engineering program with focus on mechanics, thermodynamics, robotics, and design. Hands-on laboratory experience and research opportunities.",
    degree_type: "Bachelor",
    field_of_study: "Mechanical Engineering",
    intake_months: ["October"],
    application_deadline: new Date("2024-01-15"),
    language: "English",
    tuition_fee: {
      amount: 35100,
      currency: "GBP",
      period: "per_year",
    },
    entry_requirements: {
      minimum_gpa: 3.7,
      language_tests: [
        {
          test_type: "IELTS",
          minimum_score: "7.0",
        },
      ],
      prerequisites: [
        "Advanced Mathematics",
        "Physics",
        "Chemistry",
        "Further Mathematics",
      ],
    },
    website_url: "https://www.imperial.ac.uk/mechanical-engineering",
    contact_email: "mech-eng-admissions@imperial.ac.uk",
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
    is_featured: true,
    is_active: true,
  },
  {
    title: "Data Science Master",
    university: "University of Edinburgh",
    duration: "1 year",
    location: {
      address: "Old College, South Bridge",
      city: "Edinburgh",
      country: "United Kingdom",
      postal_code: "EH8 9YL",
      coordinates: {
        latitude: 55.947,
        longitude: -3.187,
      },
    },
    description:
      "Advanced program in data analysis, machine learning, statistical modeling, and big data technologies. Industry partnerships and capstone project.",
    degree_type: "Master",
    field_of_study: "Data Science",
    intake_months: ["September"],
    application_deadline: new Date("2024-03-31"),
    language: "English",
    tuition_fee: {
      amount: 30400,
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
      prerequisites: [
        "Statistics",
        "Linear Algebra",
        "Programming (Python/R)",
        "Calculus",
      ],
    },
    website_url: "https://www.ed.ac.uk/data-science",
    contact_email: "datascience@ed.ac.uk",
    is_featured: true,
    is_active: true,
  },
  {
    title: "Medicine Bachelor",
    university: "University College London",
    duration: "6 years",
    location: {
      address: "Gower Street",
      city: "London",
      country: "United Kingdom",
      postal_code: "WC1E 6BT",
      coordinates: {
        latitude: 51.5246,
        longitude: -0.1341,
      },
    },
    description:
      "Comprehensive medical program combining theoretical knowledge with clinical practice. Includes foundation years and extensive hospital placements.",
    degree_type: "Bachelor",
    field_of_study: "Medicine",
    intake_months: ["September"],
    application_deadline: new Date("2024-10-15"),
    language: "English",
    tuition_fee: {
      amount: 9250,
      currency: "GBP",
      period: "per_year",
    },
    entry_requirements: {
      minimum_gpa: 3.8,
      language_tests: [
        {
          test_type: "IELTS",
          minimum_score: "7.5",
        },
      ],
      prerequisites: ["Biology", "Chemistry", "Physics", "UKCAT/BMAT Exam"],
    },
    website_url: "https://www.ucl.ac.uk/medicine",
    contact_email: "medicine-admissions@ucl.ac.uk",
    is_featured: false,
    is_active: true,
  },
  {
    title: "PhD in Artificial Intelligence",
    university: "University of Manchester",
    duration: "3-4 years",
    location: {
      address: "Oxford Road",
      city: "Manchester",
      country: "United Kingdom",
      postal_code: "M13 9PL",
      coordinates: {
        latitude: 53.4668,
        longitude: -2.2339,
      },
    },
    description:
      "Research-intensive doctoral program focusing on advanced AI, machine learning, natural language processing, and robotics. Cutting-edge research with industry collaborations.",
    degree_type: "PhD",
    field_of_study: "Computer Science",
    intake_months: ["January", "September"],
    application_deadline: new Date("2024-12-01"),
    language: "English",
    tuition_fee: {
      amount: 25000,
      currency: "GBP",
      period: "per_year",
    },
    entry_requirements: {
      minimum_gpa: 3.5,
      language_tests: [
        {
          test_type: "IELTS",
          minimum_score: "7.0",
        },
      ],
      prerequisites: [
        "Master's Degree in CS/AI",
        "Research Experience",
        "Strong Mathematics Background",
      ],
    },
    website_url: "https://www.manchester.ac.uk/ai-phd",
    contact_email: "ai-phd-admissions@manchester.ac.uk",
    is_featured: true,
    is_active: true,
  },
  {
    title: "Law Bachelor",
    university: "London School of Economics",
    duration: "3 years",
    location: {
      address: "Houghton Street",
      city: "London",
      country: "United Kingdom",
      postal_code: "WC2A 2AE",
      coordinates: {
        latitude: 51.5136,
        longitude: -0.1165,
      },
    },
    description:
      "Comprehensive law program covering contract law, criminal law, constitutional law, and international law. Focus on critical thinking and legal analysis.",
    degree_type: "Bachelor",
    field_of_study: "Law",
    intake_months: ["September"],
    application_deadline: new Date("2024-01-15"),
    language: "English",
    tuition_fee: {
      amount: 9250,
      currency: "GBP",
      period: "per_year",
    },
    entry_requirements: {
      minimum_gpa: 3.6,
      language_tests: [
        {
          test_type: "IELTS",
          minimum_score: "7.5",
        },
      ],
      prerequisites: ["Essay Writing Sample", "LNAT Exam"],
    },
    website_url: "https://www.lse.ac.uk/law",
    contact_email: "law-admissions@lse.ac.uk",
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
