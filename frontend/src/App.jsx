import React from "react";
import axios from "axios";
import "./App-modular.css";

// Import components and services
import AuthService from "./services/AuthService";
import useAuth from "./hooks/useAuth";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import AuthenticatedApp from "./components/AuthenticatedApp";

// Configure axios interceptor for authentication
axios.interceptors.request.use(
  (config) => {
    const user = AuthService.getCurrentUser();
    if (user && user.accessToken) {
      config.headers.Authorization = "Bearer " + user.accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Main App Component
function App() {
  // Use authentication hook
  const {
    isAuthenticated,
    currentUser,
    isLoginMode,
    handleLogin,
    handleLogout,
    hasRole,
    setAuthMode,
    updateCurrentUser
  } = useAuth();

  // If not authenticated, show login/register forms
  if (!isAuthenticated) {
    return isLoginMode ? (
      <LoginForm 
        onLogin={handleLogin} 
        onToggleMode={() => setAuthMode(false)} 
      />
    ) : (
      <RegisterForm 
        onRegister={() => setAuthMode(true)} 
        onToggleMode={() => setAuthMode(true)} 
      />
    );
  }

  // Main authenticated application
  return (
    <AuthenticatedApp
      currentUser={currentUser}
      handleLogout={handleLogout}
      hasRole={hasRole}
      updateCurrentUser={updateCurrentUser}
    />
  );
}

export default App;
