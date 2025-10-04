// Dashboard.tsx
import TableComponent from "./table/Table";
import Widget from "./widget/Widget";
import { useDateRange, useTheme } from "../../custom hooks/Hooks";
import ChartComponent from "./chart/Chart";
import { useState, useEffect, useMemo } from "react";
import {
  calculateFillRate,
  calculateTotalDemand,
  calculateTotalStock,
  generateRecentKpiData,
} from "../../utilities/utils/Utils";
import { Product } from "../../types/data/datatype";
import FilterBox from "./filters/FilterBox";
import { Loader } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS, GET_KPIS, GET_WAREHOUSES } from "../../graphql/queries";
import {
  KPIsQueryData,
  ProductsQueryData,
  WarehousesQueryData,
} from "../../types/graphql/graphql";
import { client } from "../../graphql/client";

function Dashboard() {
  const { theme } = useTheme();
  const { selectedDateRange } = useDateRange();

  // GraphQL Queries
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useQuery<ProductsQueryData>(GET_PRODUCTS);

  const {
    data: kpisData,
    loading: kpisLoading,
    error: kpisError,
    refetch: refetchKPIs,
  } = useQuery<KPIsQueryData>(GET_KPIS, {
    skip: true,
    fetchPolicy: "network-only",
  });

  const { data: warehousesData } =
    useQuery<WarehousesQueryData>(GET_WAREHOUSES);

  const [products, setProducts] = useState<Product[]>([]);
  const [kpiData, setKpiData] = useState({
    totalStock: 0,
    totalDemand: 0,
    fillRate: 0,
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Refetch KPIs when date range changes
  useEffect(() => {
    if (selectedDateRange) {
      console.log("Refetching KPIs with range:", selectedDateRange);
      refetchKPIs({ range: selectedDateRange });
    }
  }, [selectedDateRange, refetchKPIs]);

  // Update products when data is fetched
  useEffect(() => {
    if (productsData) {
      setProducts(productsData.products);
    }
  }, [productsData]);

  // Calculate KPIs when products change
  useEffect(() => {
    if (products.length > 0) {
      const totalStock = calculateTotalStock(products);
      const totalDemand = calculateTotalDemand(products);
      const fillRate = calculateFillRate(products);

      setKpiData({
        totalStock,
        totalDemand,
        fillRate,
      });
    }
  }, [products]);

  // Use memoized chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    if (kpisData && kpisData.kpis) {
      console.log("Using server data:", kpisData.kpis.length, "days");
      return kpisData.kpis;
    }

    if (kpisError) {
      console.log("Using fallback data for:", selectedDateRange);
      let days = 7;
      if (selectedDateRange === "14d") days = 14;
      if (selectedDateRange === "30d") days = 30;
      return generateRecentKpiData(days);
    }

    // Generate data based on selected date range while loading
    if (selectedDateRange) {
      let days = 7;
      if (selectedDateRange === "14d") days = 14;
      if (selectedDateRange === "30d") days = 30;
      return generateRecentKpiData(days);
    }

    // Return empty array if no range is selected
    return [];
  }, [kpisData, kpisError, selectedDateRange]);

  // Filter products based on filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        searchFilter === "" ||
        product.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchFilter.toLowerCase()) ||
        product.id.toLowerCase().includes(searchFilter.toLowerCase());

      // Warehouse filter
      const matchesWarehouse =
        warehouseFilter === "all" || product.warehouse === warehouseFilter;

      // Status filter
      let matchesStatus = true;
      if (statusFilter !== "all") {
        const status =
          product.stock > product.demand
            ? "healthy"
            : product.stock === product.demand
            ? "low"
            : "critical";
        matchesStatus = status === statusFilter;
      }

      return matchesSearch && matchesWarehouse && matchesStatus;
    });
  }, [products, searchFilter, warehouseFilter, statusFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter, warehouseFilter, statusFilter]);

  // HANDLE PRODUCT UPDATE
  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );

    client.cache.updateQuery({ query: GET_PRODUCTS }, (data) => {
      if (data) {
        return {
          products: data.products.map((p: Product) =>
            p.id === updatedProduct.id ? updatedProduct : p
          ),
        };
      }
      return data;
    });
  };

  // Combined loading state
  const loading = productsLoading || kpisLoading;

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
          <FilterBox
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
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
