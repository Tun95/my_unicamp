// backend_service/tests/services/aggregation.service.test.js
const logger = require("../config/logger");
const aggregationService = require("../src/services/aggregation.service");

// Mock dependencies
jest.mock("../models/course.model");
jest.mock("../config/logger", () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  pinoLogger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
  logtail: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

describe("AggregationService", () => {
  describe("getDashboardOverview", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return a structured dashboard overview", async () => {
      // Mock internal methods
      jest.spyOn(aggregationService, "getTotalStats").mockResolvedValue({
        total_courses: 100,
        active_courses: 80,
        inactive_courses: 20,
        degree_type_breakdown: [],
        activity_rate: 80,
      });

      jest
        .spyOn(aggregationService, "getUniversitiesDistribution")
        .mockResolvedValue([
          { university: "Uni A", count: 10, popular_courses: [] },
        ]);

      jest
        .spyOn(aggregationService, "getDegreeTypesDistribution")
        .mockResolvedValue([{ degree_type: "BSc", count: 50, percentage: 50 }]);

      jest
        .spyOn(aggregationService, "getFieldsOfStudyTrend")
        .mockResolvedValue([
          { field_of_study: "Engineering", count: 30, popularity_rank: 1 },
        ]);

      jest
        .spyOn(aggregationService, "getRecentCourses")
        .mockResolvedValue([{ title: "Course A", university: "Uni A" }]);

      jest
        .spyOn(aggregationService, "getLocationDistribution")
        .mockResolvedValue([{ location: "Lagos", count: 20 }]);

      jest
        .spyOn(aggregationService, "getMonthlyTrend")
        .mockResolvedValue([{ period: "2025-01", count: 10 }]);

      const result = await aggregationService.getDashboardOverview();

      expect(result).toHaveProperty("summary");
      expect(result).toHaveProperty("distributions");
      expect(result).toHaveProperty("trends");
      expect(result).toHaveProperty("recent_activity");
      expect(result).toHaveProperty("last_updated");

      expect(result.summary.total_courses).toBe(100);
      expect(result.trends.fields_of_study[0].popularity_rank).toBe(1);
      expect(logger.info).toHaveBeenCalledWith(
        "Dashboard overview generated successfully",
        expect.objectContaining({
          service: "AggregationService",
          method: "getDashboardOverview",
          total_courses: 100,
          active_courses: 80,
        })
      );
    });

    it("should log and throw error if any method fails", async () => {
      jest
        .spyOn(aggregationService, "getTotalStats")
        .mockRejectedValue(new Error("Aggregation failed"));

      await expect(aggregationService.getDashboardOverview()).rejects.toThrow(
        "Aggregation failed"
      );

      expect(logger.error).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          service: "AggregationService",
          method: "getDashboardOverview",
        })
      );
    });
  });
});
