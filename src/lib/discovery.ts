/**
 * Discovery API Endpoints
 * Universities, Departments, and Majors
 */

import { apiClient } from "./client";
import type { University, Department, Major } from "./types";

export const discoveryAPI = {
  /**
   * Get all universities
   */
  async getUniversities(): Promise<University[]> {
    return apiClient.get<University[]>("/api/universities");
  },

  /**
   * Get departments for a specific university
   */
  async getDepartments(universityId: string): Promise<Department[]> {
    return apiClient.get<Department[]>(
      `/api/universities/${universityId}/departments`
    );
  },

  /**
   * Get majors for a specific department
   */
  async getMajors(departmentId: string): Promise<Major[]> {
    return apiClient.get<Major[]>(`/api/departments/${departmentId}/majors`);
  },
};
