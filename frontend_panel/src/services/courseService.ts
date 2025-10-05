// src/services/courseService.ts
import axios, { AxiosError } from "axios";
import { DashboardOverview, Course } from "../types/dashboard/dashboard";
import { CourseFilters, CoursesResponse } from "../types/course/course";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class CourseService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 100000,
  });

  // Get comprehensive dashboard overview
  async getDashboardOverview(): Promise<DashboardOverview> {
    try {
      const response = await this.api.get("/api/admin/dashboard/overview");
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Error fetching dashboard overview:", axiosError);
      throw new Error(
        axiosError.response?.data?.message ||
          "Failed to fetch dashboard overview"
      );
    }
  }

  // Get courses with filters
  async getCourses(filters: CourseFilters = {}): Promise<CoursesResponse> {
    try {
      const response = await this.api.get("/api/admin/courses", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Error fetching courses:", axiosError);
      throw new Error(
        axiosError.response?.data?.message || "Failed to fetch courses"
      );
    }
  }

  // Update course
  async updateCourse(id: string, courseData: Partial<Course>): Promise<Course> {
    try {
      const response = await this.api.put(
        `/api/admin/courses/${id}`,
        courseData
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Error updating course:", axiosError);
      throw new Error(
        axiosError.response?.data?.message || "Failed to update course"
      );
    }
  }

  // Toggle course visibility
  async toggleCourseVisibility(id: string): Promise<Course> {
    try {
      const response = await this.api.patch(`/api/admin/courses/${id}`);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Error toggling course visibility:", axiosError);
      throw new Error(
        axiosError.response?.data?.message ||
          "Failed to toggle course visibility"
      );
    }
  }

  // Delete course permanently
  async deleteCourse(id: string): Promise<void> {
    try {
      await this.api.delete(`/api/admin/courses/${id}/permanent`);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Error deleting course:", axiosError);
      throw new Error(
        axiosError.response?.data?.message || "Failed to delete course"
      );
    }
  }
}

export const courseService = new CourseService();
