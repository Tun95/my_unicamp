// HeroSection.tsx
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
}

const HeroSection = ({ onSearch, searchTerm }: HeroSectionProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Sync local state with parent searchTerm
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    // Optional: Implement debounced search here for real-time filtering
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div className="container mx-auto px-8 max-900px:px-4 text-center">
        <h1 className="text-5xl font-bold mb-6 max-900px:text-4xl max-480px:text-3xl">
          Find Your Perfect Course
        </h1>
        <p className="text-xl mb-8 text-blue-100 max-900px:text-lg">
          Discover thousands of courses from top universities worldwide
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={localSearchTerm}
                onChange={handleInputChange}
                placeholder="Search for courses, universities, or fields of study..."
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto max-900px:grid-cols-1 max-900px:gap-4">
          <div>
            <div className="text-3xl font-bold">10,000+</div>
            <div className="text-blue-100">Courses</div>
          </div>
          <div>
            <div className="text-3xl font-bold">500+</div>
            <div className="text-blue-100">Universities</div>
          </div>
          <div>
            <div className="text-3xl font-bold">50+</div>
            <div className="text-blue-100">Countries</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
