// Widget.tsx
import { Info } from "lucide-react";
import { formatNumberWithCommas } from "../../../utilities/utils/Utils";
import { WidgetProps } from "../../../types/widget/widget";

const Widget: React.FC<WidgetProps> = ({ type, value = 0 }) => {
  const getWidgetConfig = (type: string) => {
    switch (type) {
      case "totalCourses":
        return {
          title: "Total Courses",
          tooltip: "Total number of courses in the system",
          format: (val: number) => formatNumberWithCommas(val),
        };
      case "activeCourses":
        return {
          title: "Active Courses",
          tooltip: "Number of currently active courses",
          format: (val: number) => formatNumberWithCommas(val),
        };
      case "activityRate":
        return {
          title: "Activity Rate",
          tooltip: "Percentage of courses that are active",
          format: (val: number) => `${val}%`,
        };
      case "universities":
        return {
          title: "Universities",
          tooltip: "Number of universities offering courses",
          format: (val: number) => formatNumberWithCommas(val),
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
