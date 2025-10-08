import { Calendar, CheckCircle } from "lucide-react";

interface IntakeSectionProps {
  intakeMonths: string[];
}

const IntakeSection = ({ intakeMonths }: IntakeSectionProps) => {
  const allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-480px:p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Calendar size={24} className="text-purple-600" />
        Intake Periods
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {allMonths.map((month) => {
          const isAvailable = intakeMonths.includes(month);
          return (
            <div
              key={month}
              className={`p-4 rounded-lg text-center border-2 transition-all ${
                isAvailable
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                {isAvailable ? (
                  <CheckCircle size={20} className="text-green-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-500" />
                )}
                <span
                  className={`font-medium ${
                    isAvailable
                      ? "text-green-800 dark:text-green-200"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {month}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          <strong>Note:</strong> Applications are typically due 3-6 months
          before the intake period. Early application is recommended as spaces
          are limited.
        </p>
      </div>
    </div>
  );
};

export default IntakeSection;
