import { apiClient } from "./client";
import { ApiSuccess, Role } from "../types";

export async function listRoles() {
  const { data } = await apiClient.get<ApiSuccess<Role[]>>("/roles");
  return data.data;
}
