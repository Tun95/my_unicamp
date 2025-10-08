export interface LanguageTest {
  test_type: string;
  minimum_score: string;
}

export interface TuitionFee {
  amount: number;
  currency: string;
  period: "per_year" | "per_semester" | "total_course";
}

export interface EntryRequirements {
  minimum_gpa?: number;
  language_tests: LanguageTest[];
  prerequisites: string[];
}

export interface Course {
  _id: string;
  title: string;
  university: string;
  duration: string;
  location: string;
  fees: string;
  description: string;
  degree_type: "Bachelor" | "Master" | "PhD" | "Diploma" | "Certificate";
  field_of_study: string;
  intake_months: string[];
  application_deadline?: Date;
  language: string;
  tuition_fee: TuitionFee;
  entry_requirements: EntryRequirements;
  website_url?: string;
  contact_email?: string;
  is_active: boolean;
}

export interface CourseFilters {
  degree_type: string;
  field_of_study: string;
  location: string;
  duration: string;
  intake_month: string;
  min_tuition: string;
  max_tuition: string;
}
