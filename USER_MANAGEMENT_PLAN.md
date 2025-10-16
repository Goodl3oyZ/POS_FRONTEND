# User Management Page - Planning Document

## Project Structure Analysis

### Current Architecture

#### 1. **Technology Stack**

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18.2
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui components
- **State Management**: React Context (AuthContext, CartContext)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: Sonner (Toast notifications)

#### 2. **Project File Structure**

```
/Users/pubest/gits/POS_FRONTEND/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout with Sidebar + Topbar
│   │   ├── page.tsx              # Redirects to /menu
│   │   ├── login/
│   │   ├── register/
│   │   ├── menu/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── tables/
│   │   ├── payment/
│   │   ├── history/
│   │   └── settings/             # Settings hub page
│   │       ├── page.tsx          # Main settings with dialog-based navigation
│   │       └── components/       # Setting-specific components
│   │           ├── StoreInformation.tsx
│   │           ├── StaffManagement.tsx (currently placeholder)
│   │           ├── TableManagement.tsx
│   │           ├── MenuManagement.tsx
│   │           ├── PricingDiscounts.tsx
│   │           ├── SalesReports.tsx
│   │           └── Preferences.tsx
│   │
│   ├── components/               # Reusable React components
│   │   ├── Sidebar.tsx           # Main navigation sidebar
│   │   ├── Topbar.tsx            # Top header with user info
│   │   ├── ProtectedRoute.tsx    # Auth guard component
│   │   └── ui/                   # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── table.tsx
│   │       └── ... (other UI components)
│   │
│   └── lib/                      # Utilities and API
│       ├── auth-context.tsx      # Authentication context
│       ├── cart-context.tsx      # Shopping cart context
│       ├── utils.ts              # Utility functions
│       └── api/                  # API integration layer
│           ├── config.ts         # Axios instance configuration
│           ├── index.ts          # API exports
│           ├── auth.ts
│           ├── users.ts          # ✅ Already exists!
│           ├── roles.ts          # ✅ Already exists!
│           ├── permissions.ts
│           └── ... (other API modules)
```

#### 3. **Navigation Structure**

**Current Sidebar Navigation** (`src/components/Sidebar.tsx`):

- Menu (`/menu`)
- Cart (`/cart`)
- Orders (`/orders`)
- Tables (`/tables`)
- Payment (`/payment`)
- History (`/history`)
- Settings (`/settings`)

**Topbar** (`src/components/Topbar.tsx`):

- Brand logo (links to /menu)
- Cart button with item count badge
- User info (when logged in)
- Logout button

#### 4. **Authentication System**

**Auth Context** (`src/lib/auth-context.tsx`):

```typescript
interface AppUser {
  id: string;
  username: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  status: "active" | "inactive" | string;
  roles: string[] | null;
}

interface User {
  user: AppUser;
  permissions: string[];
}
```

**Features**:

- Cookie-based authentication
- User object with roles and permissions
- Login/Logout functionality
- User refresh capability

#### 5. **Existing API Endpoints**

**User Management APIs** (`src/lib/api/users.ts`):

- ✅ `getAllUsers()` - GET `/v1/users`
- ✅ `getUserById(id)` - GET `/v1/users/{id}`
- ✅ `createUser(userData)` - POST `/v1/users`
- ✅ `updateUser(id, userData)` - PUT `/v1/users/{id}`
- ✅ `assignUserRoles(id, rolesData)` - POST `/v1/users/{id}/roles`

**Role APIs** (`src/lib/api/roles.ts`):

- ✅ `getAllRoles()` - GET `/v1/roles`
- ✅ `getRoleById(id)` - GET `/v1/roles/{id}`

**Types Available**:

```typescript
interface CreateUserRequest {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  phone?: string;
  roleIds?: string[];
}

interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  status?: string;
}

interface AssignRolesRequest {
  roleIds: string[];
}
```

#### 6. **Settings Page Pattern**

The current settings page (`src/app/settings/page.tsx`) uses a **card-based hub with modal dialogs**:

**Pattern**:

1. Main page displays categorized cards (Business, Menu & Orders, System)
2. Clicking a card opens a fullscreen dialog
3. Each setting has its own component in `/settings/components/`
4. Dialog overlays the page with the specific setting component

**Current Settings Groups**:

- **Business**: Store Information, ~~Staff Management~~ (commented out), Table Management
- **Menu & Orders**: Menu Management, Pricing & Discounts, ~~Sales Reports~~ (commented out)
- **System**: Preferences

---

## User Management Page Plan

### Option 1: Add to Existing Settings Page (Recommended)

**Pros**:

- Consistent with current UX pattern
- Centralized admin functionality
- Easier to implement
- Better organization

**Implementation**:

1. Uncomment "Staff Management" in settings
2. Replace placeholder component with full User Management
3. Add to "Business" section

### Option 2: Standalone Page

**Pros**:

- Dedicated space for complex user management
- Better for extensive features
- Can add to sidebar navigation

**Implementation**:

1. Create `/app/users/page.tsx`
2. Add to Sidebar navigation
3. Build standalone page with full CRUD interface

**Recommendation**: Start with **Option 1** (Settings integration) as it:

- Matches existing architecture
- Is appropriate for admin functionality
- Can be expanded to standalone later if needed

---

## User Management Component Design

### Component Structure

```
/src/app/settings/components/UserManagement.tsx  (Main component)
/src/components/ui/AddUserDialog.tsx             (Create user modal)
/src/components/ui/EditUserDialog.tsx            (Edit user modal)
/src/components/ui/AssignRolesDialog.tsx         (Role assignment modal)
```

### Features to Implement

#### 1. **User List Table**

- Display all users in a table format
- Columns: Username, Full Name, Email, Phone, Status, Roles, Actions
- Search/filter functionality
- Sorting capabilities
- Pagination (if needed)

#### 2. **Create User**

- Dialog/Modal form
- Fields:
  - Username (required)
  - Password (required)
  - Full Name (optional)
  - Email (optional)
  - Phone (optional)
  - Roles (multi-select)
- Validation
- Success/error notifications

#### 3. **Edit User**

- Similar dialog to create
- Pre-populated fields
- Cannot edit username
- Can update: full name, email, phone, status
- Success/error notifications

#### 4. **Assign/Manage Roles**

- Separate dialog for role management
- Multi-select interface for roles
- Display current roles
- Add/remove roles
- Save changes

#### 5. **User Status Toggle**

- Quick toggle between "active" and "inactive"
- Confirmation for status changes
- Visual indicator (badge/color)

#### 6. **Delete User** (Optional)

- Delete button with confirmation
- Warning about permanent action
- Only if API supports DELETE endpoint

### UI/UX Design Pattern

Following the existing **TableManagement** component pattern:

```tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAllUsers, getAllRoles } from "@/lib/api";
import { toast } from "sonner";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [assigningRolesUser, setAssigningRolesUser] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Component structure:
  // 1. Header with "Add User" button
  // 2. Search/filter bar
  // 3. Users table with columns
  // 4. Action buttons (Edit, Roles, Status, Delete)
  // 5. Dialogs for Add/Edit/Assign Roles

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">User Management</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add User</Button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          {/* Table implementation */}
        </table>
      </div>

      {/* Dialogs */}
      {/* AddUserDialog */}
      {/* EditUserDialog */}
      {/* AssignRolesDialog */}
    </div>
  );
}
```

### Styling Approach

Following user preferences:

- Use Tailwind CSS classes
- Leverage existing UI components (`Button`, `Dialog`, `Input`, `Label`, etc.)
- Semantic HTML
- Avoid inline styles except for positioning/centering when necessary

---

## Implementation Checklist

### Phase 1: Basic Structure

- [ ] Update `/src/app/settings/page.tsx` to uncomment "Staff Management"
- [ ] Rename to "User Management" if preferred
- [ ] Create `/src/app/settings/components/UserManagement.tsx`
- [ ] Set up basic component structure with user table

### Phase 2: Data Fetching

- [ ] Implement `fetchUsers()` using `getAllUsers()` API
- [ ] Implement `fetchRoles()` using `getAllRoles()` API
- [ ] Add loading states
- [ ] Add error handling with toast notifications

### Phase 3: User List Display

- [ ] Create user table with columns
- [ ] Display user data (username, full name, email, phone, status, roles)
- [ ] Add status badges (active/inactive)
- [ ] Add role chips/badges
- [ ] Implement search/filter functionality

### Phase 4: Create User

- [ ] Create `AddUserDialog.tsx` component
- [ ] Build form with validation
- [ ] Integrate with `createUser()` API
- [ ] Add role multi-select dropdown
- [ ] Handle success/error responses
- [ ] Refresh user list after creation

### Phase 5: Edit User

- [ ] Create `EditUserDialog.tsx` component
- [ ] Pre-populate form with user data
- [ ] Integrate with `updateUser()` API
- [ ] Handle success/error responses
- [ ] Refresh user list after update

### Phase 6: Role Management

- [ ] Create `AssignRolesDialog.tsx` component
- [ ] Display current roles
- [ ] Multi-select interface for roles
- [ ] Integrate with `assignUserRoles()` API
- [ ] Handle success/error responses
- [ ] Update user list after role changes

### Phase 7: Status Management

- [ ] Add status toggle button
- [ ] Implement confirmation dialog
- [ ] Update user status via `updateUser()` API
- [ ] Visual feedback for status changes

### Phase 8: Polish & Testing

- [ ] Add loading skeletons
- [ ] Improve error messages
- [ ] Add confirmation dialogs where needed
- [ ] Test all CRUD operations
- [ ] Test edge cases (empty data, API errors, etc.)
- [ ] Mobile responsiveness check

---

## API Integration Notes

### Expected API Response Formats

Based on existing patterns in the codebase:

**Users List Response**:

```typescript
{
  data: [
    {
      id: string;
      username: string;
      full_name: string | null;
      email: string;
      phone: string | null;
      status: "active" | "inactive";
      roles: string[] | Role[];
      created_at?: string;
      updated_at?: string;
    }
  ]
}
```

**Roles List Response**:

```typescript
{
  data: [
    {
      id: string;
      name: string;
      description?: string;
      permissions?: Permission[];
    }
  ]
}
```

### Error Handling Pattern

```typescript
try {
  const response = await createUser(userData);
  toast.success("User created successfully!");
  fetchUsers(); // Refresh list
} catch (error) {
  toast.error(error.response?.data?.message || "Failed to create user");
}
```

---

## Additional Considerations

### 1. **Permissions & Authorization**

- Should certain operations require specific permissions?
- Add permission checks before showing edit/delete buttons
- Use `user.permissions` from AuthContext

### 2. **Role Display**

- Display role names as badges/chips
- Color-code roles (admin = red, manager = blue, staff = gray)
- Handle multiple roles gracefully

### 3. **Search & Filter**

- Client-side search for username, full name, email
- Filter by status (active/inactive)
- Filter by role

### 4. **Pagination**

- Implement if user count is expected to be large
- Use API pagination if backend supports it
- Otherwise, client-side pagination

### 5. **Validation**

- Username: required, min length, no special characters
- Password: required, min length, complexity rules
- Email: valid email format
- Phone: valid phone format

### 6. **User Feedback**

- Toast notifications for all actions (sonner)
- Loading states for async operations
- Empty states when no users exist
- Confirmation dialogs for destructive actions

---

## Next Steps

Once you provide the API endpoint details and response formats, I can:

1. **Implement the UserManagement component**
2. **Create the necessary dialog components**
3. **Add the feature to the Settings page**
4. **Test and refine the implementation**

### Information Needed:

- ✅ API endpoints (already documented in `/src/lib/api/users.ts`)
- ⏳ Exact response format from backend
- ⏳ Any additional user fields to display
- ⏳ Password reset functionality requirement
- ⏳ Permission requirements for different actions
- ⏳ Any specific role management rules

---

## Summary

This POS Frontend is a well-structured Next.js application with:

- Modern tech stack (Next.js 14, Tailwind, Radix UI)
- Clean separation of concerns (pages, components, API, contexts)
- Existing user management APIs ready to use
- Consistent design patterns to follow
- Settings page pattern perfect for admin features

The User Management feature will integrate seamlessly into the existing Settings page, following established patterns for consistency and maintainability.
