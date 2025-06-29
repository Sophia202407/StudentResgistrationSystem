import { useState, useEffect, useCallback } from "react";
import AuthService from "../services/AuthService";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = useCallback(() => {
    const user = AuthService.getCurrentUser();
    setIsAuthenticated(true);
    setCurrentUser(user);
    return user;
  }, []);

  const handleLogout = useCallback(() => {
    AuthService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    const hasIt = currentUser?.roles?.includes(`ROLE_${role.toUpperCase()}`);
    return hasIt;
  }, [currentUser]);

  // Toggle between login and register modes
  const toggleAuthMode = useCallback(() => {
    setIsLoginMode(prev => !prev);
  }, []);

  const setAuthMode = useCallback((mode) => {
    setIsLoginMode(mode);
  }, []);

  // Update current user data (useful for profile updates)
  const updateCurrentUser = useCallback((userData) => {
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  }, [currentUser]);

  return {
    // State
    isAuthenticated,
    currentUser,
    isLoginMode,
    
    // Actions
    handleLogin,
    handleLogout,
    hasRole,
    toggleAuthMode,
    setAuthMode,
    updateCurrentUser,
  };
};

export default useAuth;
