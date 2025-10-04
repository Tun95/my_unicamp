// ChartComponent.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { KPI } from "../../../types/data/datatype";
import { useTheme } from "../../../custom hooks/Hooks";
import { CustomTooltipProps } from "../../../types/recharts/recharts";
import { formatDayOnly } from "../../../utilities/utils/Utils";

interface ChartComponentProps {
  data: KPI[];
}

function ChartComponent({ data }: ChartComponentProps) {
  const { theme } = useTheme();

  // Custom tooltip with proper typing
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Date: {new Date(label as string).toLocaleDateString()}
          </p>
          <p className="text-blue-600 dark:text-blue-400 text-sm">
            Stock: {payload[0]?.value?.toLocaleString()}
          </p>
          <p className="text-green-600 dark:text-green-400 text-sm">
            Demand: {payload[1]?.value?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis values
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  return (
    <div className="w-full h-full p-4 relative right-2">
      <ResponsiveContainer
        width="100%"
        height="100%"
        style={{ outline: "none" }}
      >
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: -30,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatDayOnly}
            stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
            fontSize={12}
          />
          <YAxis
            stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
            fontSize={12}
            tickFormatter={formatYAxis}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="stock"
            stroke="#3b82f6"
            strokeWidth={1}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 2 }}
            activeDot={{ r: 4, fill: "#3b82f6" }}
            name="Stock"
          />
          <Line
            type="monotone"
            dataKey="demand"
            stroke="#10b981"
            strokeWidth={1}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 2 }}
            activeDot={{ r: 4, fill: "#10b981" }}
            name="Demand"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartComponent;
