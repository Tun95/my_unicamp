// get status color based on degree type
export const getStatusColorClasses = (degreeType: string) => {
  switch (degreeType) {
    case "Bachelor":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Master":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "PhD":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "Diploma":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "Certificate":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};
