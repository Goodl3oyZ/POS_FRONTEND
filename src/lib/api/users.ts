import { api } from "./config";

// Types
export interface CreateUserRequest {
  username: string;
  password: string;
  full_name?: string;
  email?: string;
  phone?: string;
  status?: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  email?: string;
  phone?: string;
  status?: string;
}

export interface AssignRolesRequest {
  role_id: number;
}

/**
 * Get all users in the system
 * @returns Promise containing list of all users
 */
export async function getAllUsers() {
  return api.get("/v1/users");
}

/**
 * Get specific user by ID
 * @param id - User ID to retrieve
 * @returns Promise containing user data
 */
export async function getUserById(id: string) {
  return api.get(`/v1/users/${id}`);
}

/**
 * Create a new user
 * @param userData - User information to create
 * @returns Promise containing created user data
 */
export async function createUser(userData: CreateUserRequest) {
  return api.post("/v1/users", userData);
}

/**
 * Update existing user by ID
 * @param id - User ID to update
 * @param userData - Updated user information
 * @returns Promise containing updated user data
 */
export async function updateUser(id: string, userData: UpdateUserRequest) {
  return api.put(`/v1/users/${id}`, userData);
}

/**
 * Assign roles to a user
 * @param id - User ID to assign roles to
 * @param rolesData - Roles to assign to the user
 * @returns Promise containing user with assigned roles
 */
export async function assignUserRoles(
  id: string,
  rolesData: AssignRolesRequest
) {
  return api.post(`/v1/users/${id}/roles`, rolesData);
}
