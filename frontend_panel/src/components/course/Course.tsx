// import FilterBox from "../dashboard/filters/FilterBox";
// import TableComponent from "../dashboard/table/Table";

import { useTheme } from "../../custom hooks/Hooks";

function Course() {
  const { theme } = useTheme();

  return (
    <div>
      <div
        className={`w-full overflow-hidden ${theme === "dark" ? "dark" : ""}`}
      >
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
        {/* <FilterBox
        onSearchChange={setSearchFilter}
        onWarehouseChange={setWarehouseFilter}
        onStatusChange={setStatusFilter}
        warehouses={warehousesData?.warehouses || []}
      />
      <TableComponent
        products={filteredProducts}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        loading={loading}
        onProductUpdate={handleProductUpdate}
      /> */}
      </div>
    </div>
  );
}

export default Course;
