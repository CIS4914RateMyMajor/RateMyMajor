/**
 * User Profile API Endpoints
 * Works with Next.js server actions for profile management
 */

import { apiClient } from "./client";
import type { UserProfile, UserProfileUpdate } from "./types";

export const usersAPI = {
  /**
   * Get the current user's profile
   * Requires authentication (BetterAuth)
   */
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>("/api/user/profile");
  },

  /**
   * Update the current user's profile
   * Requires authentication (BetterAuth)
   */
  async updateProfile(data: UserProfileUpdate): Promise<UserProfile> {
    return apiClient.patch<UserProfile>("/api/user/profile", data);
  },
};
