import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import LoadingBox from "./utilities/message loading/LoadingBox";
import ErrorBoundary from "./utilities/error boundary/ErrorBoundary";
import CourseScreen from "./screens/coursescreen/CourseScreen";
import HomeScreen from "./screens/homescreen/HomeScreen";
import Footer from "./common/footer/Footer";
import CourseDetailScreen from "./screens/coursescreen/CourseDetailScreen";
import useScrollToTop from "./utilities/scroll to top/ScrollToTop";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useScrollToTop();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div>
        <LoadingBox />
      </div>
    );
  }

  return (
    <div className="app">
      <Toaster expand visibleToasts={1} />
      <Routes>
        <Route path="*" element={<ErrorBoundary />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/courses" element={<CourseScreen />} />
        <Route path="/courses/:slug" element={<CourseDetailScreen />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
