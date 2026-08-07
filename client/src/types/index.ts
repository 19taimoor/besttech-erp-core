export interface Role {
  id: number;
  name: string;
  displayName: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  status: "active" | "inactive";
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt?: string;
  role: Role;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiPaginated<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  inventory: {
    totalProducts: number;
    totalWarehouses: number;
    lowStockItems: number;
  };
}
