// src/types/dashboard/dashboard.ts

export interface Course {
  _id: string;
  title: string;
  university: string;
  duration: string;
  location: string;
  fees: string;
  description: string;
  degree_type: string;
  field_of_study: string;
  intake_months: string[];
  language: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  tuition_fee?: {
    amount: number;
    currency: string;
    period: string;
  };
  entry_requirements?: {
    prerequisites: string[];
    language_tests: string[];
  };
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

export interface DashboardOverview {
  summary: {
    total_courses: number;
    active_courses: number;
    inactive_courses: number;
    degree_type_breakdown: Array<{ _id: string; count: number }>;
    activity_rate: number;
  };
  distributions: {
    universities: Array<{
      university: string;
      count: number;
      popular_courses: Array<{
        title: string;
        degree_type: string;
        field_of_study: string;
      }>;
    }>;
    degree_types: Array<{
      degree_type: string;
      count: number;
      total_tuition: number;
      avg_tuition: number;
      percentage: number;
    }>;
    locations: Array<{
      location: string;
      count: number;
      university_count: number;
      avg_tuition: number;
    }>;
  };
  trends: {
    fields_of_study: Array<{
      field_of_study: string;
      count: number;
      university_count: number;
      degree_types: string[];
      popularity_rank: number;
    }>;
    monthly: Array<{
      period: string;
      count: number;
      sample_courses: Array<{ title: string; university: string }>;
    }>;
  };
  recent_activity: Array<{
    _id: string;
    title: string;
    university: string;
    degree_type: string;
    field_of_study: string;
    duration: string;
    fees: string;
    createdAt: string;
  }>;
  last_updated: string;
}

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

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
