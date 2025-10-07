// backend_service/models/course.model.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    university: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    fees: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    degree_type: {
      type: String,
      enum: ["Bachelor", "Master", "PhD", "Diploma", "Certificate"],
      required: true,
    },
    field_of_study: {
      type: String,
      required: true,
      trim: true,
    },
    intake_months: [
      {
        type: String,
        enum: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
      },
    ],
    application_deadline: {
      type: Date,
    },
    language: {
      type: String,
      default: "English",
    },
    tuition_fee: {
      amount: Number,
      currency: {
        type: String,
        default: "USD",
      },
      period: {
        type: String,
        enum: ["per_year", "per_semester", "total_course"],
        default: "per_year",
      },
    },
    entry_requirements: {
      minimum_gpa: Number,
      language_tests: [
        {
          test_type: String,
          minimum_score: String,
        },
      ],
      prerequisites: [String],
    },
    website_url: {
      type: String,
      trim: true,
    },
    contact_email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicates
courseSchema.index(
  {
    title: 1,
    university: 1,
    degree_type: 1,
  },
  {
    unique: true,
    partialFilterExpression: { is_active: true },
  }
);

// Text index for search functionality
courseSchema.index({
  title: "text",
  university: "text",
  field_of_study: "text",
});
courseSchema.index({ university: 1 });
courseSchema.index({ degree_type: 1 });
courseSchema.index({ field_of_study: 1 });
courseSchema.index({ location: 1 });
courseSchema.index({ is_active: 1 });

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
