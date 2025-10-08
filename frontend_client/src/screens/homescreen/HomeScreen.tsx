import { Helmet } from "react-helmet-async";
import Navbar from "../../common/navbar/Navbar";

function HomeScreen() {
  return (
    <div>
      <Helmet>
        <title>Home | UNICAMP</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all">
        {/* Navbar */}
        <Navbar />

        {/* Main content area */}
        <main className="p-8 max-900px:p-4 max-480px:p-2">
          {/* Your home content goes here */}
        </main>
      </div>
    </div>
  );
}

export default HomeScreen;
