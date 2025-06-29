# Components Organization

This directory contains all React components organized into logical folders for better maintainability and readability.

## Folder Structure

### `/auth` - Authentication Components
- `LoginForm.jsx` - User login form component
- `RegisterForm.jsx` - User registration form component

### `/admin` - Admin-only Components
- `AdminDashboard.jsx` - Main admin dashboard interface
- `AdminInterface.jsx` - Admin interface controls

### `/user` - User Management Components
- `UserForm.jsx` - Form for creating/editing users
- `UserList.jsx` - List component for displaying users
- `UserManagement.jsx` - Complete user management interface
- `UserProfile.jsx` - User profile display component
- `UserProfileSection.jsx` - User profile editing section

### `/common` - Shared/Common Components
- `AlertMessage.jsx` - Reusable alert/message component
- `Header.jsx` - Main application header
- `StudentForm.jsx` - Form for student information
- `StudentList.jsx` - List component for displaying students

### `/debug` - Development/Debug Components
- `DebugPanel.jsx` - General debugging panel
- `RoleDebugPanel.jsx` - Role-specific debugging tools

## Root Components
- `AuthenticatedApp.jsx` - Main component for authenticated users

## Import Path Examples

When importing components from other locations:

```jsx
// From the root src folder (like App.jsx)
import LoginForm from "./components/auth/LoginForm";
import AdminDashboard from "./components/admin/AdminDashboard";

// From within components folder
import Header from "./common/Header";
import UserProfile from "./user/UserProfile";

// From a subfolder to services
import AuthService from "../../services/AuthService";
```

This organization makes it easier to:
- Find specific components quickly
- Understand component relationships
- Maintain and refactor code
- Onboard new developers
