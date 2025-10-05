// FilterBox.tsx
import { useState } from "react";
import { useTheme } from "../../custom hooks/Hooks";

interface FilterBoxProps {
  onSearchChange: (value: string) => void;
  onUniversityChange: (value: string) => void;
  onDegreeTypeChange: (value: string) => void;
  onFieldOfStudyChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

function FilterBox({
  onSearchChange,
  onUniversityChange,
  onDegreeTypeChange,
  onFieldOfStudyChange,
  onLocationChange,
  onStatusChange,
}: FilterBoxProps) {
  const { theme } = useTheme();
  const [searchValue, setSearchValue] = useState("");
  const [universityValue, setUniversityValue] = useState("all");
  const [degreeTypeValue, setDegreeTypeValue] = useState("all");
  const [fieldOfStudyValue, setFieldOfStudyValue] = useState("all");
  const [locationValue, setLocationValue] = useState("all");
  const [statusValue, setStatusValue] = useState("all");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleUniversityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUniversityValue(value);
    onUniversityChange(value === "all" ? "" : value);
  };

  const handleDegreeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDegreeTypeValue(value);
    onDegreeTypeChange(value === "all" ? "" : value);
  };

  const handleFieldOfStudyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFieldOfStudyValue(value);
    onFieldOfStudyChange(value === "all" ? "" : value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationValue(value);
    onLocationChange(value === "all" ? "" : value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusValue(value);
    onStatusChange(value === "all" ? "" : value);
  };

  // Common universities, degree types, and fields of study for suggestions
  const commonUniversities = [
    "Carnegie Mellon University",
    "Harvard Business School",
    "MIT",
    "Stanford University",
    "University of Toronto",
    "University of Oxford",
  ];

  const degreeTypes = ["Bachelor", "Master", "PhD", "Diploma", "Certificate"];

  const commonFieldsOfStudy = [
    "Computer Science",
    "Business Administration",
    "Data Science",
    "Mechanical Engineering",
    "Political Science",
  ];

  const commonLocations = [
    "Pittsburgh, Pennsylvania, USA",
    "Cambridge, Massachusetts, USA",
    "Stanford, California, USA",
    "Oxford, England, UK",
    "Boston, Massachusetts, USA",
    "Toronto, Ontario, Canada",
  ];

  return (
    <div
      className={`mb-4 p-4 rounded-lg ${
        theme === "dark" ? "bg-gray-800" : "bg-white border"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search Box */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Courses
          </label>
          <input
            type="text"
            placeholder="Search by course title, description..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* University Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            University
          </label>
          <input
            type="text"
            placeholder="Filter by university..."
            value={universityValue === "all" ? "" : universityValue}
            onChange={handleUniversityChange}
            list="universities"
            className="w-full h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
          <datalist id="universities">
            {commonUniversities.map((uni) => (
              <option key={uni} value={uni} />
            ))}
          </datalist>
        </div>

        {/* Degree Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Degree Type
          </label>
          <select
            value={degreeTypeValue}
            onChange={handleDegreeTypeChange}
            className="w-full h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Degree Types</option>
            {degreeTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Field of Study Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Field of Study
          </label>
          <input
            type="text"
            placeholder="Filter by field of study..."
            value={fieldOfStudyValue === "all" ? "" : fieldOfStudyValue}
            onChange={handleFieldOfStudyChange}
            list="fields"
            className="w-full h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
          <datalist id="fields">
            {commonFieldsOfStudy.map((field) => (
              <option key={field} value={field} />
            ))}
          </datalist>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="Filter by location..."
            value={locationValue === "all" ? "" : locationValue}
            onChange={handleLocationChange}
            list="locations"
            className="w-full h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
          <datalist id="locations">
            {commonLocations.map((location) => (
              <option key={location} value={location} />
            ))}
          </datalist>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={statusValue}
            onChange={handleStatusChange}
            className="w-full h-9 outline-none bg-white text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterBox;
