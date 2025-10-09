import { DollarSign, AlertCircle } from "lucide-react";
import { TuitionFee } from "../../../../types/course/course";

interface TuitionSectionProps {
  tuitionFee?: TuitionFee;
}

const TuitionSection = ({ tuitionFee }: TuitionSectionProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!tuitionFee) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-480px:p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <DollarSign size={24} className="text-green-600" />
          Tuition & Fees
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tuition information not available for this course.
        </p>
      </div>
    );
  }

  const getFeeDescription = () => {
    const amount = formatCurrency(tuitionFee.amount, tuitionFee.currency);
    switch (tuitionFee.period) {
      case "per_year":
        return `${amount} per academic year`;
      case "per_semester":
        return `${amount} per semester`;
      case "total_course":
        return `${amount} total program cost`;
      default:
        return amount;
    }
  };

  const additionalFees = [
    { name: "Application Fee", amount: 75, currency: tuitionFee.currency },
    {
      name: "Student Services Fee",
      amount: 500,
      currency: tuitionFee.currency,
      period: "per_year",
    },
    {
      name: "Health Insurance",
      amount: 1200,
      currency: tuitionFee.currency,
      period: "per_year",
    },
    {
      name: "Books & Materials",
      amount: 800,
      currency: tuitionFee.currency,
      period: "per_year",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-480px:p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <DollarSign size={24} className="text-green-600" />
        Tuition & Fees
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Tuition */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tuition Fee
          </h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {formatCurrency(tuitionFee.amount, tuitionFee.currency)}
            </div>
            <p className="text-blue-700 dark:text-blue-300 font-medium capitalize">
              {tuitionFee.period.replace("_", " ")}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              {getFeeDescription()}
            </p>
          </div>

          {/* Payment Information */}
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Payment Information
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Tuition fees are typically due at the beginning of each
                  semester. Payment plans and financial aid options are
                  available.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Fees */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Additional Fees
          </h3>
          <div className="space-y-3">
            {additionalFees.map((fee, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {fee.name}
                  </p>
                  {fee.period && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {fee.period.replace("_", " ")}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(fee.amount, fee.currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total Estimated Cost */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-green-800 dark:text-green-200">
                Total Estimated Cost (First Year)
              </span>
              <span className="text-xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(
                  tuitionFee.amount +
                    additionalFees.reduce((sum, fee) => sum + fee.amount, 0),
                  tuitionFee.currency
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuitionSection;
