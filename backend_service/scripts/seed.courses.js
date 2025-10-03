// backend_service/src/scripts/seed.courses.js
const mongoose = require("mongoose");
const Course = require("../models/course.model");
require("dotenv").config({ path: "./.env" });

// Sample course data
const sampleCourses = [
  {
    title: "Computer Science Bachelor",
    university: "Stanford University",
    duration: "4 years",
    location: "Stanford, California, USA",
    fees: "$55,000 per year",
    description:
      "Comprehensive computer science program covering algorithms, data structures, software engineering, and artificial intelligence.",
    degree_type: "Bachelor",
    field_of_study: "Computer Science",
    intake_months: ["September"],
    language: "English",
    tuition_fee: {
      amount: 55000,
      currency: "USD",
      period: "per_year",
    },
  },
  {
    title: "Business Administration MBA",
    university: "Harvard Business School",
    duration: "2 years",
    location: "Boston, Massachusetts, USA",
    fees: "$73,000 per year",
    description:
      "World-renowned MBA program focusing on leadership, strategy, and business innovation.",
    degree_type: "Master",
    field_of_study: "Business Administration",
    intake_months: ["September"],
    language: "English",
    tuition_fee: {
      amount: 73000,
      currency: "USD",
      period: "per_year",
    },
  },
  {
    title: "Mechanical Engineering",
    university: "MIT",
    duration: "4 years",
    location: "Cambridge, Massachusetts, USA",
    fees: "$53,000 per year",
    description:
      "Rigorous engineering program with focus on mechanics, thermodynamics, and design.",
    degree_type: "Bachelor",
    field_of_study: "Mechanical Engineering",
    intake_months: ["September"],
    language: "English",
  },
  {
    title: "International Relations",
    university: "University of Oxford",
    duration: "3 years",
    location: "Oxford, England, UK",
    fees: "£25,000 per year",
    description:
      "Study of international affairs, diplomacy, and global politics.",
    degree_type: "Bachelor",
    field_of_study: "Political Science",
    intake_months: ["October"],
    language: "English",
  },
  {
    title: "Data Science Master",
    university: "University of Toronto",
    duration: "1.5 years",
    location: "Toronto, Ontario, Canada",
    fees: "$45,000 total",
    description:
      "Advanced program in data analysis, machine learning, and statistical modeling.",
    degree_type: "Master",
    field_of_study: "Data Science",
    intake_months: ["January", "September"],
    language: "English",
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

    // Insert sample courses
    await Course.insertMany(sampleCourses);
    console.log("Sample courses inserted successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding courses:", error);
    process.exit(1);
  }
};

seedCourses();
