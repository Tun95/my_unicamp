import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import LoadingBox from "./utilities/message loading/LoadingBox";
import ErrorBoundary from "./utilities/error boundary/ErrorBoundary";
import DashboardScreen from "./screens/dashboardscreen/HomeScreen";
import CourseScreen from "./screens/coursescreen/CourseScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);

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
        <Route path="/" element={<DashboardScreen />} />
        <Route path="/courses" element={<CourseScreen />} />
      </Routes>
    </div>
  );
}

export default App;
