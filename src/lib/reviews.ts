/**
 * Reviews API Endpoints
 */

import { apiClient } from "./client";
import type { Review, ReviewInput } from "./types";

export const reviewsAPI = {
  /**
   * Get all reviews for a major
   */
  async getReviews(majorId: number): Promise<Review[]> {
    return apiClient.get<Review[]>(`/api/majors/${majorId}/reviews`);
  },

  /**
   * Submit a new review for a major
   * Requires authentication (BetterAuth)
   */
  async submitReview(majorId: number, input: ReviewInput): Promise<Review> {
    return apiClient.post<Review>(`/api/majors/${majorId}/reviews`, input);
  },
};
