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
  grad_year?: number;
  bio?: string;
}

export interface UserProfileUpdate {
  username?: string;
  major?: string;
  grad_year?: number;
  bio?: string;
}

// ============= ACADEMIC HIERARCHY =============
export interface University {
  university_id: string;
  name: string;
  location: string;
}

export interface Department {
  dept_id: string;
  name: string;
  university_id?: string;
}

export interface Major {
  major_id: number;
  name: string;
  dept_id?: string;
  description?: string;
}

// ============= REVIEWS =============
export interface ReviewInput {
  rating: number; // 1-5
  difficulty: number; // 1-5
  comment: string;
}

export interface Review extends ReviewInput {
  review_id?: number;
  major_id: number;
  user_id?: string;
  username?: string;
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
