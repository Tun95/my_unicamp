import { Helmet } from "react-helmet-async";
import Navbar from "../../common/navbar/Navbar";
import Home from "../../components/home/Home";

function HomeScreen() {
  return (
    <div>
      <Helmet>
        <title>Home | UNICAMP - Find Your Perfect Course</title>
        <meta
          name="description"
          content="Discover thousands of courses from top universities worldwide. Find your perfect program with UNICAMP."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all">
        {/* Navbar */}
        <Navbar />

        {/* Main content area */}
        <main className="p-8 max-900px:p-4 max-480px:p-2">
          <Home />
        </main>
      </div>
    </div>
  );
}

export default HomeScreen;
