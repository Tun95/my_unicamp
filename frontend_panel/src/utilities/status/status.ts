// get 
export const getStatusColor = (degreeType: string) => {
  switch (degreeType) {
    case "Bachelor":
      return "blue";
    case "Master":
      return "green";
    case "PhD":
      return "purple";
    default:
      return "gray";
  }
};
