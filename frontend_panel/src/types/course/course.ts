// src/types/course/course.ts
import { Course } from "../dashboard/dashboard";

export interface CreateCourseData {
  title: string;
  university: string;
  duration: string;
  location: {
    address?: string;
    city: string;
    state?: string;
    country: string;
    postal_code?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  description: string;
  degree_type: "Bachelor" | "Master" | "PhD" | "Diploma" | "Certificate";
  field_of_study: string;
  intake_months: string[];
  application_deadline?: string;
  language: string;
  tuition_fee?: {
    amount: number;
    currency: string;
    period: "per_year" | "per_semester" | "total_course";
  };
  entry_requirements?: {
    minimum_gpa?: number;
    language_tests?: Array<{
      test_type: string;
      minimum_score: string;
    }>;
    prerequisites?: string[];
  };
  website_url?: string;
  contact_email?: string;
  is_featured?: boolean;
}

export interface CourseFilters {
  page?: number;
  limit?: number;
  search?: string;
  university?: string;
  degree_type?: string;
  field_of_study?: string;
  country?: string;
  city?: string;
  is_active?: boolean;
}

export interface PaginationInfo {
  total_pages: number;
  current_page: number;
  total: number;
  limit: number;
}

export interface CoursesResponse {
  data: Course[];
  pagination: PaginationInfo;
  filters?: {
    field_of_study?: string;
    university?: string;
    degree_type?: string;
    location?: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ToggleFeaturedRequest {
  is_featured: boolean;
}

export interface ToggleVisibilityRequest {
  action?: "hide" | "unhide";
}
