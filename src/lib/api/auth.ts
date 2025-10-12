import { api } from "./config";

// Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

/**
 * Authenticate user with username and password
 * @param loginData - User credentials for authentication
 * @returns Promise containing authentication response
 */
export async function loginUser(loginData: LoginRequest) {
  return api.post("/v1/auth/login", loginData);
}

/**
 * Logout current user session
 * @returns Promise containing logout response
 */
export async function logoutUser() {
  return api.post("/v1/auth/logout");
}

/**
 * Change user password
 * @param changePasswordData - Current and new password data
 * @returns Promise containing password change response
 */
export async function changePassword(
  changePasswordData: ChangePasswordRequest
) {
  return api.post("/v1/auth/change-password", changePasswordData);
}

/**
 * Get current authenticated user information
 * @returns Promise containing current user data
 */
export async function getCurrentUser() {
  return api.get("/v1/auth/me");
}
