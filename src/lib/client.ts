/**
 * API Client
 * Simplified HTTP client for Next.js frontend API calls
 * Auth is handled by BetterAuth - this client is for general data fetching
 */

import type { APIError } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type HTTPMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Make HTTP request with error handling
   * BetterAuth cookies are automatically sent by the browser
   */
  private async request<T>(
    endpoint: string,
    method: HTTPMethod = "GET",
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const url = new URL(endpoint, this.baseURL).toString();
    const timeout = options?.timeout || 30000;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const config: RequestInit = {
      method,
      headers,
      credentials: "include", // Include BetterAuth cookies
      ...options,
      signal: controller.signal,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Handle 401 - User needs to login
      if (response.status === 401) {
        throw {
          status: 401,
          message: "Unauthorized. Please login.",
        } as APIError;
      }

      // Parse response
      let data: unknown;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error: APIError = {
          status: response.status,
          message: (data as any)?.message || response.statusText,
          detail: (data as any)?.detail,
          errors: (data as any)?.errors,
        };
        throw error;
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof TypeError && error.message.includes("aborted")) {
        throw {
          status: 0,
          message: "Request timeout",
        } as APIError;
      }

      if (error && typeof error === "object" && "status" in error) {
        throw error;
      }

      // Network error or other error
      throw {
        status: 0,
        message: error instanceof Error ? error.message : "Network error",
      } as APIError;
    }
  }

  /**
   * Generic GET request
   */
  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "GET", undefined, options);
  }

  /**
   * Generic POST request
   */
  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "POST", body, options);
  }

  /**
   * Generic PATCH request
   */
  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "PATCH", body, options);
  }

  /**
   * Generic PUT request
   */
  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "PUT", body, options);
  }

  /**
   * Generic DELETE request
   */
  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "DELETE", undefined, options);
  }
}

/**
 * Singleton instance of API client
 */
export const apiClient = new APIClient();
