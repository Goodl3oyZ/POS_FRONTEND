// API Configuration
export { api } from "./config";

// API Modules - Functions
export * from "./auth";
export * from "./areas";
export * from "./categories";
export * from "./menu-items";
export * from "./modifiers";
export * from "./orders";
export * from "./table-orders";
export * from "./payments";
export * from "./order-payments";
export * from "./permissions";
export * from "./roles";
export * from "./tables";
export * from "./users";

// TypeScript Interfaces for API requests/responses
export type {
  // Auth types
  LoginRequest,
  ChangePasswordRequest,
} from "./auth";

export type {
  // Areas types
  CreateAreaRequest,
  UpdateAreaRequest,
} from "./areas";

export type {
  // Categories types
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./categories";

export type {
  // Menu Items types
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
} from "./menu-items";

export type {
  // Modifiers types
  CreateModifierRequest,
  UpdateModifierRequest,
} from "./modifiers";

export type {
  // Orders types
  OrderItemCamel,
  OrderItemSnake,
  CreateOrderCamel,
  CreateOrderSnake,
} from "./orders";

export type {
  // Payments types
  CreatePaymentRequest,
} from "./payments";

export type {
  // Tables types
  UpdateTableStatusRequest,
} from "./tables";

export type {
  // Users types
  CreateUserRequest,
  UpdateUserRequest,
  AssignRolesRequest,
} from "./users";
