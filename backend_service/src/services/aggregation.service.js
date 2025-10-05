// backend_service/services/aggregation.service.js
const Course = require("../../models/course.model");
const logger = require("../../config/logger");
const { ERROR_MESSAGES } = require("../constants/constants");

class AggregationService {
  // Get comprehensive dashboard overview
  async getDashboardOverview() {
    try {
      // Execute all aggregations in parallel for better performance
      const [
        totalStats,
        universitiesDistribution,
        degreeTypesDistribution,
        fieldsOfStudyTrend,
        recentCourses,
        locationDistribution,
        monthlyTrend,
      ] = await Promise.all([
        this.getTotalStats(),
        this.getUniversitiesDistribution(),
        this.getDegreeTypesDistribution(),
        this.getFieldsOfStudyTrend(),
        this.getRecentCourses(),
        this.getLocationDistribution(),
        this.getMonthlyTrend(),
      ]);

      const dashboardData = {
        summary: totalStats,
        distributions: {
          universities: universitiesDistribution,
          degree_types: degreeTypesDistribution,
          locations: locationDistribution,
        },
        trends: {
          fields_of_study: fieldsOfStudyTrend,
          monthly: monthlyTrend,
        },
        recent_activity: recentCourses,
        last_updated: new Date().toISOString(),
      };

      await logger.info("Dashboard overview generated successfully", {
        service: "AggregationService",
        method: "getDashboardOverview",
        total_courses: totalStats.total_courses,
        active_courses: totalStats.active_courses,
      });

      return dashboardData;
    } catch (error) {
      await logger.error(error, {
        service: "AggregationService",
        method: "getDashboardOverview",
      });
      throw error;
    }
  }

  // Get total statistics
  async getTotalStats() {
    try {
      const stats = await Course.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            active: [{ $match: { is_active: true } }, { $count: "count" }],
            inactive: [{ $match: { is_active: false } }, { $count: "count" }],
            by_degree: [
              { $group: { _id: "$degree_type", count: { $sum: 1 } } },
            ],
          },
        },
      ]);

      const result = stats[0];
      const totalCount = result.total[0]?.count || 0;
      const activeCount = result.active[0]?.count || 0;

      return {
        total_courses: totalCount,
        active_courses: activeCount,
        inactive_courses: result.inactive[0]?.count || 0,
        degree_type_breakdown: result.by_degree || [],
        activity_rate: totalCount
          ? Math.round((activeCount / totalCount) * 100)
          : 0,
      };
    } catch (error) {
      await logger.error(error, {
        service: "AggregationService",
        method: "getTotalStats",
      });
      throw error;
    }
  }

  // Get universities distribution
  async getUniversitiesDistribution() {
    try {
      const distribution = await Course.aggregate([
        { $match: { is_active: true } },
        {
          $group: {
            _id: "$university",
            count: { $sum: 1 },
            courses: {
              $push: {
                title: "$title",
                degree_type: "$degree_type",
                field_of_study: "$field_of_study",
              },
            },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $project: {
            university: "$_id",
            count: 1,
            popular_courses: { $slice: ["$courses", 3] },
            _id: 0,
          },
        },
      ]);

      return distribution;
    } catch (error) {
      await logger.error(error, {
        service: "AggregationService",
        method: "getUniversitiesDistribution",
      });
      throw error;
    }
  }

  // Get degree types distribution - FIXED
  async getDegreeTypesDistribution() {
    try {
      // First get total count for percentage calculation
      const totalCountResult = await Course.aggregate([
        { $match: { is_active: true } },
        { $count: "total" },
      ]);

      const totalCount = totalCountResult[0]?.total || 0;

      const distribution = await Course.aggregate([
        { $match: { is_active: true } },
        {
          $group: {
            _id: "$degree_type",
            count: { $sum: 1 },
            total_tuition: { $sum: "$tuition_fee.amount" },
            avg_tuition: { $avg: "$tuition_fee.amount" },
          },
        },
        { $sort: { count: -1 } },
        {
          $project: {
            degree_type: "$_id",
            count: 1,
            total_tuition: { $ifNull: ["$total_tuition", 0] },
            avg_tuition: {
              $round: [{ $ifNull: ["$avg_tuition", 0] }, 2],
            },
            percentage: {
              $round: [
                {
                  $multiply: [{ $divide: ["$count", totalCount] }, 100],
                },
                2,
              ],
            },
            _id: 0,
          },
        },
      ]);

      return distribution;
    } catch (error) {
      await logger.error(error, {
        service: "AggregationService",
        method: "getDegreeTypesDistribution",
      });
      throw error;
    }
  }

  // Get fields of study trend - FIXED
  async getFieldsOfStudyTrend() {
    try {
      const trend = await Course.aggregate([
        { $match: { is_active: true } },
        {
          $group: {
            _id: "$field_of_study",
            count: { $sum: 1 },
            universities: { $addToSet: "$university" },
            degree_types: { $addToSet: "$degree_type" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 15 },
        {
          $addFields: {
            university_count: { $size: "$universities" },
          },
        },
        {
          $project: {
            field_of_study: "$_id",
            count: 1,
            university_count: 1,
            degree_types: 1,
            _id: 0,
          },
        },
      ]);

      // Add popularity rank manually since $indexOfArray was problematic
      return trend.map((item, index) => ({
        ...item,
        popularity_rank: index + 1,
      }));
    } catch (error) {
      await logger.error(error, {
        service: "AggregationService",
        method: "getFieldsOfStudyTrend",
      });
      throw error;
    }
  }

  // Get recent courses
  async getRecentCourses() {
    try {
      const recent = await Course.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "title university degree_type field_of_study createdAt duration fees is_active location tuition_fee description"
        )
        .lean();

      return recent;
    } catch (error) {
      await logger.error(error, {
        service: "AggregationService",
        method: "getRecentCourses",
      });
      throw error;
    }
  }

  // Get location distribution
  async getLocationDistribution() {
    try {
      const distribution = await Course.aggregate([
        { $match: { is_active: true } },
        {
          $group: {
            _id: "$location",
            count: { $sum: 1 },
            universities: { $addToSet: "$university" },
            avg_tuition: { $avg: "$tuition_fee.amount" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 8 },
        {
          $project: {
            location: "$_id",
            count: 1,
            university_count: { $size: "$universities" },
            avg_tuition: {
              $round: [{ $ifNull: ["$avg_tuition", 0] }, 2],
            },
            _id: 0,
          },
        },
      ]);

      return distribution;
    } catch (error) {
      await logger.error(error, {
        service: "AggregationService",
        method: "getLocationDistribution",
      });
      throw error;
    }
  }

  // Get monthly trend (courses added per month) - FIXED
  async getMonthlyTrend() {
    try {
      const trend = await Course.aggregate([
        { $match: { is_active: true } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
            courses: {
              $push: {
                title: "$title",
                university: "$university",
              },
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort chronologically
        { $limit: 6 },
        {
          $project: {
            period: {
              $concat: [
                { $toString: "$_id.year" },
                "-",
                {
                  $toString: {
                    $cond: {
                      if: { $lt: ["$_id.month", 10] },
                      then: { $concat: ["0", { $toString: "$_id.month" }] },
                      else: { $toString: "$_id.month" },
                    },
                  },
                },
              ],
            },
            count: 1,
            sample_courses: { $slice: ["$courses", 2] },
            _id: 0,
          },
        },
      ]);

      return trend;
    } catch (error) {
      await logger.error(error, {
        service: "AggregationService",
        method: "getMonthlyTrend",
      });
      throw error;
    }
  }
}

module.exports = new AggregationService();
