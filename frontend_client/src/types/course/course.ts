// src/types/course/course.ts

export interface Course {
  _id: string;
  title: string;
  slug: string;
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
  is_featured: boolean;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DegreeTypeData {
  degree_type: string;
  count: number;
  percentage: number;
  avg_tuition: number;
}

export interface ChartData {
  name: string;
  value: number;
  percentage: number;
  avg_tuition: number;
}

export interface FilterOptions {
  universities: string[];
  degree_types: string[];
  fields_of_study: string[];
  countries: string[];
  cities: string[];
  durations: string[];
  tuition_range: {
    minTuition: number;
    maxTuition: number;
  };
}

export interface FilterOptionsResponse {
  data: FilterOptions;
}

// Extended CourseFilters with all available filters
export interface CourseFilters {
  page?: number;
  limit?: number;
  search?: string;
  university?: string;
  degree_type?: string;
  field_of_study?: string;
  country?: string;
  city?: string;
  min_tuition?: number;
  max_tuition?: number;
  intake_month?: string;
  duration?: string;
  is_featured?: boolean;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// Filters for limited courses (no pagination)
export interface LimitedCourseFilters {
  search?: string;
  university?: string;
  degree_type?: string;
  field_of_study?: string;
  country?: string;
  city?: string;
  min_tuition?: number;
  max_tuition?: number;
  intake_month?: string;
  duration?: string;
  is_featured?: boolean;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  limit?: number;
}

export interface PaginationInfo {
  total_pages: number;
  current_page: number;
  total: number;
  limit: number;
  has_more?: boolean;
}

export interface CoursesResponse {
  status: string;
  data: Course[];
  pagination: PaginationInfo;
}

export interface LimitedCoursesResponse {
  status: string;
  data: Course[];
  count: number;
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
