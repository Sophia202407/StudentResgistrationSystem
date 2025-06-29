# Student Registration System Frontend

A React-based frontend for the Student Registration System built with Vite. This application provides a clean, modular interface for student self-registration and profile management.

## Architecture

The frontend follows a modular architecture with clearly separated components and services:

### Components (`src/components/`)
- **LoginForm.jsx** - User authentication form
- **RegisterForm.jsx** - Student self-registration form with role selection
- **StudentList.jsx** - Admin/Moderator interface for viewing and managing student profiles
- **Header.jsx** - Application header component
- **AlertMessage.jsx** - Reusable alert/notification component
- **UserProfile.jsx** - User profile management component
- **AdminDashboard.jsx** - Administrative dashboard
- **DebugPanel.jsx** - Development debugging utilities

### Services (`src/services/`)
- **AuthService.js** - Authentication and authorization service with JWT token management

### Main Application
- **App.jsx** - Main application component that orchestrates authentication flow and role-based interfaces
- **main.jsx** - Application entry point
- **App.css** - Application styles

## Features

- **Role-Based Access Control**: Different interfaces for Users, Moderators, and Admins
- **JWT Authentication**: Secure token-based authentication with automatic token refresh
- **Student Self-Registration**: Students can register themselves with role selection
- **Profile Management**: Users can update their own profiles
- **Admin Interface**: Admins and Moderators can manage all student profiles
- **Search and Filter**: Search students by name, email, or ID
- **Responsive Design**: Modern, mobile-friendly UI

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Technology Stack

- **React 18** - UI library
- **Vite** - Build tool and development server
- **Axios** - HTTP client for API communication
- **ESLint** - Code linting and quality assurance
