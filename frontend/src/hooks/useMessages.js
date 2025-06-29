import { useState, useCallback } from "react";

export const useMessages = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const showSuccess = useCallback((message) => {
    setSuccess(message);
    setError("");
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(""), 3000);
  }, []);

  const showError = useCallback((message) => {
    setError(message);
    setSuccess("");
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess("");
  }, []);

  const clearAll = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  return {
    error,
    success,
    showSuccess,
    showError,
    clearError,
    clearSuccess,
    clearAll
  };
};
