import { Table, Tag } from "antd";
import { Product } from "../../../../types/data/datatype";

interface DesktopTableViewProps {
  data: Product[];
  onRowClick: (product: Product) => void;
  getStatus: (
    stock: number,
    demand: number
  ) => { status: string; color: string };
  theme: string;
}

export const DesktopTableView = ({
  data,
  onRowClick,
  getStatus,
  theme,
}: DesktopTableViewProps) => {
  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Product) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            ID: {record.id}
          </div>
        </div>
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Warehouse",
      dataIndex: "warehouse",
      key: "warehouse",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => (
        <span className="font-semibold">{stock.toLocaleString()}</span>
      ),
    },
    {
      title: "Demand",
      dataIndex: "demand",
      key: "demand",
      render: (demand: number) => (
        <span className="font-semibold">{demand.toLocaleString()}</span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_: unknown, record: Product) => {
        const statusInfo = getStatus(record.stock, record.demand);
        return (
          <Tag color={statusInfo.color} className="capitalize">
            {statusInfo.status}
          </Tag>
        );
      },
    },
  ];

  return (
    <Table<Product>
      dataSource={data}
      rowKey="id"
      className={`w-full ${theme === "dark" ? "dark-table" : ""}`}
      pagination={false}
      rowClassName={(record) => {
        const status = getStatus(record.stock, record.demand);
        return status.status === "Critical"
          ? theme === "dark"
            ? "bg-red-900/20"
            : "bg-red-50"
          : "";
      }}
      onRow={(record) => ({
        onClick: () => onRowClick(record),
        style: { cursor: "pointer" },
      })}
      columns={columns}
    />
  );
};

interface MobileTableViewProps {
  data: Product[];
  onRowClick: (product: Product) => void;
  getStatus: (
    stock: number,
    demand: number
  ) => { status: string; color: string };
  theme: string;
}

export const MobileTableView = ({
  data,
  onRowClick,
  getStatus,
  theme,
}: MobileTableViewProps) => {
  return (
    <div className="space-y-3 p-4">
      {data.map((product) => {
        const statusInfo = getStatus(product.stock, product.demand);
        const isCritical = statusInfo.status === "Critical";

        return (
          <div
            key={product.id}
            onClick={() => onRowClick(product)}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              theme === "dark"
                ? `border-gray-700 ${
                    isCritical ? "bg-red-900/20" : "bg-gray-800"
                  }`
                : `border-gray-200 ${isCritical ? "bg-red-50" : "bg-white"}`
            } hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {product.id}
                </p>
              </div>
              <Tag color={statusInfo.color} className="capitalize">
                {statusInfo.status}
              </Tag>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">SKU</p>
                <p className="text-gray-900 dark:text-white">{product.sku}</p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">Warehouse</p>
                <p className="text-gray-900 dark:text-white">
                  {product.warehouse}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">Stock</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {product.stock.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">Demand</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {product.demand.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
                View Details →
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
