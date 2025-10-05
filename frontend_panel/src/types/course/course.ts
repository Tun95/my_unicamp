import { Course } from "../dashboard/dashboard";

// src/types/course/course.ts
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
