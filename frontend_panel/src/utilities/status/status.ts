// Status utility function to determine status based on stock and demand
export const getStatusInfo = (stock: number, demand: number) => {
  if (stock > demand)
    return {
      status: "Healthy",
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      darkBgColor: "bg-green-900",
      darkTextColor: "text-green-300",
    };
  if (stock === demand)
    return {
      status: "Low",
      color: "orange",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      darkBgColor: "bg-orange-900",
      darkTextColor: "text-orange-300",
    };
  return {
    status: "Critical",
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    darkBgColor: "bg-red-900",
    darkTextColor: "text-red-300",
  };
};
