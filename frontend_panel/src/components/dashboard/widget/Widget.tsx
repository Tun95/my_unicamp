import { Info } from "lucide-react";
import { formatNumberWithCommas } from "../../../utilities/utils/Utils";
import { WidgetProps } from "../../../types/widget/widget";

const Widget: React.FC<WidgetProps> = ({ type, value = 0 }) => {
  const getWidgetConfig = (type: string) => {
    switch (type) {
      case "stock":
        return {
          title: "Total Stock",
          tooltip: "Sum of all inventory items currently in stock",
          format: (val: number) => formatNumberWithCommas(val),
        };
      case "demand":
        return {
          title: "Total Demand",
          tooltip: "Sum of all customer demand requests",
          format: (val: number) => formatNumberWithCommas(val),
        };
      case "fillRate":
        return {
          title: "Fill Rate",
          tooltip: "Percentage of demand fulfilled from available stock",
          format: (val: number) => `${val.toFixed(1)}%`,
        };
      default:
        return {
          title: "KPI",
          tooltip: "Key Performance Indicator",
          format: (val: number) => val.toString(),
        };
    }
  };

  const config = getWidgetConfig(type);

  return (
    <div className="flex flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-md h-full bg-white dark:bg-gray-800">
      <div className="flex flex-col justify-between w-full">
        <div className="flex items-center gap-1 mb-3 whitespace-nowrap">
          <span className="font-bold text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap">
            {config.title}
          </span>
          <span
            className="text-gray-600 dark:text-gray-300"
            title={config.tooltip}
          >
            <Info size={16} className="mt-0.5" />
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold font-light dark:text-white">
            {config.format(value)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Widget;
