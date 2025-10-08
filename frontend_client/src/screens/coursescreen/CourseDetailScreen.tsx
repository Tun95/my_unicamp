import Navbar from "../../common/navbar/Navbar";
import CourseDetail from "../../components/course/details/CourseDetail";

function CourseDetailScreen() {
  return (
    <div>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all">
        {/* Navbar */}
        <Navbar />

        {/* Main content area */}
        <main className="p-8 max-900px:p-4 max-480px:p-2">
          <CourseDetail />
        </main>
      </div>
    </div>
  );
}

export default CourseDetailScreen;
