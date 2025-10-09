// src/services/courseService.ts
import axios, { AxiosError } from "axios";
import {
  Course,
  CourseFilters,
  CoursesResponse,
  FilterOptions,
  LimitedCourseFilters,
  LimitedCoursesResponse,
  RelatedCoursesParams,
  RelatedCoursesResponse,
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

  // Get courses with filters and pagination (for load more)
  async getCourses(filters: CourseFilters = {}): Promise<CoursesResponse> {
    try {
      const response = await this.api.get("/api/courses", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // Get limited courses without pagination (max 6 courses)
  async getLimitedCourses(
    filters: LimitedCourseFilters = {}
  ): Promise<LimitedCoursesResponse> {
    try {
      const response = await this.api.get("/api/courses/limited", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // Get featured courses for homepage
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

  // Get filter options
  async getFilterOptions(): Promise<FilterOptions> {
    try {
      const response = await this.api.get("/api/courses/filters");
      return response.data.data;
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

  // Get related courses by course ID
  async getRelatedCoursesById(
    id: string,
    params: RelatedCoursesParams = {}
  ): Promise<RelatedCoursesResponse> {
    try {
      const response = await this.api.get(`/api/courses/${id}/related`, {
        params: {
          limit: params.limit || 4,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }

  // Get related courses by course slug
  async getRelatedCoursesBySlug(
    slug: string,
    params: RelatedCoursesParams = {}
  ): Promise<RelatedCoursesResponse> {
    try {
      const response = await this.api.get(`/api/courses/slug/${slug}/related`, {
        params: {
          limit: params.limit || 4,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>);
    }
  }
}

export const courseService = new CourseService();
