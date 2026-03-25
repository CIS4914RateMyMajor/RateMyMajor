/**
 * API Configuration
 * For Next.js + BetterAuth + Drizzle setup
 */

export const apiConfig = {
  // API Base URL - Points to your Next.js /api routes
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",

  // API endpoints (Next.js routes)
  endpoints: {
    // Discovery
    discovery: {
      universities: "/api/universities",
      departments: "/api/universities/{uni_id}/departments",
      majors: "/api/departments/{dept_id}/majors",
    },
    // Reviews
    reviews: {
      list: "/api/majors/{major_id}/reviews",
      create: "/api/majors/{major_id}/reviews",
    },
    // User Profile
    user: {
      profile: "/api/user/profile",
    },
  },

  // Request settings
  request: {
    timeout: 30000, // 30 seconds
    retries: 1,
  },

  // Error messages
  errors: {
    NETWORK: "Network error. Please check your connection.",
    TIMEOUT: "Request timeout. Please try again.",
    UNAUTHORIZED: "Please login to continue.",
    FORBIDDEN: "You don't have permission to do this.",
    NOT_FOUND: "Resource not found.",
    SERVER_ERROR: "Server error. Please try again later.",
  },
};
