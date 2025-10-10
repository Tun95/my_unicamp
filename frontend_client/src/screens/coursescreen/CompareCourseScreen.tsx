// Updated CompareCourseScreen (recommended):
import Navbar from "../../common/navbar/Navbar";
import CompareCourses from "../../components/compare/CompareCourses";

function CompareCourseScreen() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all">
      <Navbar />
      <main className="relative">
        {" "}
        {/* Remove padding here */}
        <CompareCourses />
      </main>
    </div>
  );
}

export default CompareCourseScreen;
