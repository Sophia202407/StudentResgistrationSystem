import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const useProfileForm = (currentUser, hasRole, updateCurrentUser, handleLogout) => {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    enrollmentDate: "",
    password: "",
    confirmPassword: ""
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load current user profile data for editing
  const loadCurrentUserProfile = useCallback(() => {
    if (currentUser) {
      // Format enrollment date for input[type="date"]
      let enrollmentDate = "";
      if (currentUser.enrollmentDate) {
        try {
          const date = new Date(currentUser.enrollmentDate);
          enrollmentDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        } catch (error) {
          console.warn("Invalid enrollment date format:", currentUser.enrollmentDate, error);
          enrollmentDate = "";
        }
      }
      
      setForm({
        username: currentUser.username || "",
        fullName: currentUser.fullName || "",
        email: currentUser.email || "",
        enrollmentDate: enrollmentDate,
        password: "", // Never pre-fill password
        confirmPassword: "" // Never pre-fill password confirmation
      });
    }
  }, [currentUser]);

  // Initialize form with current user data for regular users
  useEffect(() => {
    if (currentUser && hasRole('USER') && !hasRole('MODERATOR') && !hasRole('ADMIN')) {
      loadCurrentUserProfile();
    }
  }, [currentUser, hasRole, loadCurrentUserProfile]);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate form data
  const validateForm = () => {
    if (!form.username || !form.username.trim()) {
      throw new Error("Username is required");
    }
    if (form.username.trim().length > 20) {
      throw new Error("Username must be 20 characters or less");
    }
    if (!form.fullName.trim()) {
      throw new Error("Full name is required");
    }
    if (form.fullName.trim().length < 2) {
      throw new Error("Full name must be at least 2 characters long");
    }
    if (form.fullName.trim().length > 100) {
      throw new Error("Full name must not exceed 100 characters");
    }
    if (!form.email.trim()) {
      throw new Error("Email is required");
    }
    if (!form.email.includes("@")) {
      throw new Error("Please enter a valid email address");
    }
    if (form.email.trim().length > 50) {
      throw new Error("Email must not exceed 50 characters");
    }
    if (!form.enrollmentDate) {
      throw new Error("Enrollment date is required");
    }
    
    // Validate password only if provided
    if (form.password && form.password.trim()) {
      if (form.password.trim().length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      
      // Validate password confirmation if password is provided
      if (form.confirmPassword !== form.password) {
        throw new Error("Passwords do not match");
      }
    }
    
    // Check if enrollment date is not in the future
    const enrollmentDate = new Date(form.enrollmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    if (enrollmentDate > today) {
      throw new Error("Enrollment date cannot be in the future");
    }
    
    return true;
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e, fetchStudents) => {
    e.preventDefault();
    
    validateForm();

    try {
      setLoading(true);
      
      // Check if this is a regular user updating their own profile
      if (hasRole('USER') && !hasRole('MODERATOR') && !hasRole('ADMIN')) {
        // Regular user updating their own profile
        const profileData = {
          username: form.username.trim(),
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          enrollmentDate: form.enrollmentDate
        };
        
        // Only include password if provided
        if (form.password && form.password.trim()) {
          profileData.password = form.password.trim();
        }
        
        await axios.put(`${API_BASE_URL}/students/profile`, profileData);
        
        // Update current user data in localStorage (exclude password)
        const updatedUserData = {
          username: profileData.username,
          fullName: profileData.fullName,
          email: profileData.email,
          enrollmentDate: profileData.enrollmentDate
        };
        updateCurrentUser(updatedUserData);
        
        // Clear password field after successful update
        setForm(prev => ({ ...prev, password: "" }));
        
        return "Profile updated successfully!";
        
      } else {
        // Admin/Moderator managing student profiles
        if (editingStudent) {
          // Update existing student
          await axios.put(`${API_BASE_URL}/students/${editingStudent.id}`, form);
          setEditingStudent(null);
          
          // Reset form and refresh list for admin/moderator
          setForm({ username: "", fullName: "", email: "", enrollmentDate: "", password: "" });
          if (fetchStudents) await fetchStudents();
          
          return "Student updated successfully!";
        } else {
          // Add new student
          await axios.post(`${API_BASE_URL}/students`, form);
          
          // Reset form and refresh list for admin/moderator
          setForm({ username: "", fullName: "", email: "", enrollmentDate: "", password: "" });
          if (fetchStudents) await fetchStudents();
          
          return "Student added successfully!";
        }
      }
      
    } catch (err) {
      console.error("Error details:", err);
      
      if (err.response?.status === 401) {
        handleLogout();
        throw new Error("Session expired. Please log in again.");
      } else if (err.response) {
        // Server responded with error status
        if (err.response.status === 400 && err.response.data) {
          throw new Error(err.response.data.message || err.response.data);
        } else if (err.response.status === 403) {
          throw new Error("You don't have permission to perform this action.");
        } else {
          throw new Error(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        throw new Error("No response from server. Please check if the backend is running.");
      } else {
        // Something else happened
        throw new Error(err.message || "Request setup error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setForm({ 
      username: "", 
      fullName: "", 
      email: "", 
      enrollmentDate: "", 
      password: "", 
      confirmPassword: "" 
    });
    setEditingStudent(null);
  };

  return {
    form,
    editingStudent,
    loading,
    handleChange,
    handleSubmit,
    handleCancelEdit,
    setForm,
    setEditingStudent
  };
};
