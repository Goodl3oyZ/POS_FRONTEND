# User Management - Visual Guide

## 🎯 Navigation Flow

```
Main App
  └── Sidebar
      └── Settings (Click)
          └── Settings Page
              └── Business Section
                  └── User Management Card (Click)
                      └── User Management Dialog Opens ✨
```

## 📱 UI Layout

### Settings Page - User Management Card

```
┌─────────────────────────────────────────────────┐
│ Settings                                        │
│ Manage your restaurant settings and preferences │
├─────────────────────────────────────────────────┤
│                                                 │
│ Business                                        │
│ ┌─────────────┐ ┌─────────────┐ ┌────────────┐│
│ │ 🏪 Store    │ │ 👥 User     │ │ 🪑 Table   ││
│ │ Information │ │ Management  │ │ Management ││
│ │ [Manage]    │ │ [Manage]    │ │ [Manage]   ││
│ └─────────────┘ └─────────────┘ └────────────┘│
│                                                 │
└─────────────────────────────────────────────────┘
```

### User Management Table View (Fullscreen Dialog)

```
┌──────────────────────────────────────────────────────────────────────┐
│ User Management                             [+ Add User]             │
│ Manage user accounts and their roles                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ ┌────────────────────────────────────────────────────────────────┐ │
│ │ Username │ Full Name      │ Email           │ Phone        │... │ │
│ ├──────────┼────────────────┼─────────────────┼──────────────┼────┤ │
│ │ admin    │ John Doe Doe   │ john@example.cm │ 081-234-5678 │... │ │
│ │ owner    │ Owner          │ owner@example.cm│ -            │... │ │
│ │ waiter1  │ สมศักดิ์ ทำงาน│ waiter1@ex...   │ 083-456-7890 │... │ │
│ │ cashier1 │ สมหญิง ใจดี    │ cashier1@ex...  │ 082-345-6789 │... │ │
│ └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

... Status │ Roles                    │ Actions                    │
────────────┼──────────────────────────┼────────────────────────────┤
... Active │ [Manager]                │ [Edit] [Deactivate]        │
... Active │ [Owner]                  │ [Edit] [Deactivate]        │
... Active │ [Waiter]                 │ [Edit] [Deactivate]        │
... Active │ [Cashier]                │ [Edit] [Deactivate]        │
────────────────────────────────────────────────────────────────────┘
```

## 🎨 Color-Coded Role Badges

| Role    | Badge Color | Example      |
| ------- | ----------- | ------------ |
| Owner   | Red         | `🔴 owner`   |
| Manager | Blue        | `🔵 manager` |
| Cashier | Purple      | `🟣 cashier` |
| Kitchen | Orange      | `🟠 kitchen` |
| Waiter  | Green       | `🟢 waiter`  |

## 📋 Add User Dialog

```
┌──────────────────────────────────────┐
│ Add New User                    [×]  │
│ Create a new user account            │
├──────────────────────────────────────┤
│                                      │
│ Username *                           │
│ ┌──────────────────────────────────┐ │
│ │ Enter username                   │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Password *                           │
│ ┌──────────────────────────────┬───┐ │
│ │ Enter password               │👁️ │ │
│ └──────────────────────────────┴───┘ │
│                                      │
│ Full Name                            │
│ ┌──────────────────────────────────┐ │
│ │ Enter full name                  │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Email *                              │
│ ┌──────────────────────────────────┐ │
│ │ user@example.com                 │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Phone                                │
│ ┌──────────────────────────────────┐ │
│ │ 081-234-5678                     │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ℹ️ Note: Roles can be assigned      │
│    after the user is created.        │
│                                      │
│              [Cancel] [Create User]  │
└──────────────────────────────────────┘
```

## ✏️ Edit User Dialog

```
┌──────────────────────────────────────┐
│ Edit User                       [×]  │
│ Update user information for admin    │
├──────────────────────────────────────┤
│                                      │
│ Username                             │
│ ┌──────────────────────────────────┐ │
│ │ admin (disabled)                 │ │
│ └──────────────────────────────────┘ │
│ Username cannot be changed           │
│                                      │
│ Full Name                            │
│ ┌──────────────────────────────────┐ │
│ │ John Doe Doe                     │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Email                                │
│ ┌──────────────────────────────────┐ │
│ │ john.doe@example.com             │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Phone                                │
│ ┌──────────────────────────────────┐ │
│ │ 0812345678                       │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Current Roles                        │
│ ┌──────────────────────────────────┐ │
│ │ [🔵 manager]                     │ │
│ └──────────────────────────────────┘ │
│ Role management will be available    │
│ soon                                 │
│                                      │
│         [Cancel] [Save Changes]      │
└──────────────────────────────────────┘
```

## 🔄 User Interactions

### 1. View All Users

- Navigate to Settings → User Management
- See table with all users from the API
- Each row shows: username, full name, email, phone, status, roles

### 2. Add New User

```
Click [+ Add User]
  → Dialog opens
  → Fill form (username, password, email, etc.)
  → Click [Create User]
  → ✅ Success toast "User created successfully!"
  → Dialog closes
  → Table refreshes with new user
```

### 3. Edit User

```
Click [Edit] on any row
  → Edit dialog opens with user data
  → Modify fields (full name, email, phone)
  → Click [Save Changes]
  → ✅ Success toast "User updated successfully!"
  → Dialog closes
  → Table refreshes
```

### 4. Deactivate/Activate User

```
Click [Deactivate] on active user
  → Confirmation dialog appears
  → "Are you sure you want to deactivate user 'username'?"
  → Confirm
  → ✅ Success toast "User deactivated successfully!"
  → Table refreshes
  → Button changes to [Activate]
  → Status badge changes to gray "inactive"
```

## 🎯 User Status Visual Indicators

| Status   | Badge         | Button Action        |
| -------- | ------------- | -------------------- |
| Active   | `🟢 active`   | [Deactivate] (Red)   |
| Inactive | `⚫ inactive` | [Activate] (Outline) |

## 📊 Example User Table Data

```
┌──────────┬─────────────────┬───────────────────────┬──────────────┬────────┬─────────────┬────────────────────┐
│ Username │ Full Name       │ Email                 │ Phone        │ Status │ Roles       │ Actions            │
├──────────┼─────────────────┼───────────────────────┼──────────────┼────────┼─────────────┼────────────────────┤
│ admin    │ John Doe Doe    │ john.doe@example.com  │ 0812345678   │ active │ manager     │ Edit | Deactivate  │
│ owner    │ Owner           │ owner@example.com     │ -            │ active │ owner       │ Edit | Deactivate  │
│ manager1 │ สมชาย จิตดี     │ manager1@example.com  │ 081-234-5678 │ active │ manager     │ Edit | Deactivate  │
│ cashier1 │ สมหญิง ใจดี     │ cashier1@example.com  │ 082-345-6789 │ active │ cashier     │ Edit | Deactivate  │
│ kitchen1 │ สมคิด ทำอาหาร   │ kitchen1@example.com  │ 085-678-9012 │ active │ kitchen     │ Edit | Deactivate  │
│ waiter1  │ สมศักดิ์ ทำงาน  │ waiter1@example.com   │ 083-456-7890 │ active │ waiter      │ Edit | Deactivate  │
│ waiter2  │ สมพร รักงาน     │ waiter2@example.com   │ 084-567-8901 │ active │ waiter      │ Edit | Deactivate  │
└──────────┴─────────────────┴───────────────────────┴──────────────┴────────┴─────────────┴────────────────────┘
```

## 🔔 Toast Notifications

| Action                  | Message                          | Type               |
| ----------------------- | -------------------------------- | ------------------ |
| Create User Success     | "User created successfully!"     | ✅ Success (Green) |
| Update User Success     | "User updated successfully!"     | ✅ Success (Green) |
| Activate User Success   | "User activated successfully!"   | ✅ Success (Green) |
| Deactivate User Success | "User deactivated successfully!" | ✅ Success (Green) |
| Load Users Error        | "Failed to load users"           | ❌ Error (Red)     |
| Create User Error       | "Failed to create user"          | ❌ Error (Red)     |
| Update User Error       | "Failed to update user"          | ❌ Error (Red)     |

## 🎨 Design Principles Used

✅ **Consistent with existing patterns**

- Follows TableManagement component structure
- Uses same dialog-based navigation as Settings page
- Matches button styles and spacing

✅ **User preferences respected**

- Tailwind CSS for all styling
- shadcn/ui components (Button, Dialog, Input, Label)
- Semantic HTML structure
- No manual inline styles
- Color-coded badges for visual clarity

✅ **Responsive Design**

- Table scrolls on mobile devices
- Dialogs are mobile-friendly
- Buttons stack appropriately on small screens

✅ **Accessibility**

- Proper form labels
- Required field indicators
- Loading states for async operations
- Confirmation dialogs for destructive actions

## 📂 File Structure

```
src/
├── app/
│   └── settings/
│       ├── page.tsx                    ← Updated (added User Management)
│       └── components/
│           └── UserManagement.tsx      ← New (Main component)
└── components/
    └── ui/
        ├── AddUserDialog.tsx           ← New (Create user)
        └── EditUserDialog.tsx          ← New (Update user)
```

## ✨ Summary

The User Management feature provides a complete, production-ready interface for managing users with:

- 📊 Clean table view of all users
- ➕ Add new users with validation
- ✏️ Edit existing user information
- 🔄 Toggle user active/inactive status
- 🎨 Color-coded role badges
- 🔔 Toast notifications for all actions
- 📱 Responsive design
- ♿ Accessible forms and interactions

**Status**: ✅ Complete and ready for API integration!
