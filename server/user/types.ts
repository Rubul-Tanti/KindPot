export type UserRole = "ADMIN" | "SUBSCRIBER" | "VIEWER";

export interface User {
  id: string;
  publicId: string;
  email: string;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  profilePicture: string | null;
  phoneNumber: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetUsersResponse {
  message: string;
  data: User[];
  pagination: Pagination;
}

export interface RecentUser {
  id: string;
  publicId: string;
  email: string;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  profilePicture: string | null;
  phoneNumber: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface GetRecentUsersResponse {
  message: string;
  data: RecentUser[];
}