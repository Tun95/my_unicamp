// src/types/dashboard/dashboard.ts
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
  recent_activity: Course[];
  last_updated: string;
}

export interface FilterOptions {
  universities: string[];
  degree_types: string[];
  fields_of_study: string[];
  countries: string[];
  cities: string[];
  tuition_range: {
    minTuition: number;
    maxTuition: number;
  };
}

export interface FilterOptionsResponse {
  data: FilterOptions;
}
