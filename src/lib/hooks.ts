/**
 * React Hooks for API calls
 * Use these in your components for loading states and error handling
 */

"use client";

import { useState, useCallback } from "react";
import type { APIError } from "./types";

export interface UseAPIState<T> {
  data: T | null;
  loading: boolean;
  error: APIError | null;
}

/**
 * Generic hook for API calls
 * Usage:
 *   const { data, loading, error, execute } = useAPI(() => apiClient.get(...));
 */
export function useAPI<T>(
  apiFunction: () => Promise<T>,
  options?: { immediate?: boolean }
) {
  const [state, setState] = useState<UseAPIState<T>>({
    data: null,
    loading: options?.immediate ?? true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await apiFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const error = err as APIError;
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, [apiFunction]);

  return {
    ...state,
    execute,
  };
}

/**
 * Hook for user profile
 */
export function useUserProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const getProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { usersAPI } = await import("./users");
      return await usersAPI.getProfile();
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const { usersAPI } = await import("./users");
      return await usersAPI.updateProfile(data);
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getProfile, updateProfile, loading, error };
}

/**
 * Hook for discovery (universities, departments, majors)
 */
export function useDiscovery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const getUniversities = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { discoveryAPI } = await import("./discovery");
      return await discoveryAPI.getUniversities();
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDepartments = useCallback(async (universityId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { discoveryAPI } = await import("./discovery");
      return await discoveryAPI.getDepartments(universityId);
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMajors = useCallback(async (departmentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { discoveryAPI } = await import("./discovery");
      return await discoveryAPI.getMajors(departmentId);
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getUniversities, getDepartments, getMajors, loading, error };
}

/**
 * Hook for reviews
 */
export function useReviews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const getReviews = useCallback(async (majorId: number) => {
    setLoading(true);
    setError(null);

    try {
      const { reviewsAPI } = await import("./reviews");
      return await reviewsAPI.getReviews(majorId);
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReview = useCallback(
    async (majorId: number, rating: number, difficulty: number, comment: string) => {
      setLoading(true);
      setError(null);

      try {
        const { reviewsAPI } = await import("./reviews");
        return await reviewsAPI.submitReview(majorId, {
          rating,
          difficulty,
          comment,
        });
      } catch (err) {
        const apiError = err as APIError;
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { getReviews, submitReview, loading, error };
}
