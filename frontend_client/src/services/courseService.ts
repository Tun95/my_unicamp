// src/services/courseService.ts
import axios, { AxiosError } from "axios";
import {
  CourseFilters,
  CoursesResponse,
  FilterOptionsResponse,
} from "../types/course/course";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class CourseService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 100000,
  });

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

  // Get filter options
  async getFilterOptions(): Promise<FilterOptionsResponse> {
    try {
      const response = await this.api.get("/api/courses/filters");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Error fetching filter options:", axiosError);
      throw new Error(
        axiosError.response?.data?.message || "Failed to fetch filter options"
      );
    }
  }
}

export const courseService = new CourseService();
