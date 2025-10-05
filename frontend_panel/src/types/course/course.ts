import { Course } from "../dashboard/dashboard";

export interface CoursesResponse {
  data: Course[];
  pagination: {
    total_pages: number;
    current_page: number;
    total: number;
    limit: number;
  };
  filters?: {
    field_of_study?: string;
    university?: string;
    degree_type?: string;
    location?: string;
  };
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
