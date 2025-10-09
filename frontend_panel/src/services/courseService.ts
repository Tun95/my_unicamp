// src/services/courseService.ts
import axios, { AxiosError } from "axios";
import {
  DashboardOverview,
  Course,
  FilterOptions,
} from "../types/dashboard/dashboard";
import {
  CourseFilters,
  CoursesResponse,
  CreateCourseData,
  ToggleVisibilityRequest,
} from "../types/course/course";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Define error response types
interface ValidationError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

interface ErrorResponse {
  status: string;
  message: string;
  errors?: ValidationError[];
}

class CourseService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 100000,
  });

  // Error handler
  private handleError(error: AxiosError<ErrorResponse>): never {
    console.error("API Error:", error);

    const response = error.response?.data;

    if (response?.errors && Array.isArray(response.errors)) {
      // Validation errors - combine all error messages
      const errorMessages = response.errors.map((err) => err.msg).join(", ");
      throw new Error(errorMessages || response.message || "Validation failed");
    }

    if (response?.message) {
      throw new Error(response.message);
    }

    if (error.code === "NETWORK_ERROR" || error.code === "ECONNREFUSED") {
      throw new Error(
        "Unable to connect to server. Please check your connection."
      );
    }

    throw new Error(error.message || "An unexpected error occurred");
  }

  // Create new course
  async createCourse(courseData: CreateCourseData): Promise<Course> {
    try {
      const response = await this.api.post("/api/admin/courses", courseData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // Get comprehensive dashboard overview
  async getDashboardOverview(): Promise<DashboardOverview> {
    try {
      const response = await this.api.get("/api/admin/dashboard/overview");
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
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
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // Get filter options
  async getFilterOptions(): Promise<FilterOptions> {
    try {
      const response = await this.api.get("/api/courses/filters");
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
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
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // Toggle course featured status
  async toggleFeaturedStatus(
    id: string,
    is_featured: boolean
  ): Promise<Course> {
    try {
      const response = await this.api.patch(
        `/api/admin/courses/${id}/featured`,
        { is_featured }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // Toggle course visibility
  async toggleCourseVisibility(
    id: string,
    action?: "hide" | "unhide"
  ): Promise<Course> {
    try {
      const requestBody: ToggleVisibilityRequest = action ? { action } : {};

      const response = await this.api.patch(
        `/api/admin/courses/${id}`,
        requestBody
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // Delete course permanently
  async deleteCourse(id: string): Promise<void> {
    try {
      await this.api.delete(`/api/admin/courses/${id}/permanent`);
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // Get course by ID
  async getCourseById(id: string): Promise<Course> {
    try {
      const response = await this.api.get(`/api/courses/${id}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // Get course by slug
  async getCourseBySlug(slug: string): Promise<Course> {
    try {
      const response = await this.api.get(`/api/courses/slug/${slug}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // Get latest courses
  async getLatestCourses(limit: number = 5): Promise<Course[]> {
    try {
      const response = await this.api.get("/api/admin/courses/latest", {
        params: { limit },
      });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // Get featured courses
  async getFeaturedCourses(limit: number = 6): Promise<Course[]> {
    try {
      const response = await this.api.get("/api/courses/featured", {
        params: { limit },
      });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }
}

export const courseService = new CourseService();
