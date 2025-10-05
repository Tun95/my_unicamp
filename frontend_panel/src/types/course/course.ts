import { Course } from "../dashboard/dashboard";

export interface CreateCourseData {
  title: string;
  university: string;
  duration: string;
  location: string;
  fees: string;
  description: string;
  degree_type: string;
  field_of_study: string;
  intake_months: string[];
  application_deadline?: string;
  language: string;
  tuition_fee?: {
    amount: number;
    currency: string;
    period: string;
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
}

export interface CourseFilters {
  page?: number;
  limit?: number;
  search?: string;
  university?: string;
  degree_type?: string;
  field_of_study?: string;
  location?: string;
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

export interface FilterOptions {
  universities: string[];
  degree_types: string[];
  fields_of_study: string[];
  locations: string[];
}

export interface FilterOptionsResponse {
  data: FilterOptions;
}
