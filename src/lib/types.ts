/**
 * API Types and Schemas
 */

// ============= AUTHENTICATION =============
export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

// ============= USER PROFILE =============
export interface UserProfile {
  username: string;
  email: string;
  major?: string;
  college?: string;
  gpa?: string;
  grad_year?: number;
  bio?: string;
  image?: string | null;
}

export interface UserProfileUpdate {
  username?: string;
  major?: string;
  college?: string;
  gpa?: string;
  grad_year?: number;
  bio?: string;
  image?: string | null;
}

// ============= ACADEMIC HIERARCHY =============
export interface University {
  id: number;
  name: string;
  location: string | null;
  department_count?: number;
  major_count?: number;
}

export interface Department {
  id: number;
  name: string;
  university_id?: number;
  major_count?: number;
}

export interface Major {
  id: number;
  name: string;
  type?: string | null;
  dept_id?: number;
  department_name?: string;
  university_name?: string;
}

// ============= REVIEWS =============
export interface ReviewInput {
  rating: number; // 1-5
  difficulty: number; // 1-5
  comment: string;
  major_status?: string | null;
}

export interface Review extends ReviewInput {
  review_id?: number;
  major_id: number;
  user_id?: string;
  username?: string;
  major_status?: string | null;
  review_status?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ============= ADMIN =============
export interface BulkUploadData {
  university_name: string;
  location: string;
  departments: Array<{
    name: string;
    majors: string[];
  }>;
}

// ============= API ERRORS =============
export interface APIError {
  status: number;
  message: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

// ============= API RESPONSE WRAPPER =============
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
}
