// src/services/courseService.ts
import axios from "axios";
import { DashboardOverview } from "../types/dashboard/dashboard";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class CourseService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  // Get comprehensive dashboard overview
  async getDashboardOverview(): Promise<DashboardOverview> {
    try {
      const response = await this.api.get("/api/admin/dashboard/overview");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching dashboard overview:", error);
      throw error;
    }
  }
}

export const courseService = new CourseService();
