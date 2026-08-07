import { apiClient } from "./client";
import { ApiSuccess, User } from "../types";

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<ApiSuccess<User>>("/auth/login", { email, password });
  return data.data;
}

export async function logout() {
  await apiClient.post("/auth/logout");
}

export async function me() {
  const { data } = await apiClient.get<ApiSuccess<User>>("/auth/me");
  return data.data;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string | null;
  currentPassword?: string;
  newPassword?: string;
}

export async function updateProfile(input: UpdateProfileInput) {
  const { data } = await apiClient.put<ApiSuccess<User>>("/auth/me", input);
  return data.data;
}
