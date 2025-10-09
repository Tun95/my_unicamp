// Format numbers with commas (e.g., 2,300,454)
export const formatNumberWithCommas = (num: number): string => {
  const validNumber = isNaN(num) || num === null || num === undefined ? 0 : num;
  return validNumber.toLocaleString();
};

// Format date with time
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format date for display (show day only for better readability)
export const formatDayOnly = (date: string) => {
  return new Date(date).getDate().toString();
};

// FORMAT NUMBER With no Decimal
export const formatNumberNoDecimalShort = (value: number): string => {
  const suffixes = ["", "k", "M", "B", "T"];
  let suffixIndex = 0;

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  return `${Math.floor(value)}${suffixes[suffixIndex]}`;
};

export const commonIntakeMonths = [
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

// Tuition Fee Formatting
export interface FormatTuitionOptions {
  includePeriod?: boolean;
  fallbackText?: string;
}

export const formatTuitionFee = (
  tuition_fee?: {
    amount?: number;
    currency?: string;
    period?: string;
  },
  options: FormatTuitionOptions = {}
): string => {
  const { includePeriod = true, fallbackText = "Not specified" } = options;

  if (!tuition_fee?.amount || !tuition_fee?.currency) {
    return fallbackText;
  }

  const formattedAmount = tuition_fee.amount.toLocaleString();
  const currencySymbol = getCurrencySymbol(tuition_fee.currency);

  let periodSuffix = "";
  if (includePeriod) {
    switch (tuition_fee.period) {
      case "per_year":
        periodSuffix = " per year";
        break;
      case "per_semester":
        periodSuffix = " per semester";
        break;
      case "total_course":
        periodSuffix = " total";
        break;
      default:
        periodSuffix = "";
    }
  }

  return `${currencySymbol}${formattedAmount}${periodSuffix}`;
};

// Helper function for currency symbols
const getCurrencySymbol = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "C$",
    AUD: "A$",
    CHF: "CHF",
    CNY: "¥",
    INR: "₹",
    NGN: "₦",
    ZAR: "R",
    // Add more currencies as needed
  };

  return symbols[currency] || currency;
};
