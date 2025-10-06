// ChartComponent.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "../../../custom hooks/Hooks";
import { CustomTooltipProps } from "../../../types/recharts/recharts";
import { ChartData } from "../../../types/dashboard/dashboard";

interface ChartComponentProps {
  data: ChartData[];
}

function ChartComponent({ data }: ChartComponentProps) {
  const { theme } = useTheme();

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload as ChartData;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
            {label}
          </p>
          <p className="text-blue-600 dark:text-blue-400 text-sm">
            Courses: {dataItem.value?.toLocaleString()}
          </p>
          <p className="text-green-600 dark:text-green-400 text-sm">
            Percentage: {dataItem.percentage}%
          </p>
          <p className="text-purple-600 dark:text-purple-400 text-sm">
            Avg Tuition: ${dataItem.avg_tuition?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: -36,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
          />
          <XAxis
            dataKey="name"
            stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="value" name="Number of Courses" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartComponent;
