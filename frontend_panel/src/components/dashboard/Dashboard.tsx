// Dashboard.tsx
import TableComponent from "./table/Table";
import Widget from "./widget/Widget";
import { useDateRange, useTheme } from "../../custom hooks/Hooks";
import ChartComponent from "./chart/Chart";
import { Loader } from "lucide-react";


//RENAME THE VALUES TO COURSE RELATED
function Dashboard() {
  const { theme } = useTheme();
  const { selectedDateRange } = useDateRange();

  // Handle errors
  if (productsError) {
    console.error("Error fetching products:", productsError);
  }

  if (kpisError) {
    console.error("Error fetching KPIs:", kpisError);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400 flex justify-center items-center">
          <Loader className="animate-spin text-gray-500 dark:text-gray-400" />{" "}
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden ${theme === "dark" ? "dark" : ""}`}>
      <div
        className={`w-full overflow-hidden ${theme === "dark" ? "dark" : ""}`}
      >
        {/* Welcome message */}
        <div className="mb-2 max-480px:mb-1">
          <div className="content max-900px:px-2  max-900px:mt-3 max-480px:p-2 max-480px:pb-0">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 max-480px:text-xl ">
              Welcome back Tunji!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl text-sm leading-6">
              Track inventory levels, demand patterns, and fulfillment metrics
              in one place.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Widgets */}
      <div
        className="grid grid-cols-3 gap-5 py-5 w-full 
               max-1045px:grid-cols-2 
               max-630px:grid-cols-1 
               max-900px:px-2"
      >
        <Widget type="stock" value={kpiData.totalStock} />
        <Widget type="demand" value={kpiData.totalDemand} />
        <Widget type="fillRate" value={kpiData.fillRate} />
      </div>

      {/* Chart Section */}
      <div className="mb-5 max-900px:px-2">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Stock vs Demand trend
        </h4>
        <div className="lg:grid-cols-2 gap-5 mt-1 w-full max-900px:grid-cols-1">
          <div className="w-full border border-gray-200 dark:border-gray-700 p-2 rounded-md h-[360px] overflow-hidden bg-white dark:bg-gray-800">
            {chartData.length > 0 ? (
              <ChartComponent data={chartData} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">
                  No data available for the selected date range
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-900px:px-2 relative">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Inventory Overview
        </h4>
        <div className="mt-1">
          {/* LATEST FIVE HERE */}
          <TableComponent
            products={filteredProducts}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            loading={loading}
            onProductUpdate={handleProductUpdate}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
