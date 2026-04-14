/**
 * API Utilities Barrel Export
 * Central point for importing all API utilities
 *
 * Usage Examples:
 * - import { apiClient, usersAPI, discoveryAPI } from "@/lib/api"
 * - import { useDiscovery, useReviews } from "@/lib/hooks"
 */

export { apiClient } from "./client";
export {
  useAPI,
  useUserProfile,
  useDiscovery,
  useReviews,
  type UseAPIState,
} from "./hooks";
export { discoveryAPI } from "./discovery";
export { reviewsAPI } from "./reviews";
export { usersAPI } from "./users";
export { apiConfig } from "./config";
export type {
  RegisterInput,
  LoginInput,
  AuthResponse,
  UserProfile,
  UserProfileUpdate,
  University,
  Department,
  Major,
  ReviewInput,
  Review,
  BulkUploadData,
  APIError,
  APIResponse,
} from "./types";
