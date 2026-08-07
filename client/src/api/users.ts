import { apiClient } from "./client";
import { ApiPaginated, ApiSuccess, User } from "../types";

export interface ListUsersParams {
  search?: string;
  role?: string;
  status?: "active" | "inactive";
  page?: number;
  per_page?: number;
  sort?: string;
  direction?: "asc" | "desc";
}

export async function listUsers(params: ListUsersParams) {
  const { data } = await apiClient.get<ApiPaginated<User>>("/users", { params });
  return data;
}

export async function getUser(id: number) {
  const { data } = await apiClient.get<ApiSuccess<User>>(`/users/${id}`);
  return data.data;
}

export interface UserFormInput {
  name: string;
  email: string;
  password?: string;
  roleId: number;
  phone?: string | null;
  status?: "active" | "inactive";
}

export async function createUser(input: UserFormInput) {
  const { data } = await apiClient.post<ApiSuccess<User>>("/users", input);
  return data.data;
}

export async function updateUser(id: number, input: Partial<UserFormInput>) {
  const { data } = await apiClient.put<ApiSuccess<User>>(`/users/${id}`, input);
  return data.data;
}

export async function deleteUser(id: number) {
  await apiClient.delete(`/users/${id}`);
}

export async function setUserStatus(id: number, status: "active" | "inactive") {
  const { data } = await apiClient.patch<ApiSuccess<User>>(`/users/${id}/status`, { status });
  return data.data;
}
