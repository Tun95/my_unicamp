// Dashboard.tsx
import { useEffect, useState } from "react";
import TableComponent from "../../common/table/Table";
import Widget from "./widget/Widget";
import { useTheme } from "../../custom hooks/Hooks";
import ChartComponent from "./chart/Chart";
import { Loader } from "lucide-react";
import { courseService } from "../../services/courseService";
import {
  ChartData,
  DashboardOverview,
  DegreeTypeData,
} from "../../types/dashboard/dashboard";

function Dashboard() {
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await courseService.getDashboardOverview();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400 flex justify-center items-center">
          <Loader className="animate-spin text-gray-500 dark:text-gray-400" />
          Loading Course Dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 dark:text-red-400 text-center">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 text-blue-600 dark:text-blue-400 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const { summary, distributions, trends, recent_activity } = dashboardData;

  return (
    <div className={`w-full overflow-hidden ${theme === "dark" ? "dark" : ""}`}>
      {/* Welcome message */}
      <div className="mb-2 max-480px:mb-1">
        <div className="content max-900px:px-2 max-900px:mt-3 max-480px:p-2 max-480px:pb-0">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 max-480px:text-xl">
            Welcome back Admin!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl text-sm leading-6">
            Track course offerings, enrollment trends, and academic metrics in
            one place.
          </p>
        </div>
      </div>

      {/* KPI Widgets */}
      <div
        className="grid grid-cols-3 gap-5 py-5 w-full 
               max-1045px:grid-cols-2 
               max-630px:grid-cols-1 
               max-900px:px-2"
      >
        <Widget type="totalCourses" value={summary.total_courses} />
        <Widget type="activeCourses" value={summary.active_courses} />
        <Widget type="activityRate" value={summary.activity_rate} />
      </div>

      {/* Chart Section */}
      <div className="mb-5 max-900px:px-2">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Course Distribution by Degree Type
        </h4>
        <div className="lg:grid-cols-2 gap-5 mt-1 w-full max-900px:grid-cols-1">
          <div className="w-full border border-gray-200 dark:border-gray-700 p-2 rounded-md h-[360px] overflow-hidden bg-white dark:bg-gray-800">
            {distributions.degree_types.length > 0 ? (
              <ChartComponent
                data={transformDegreeTypeData(distributions.degree_types)}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">
                  No degree type data available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Fields Section */}
      <div className="mb-5 max-900px:px-2">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Popular Fields of Study
        </h4>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trends.fields_of_study.slice(0, 6).map((field) => (
            <div
              key={field.field_of_study}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    {field.field_of_study}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {field.count} courses • {field.university_count}{" "}
                    universities
                  </p>
                </div>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
                  #{field.popularity_rank}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {field.degree_types.map((degree) => (
                  <span
                    key={degree}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                  >
                    {degree}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="max-900px:px-2 relative">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Recent Course Activity
        </h4>
        <div className="mt-1">
          <TableComponent
            courses={recent_activity}
            fetchDashboardData={fetchDashboardData}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

// Helper function to transform degree type data for the chart
function transformDegreeTypeData(degreeTypes: DegreeTypeData[]): ChartData[] {
  return degreeTypes.map((degree) => ({
    name: degree.degree_type,
    value: degree.count,
    percentage: degree.percentage,
    avg_tuition: degree.avg_tuition,
  }));
}

export default Dashboard;
