import { apiClient } from "./client";
import { ApiSuccess, DashboardStats } from "../types";

export async function getDashboardStats() {
  const { data } = await apiClient.get<ApiSuccess<DashboardStats>>("/dashboard/stats");
  return data.data;
}
