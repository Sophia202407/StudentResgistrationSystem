import { useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const useStudentManagement = (handleLogout) => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all students
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/students`);
      setStudents(response.data);
      setAllStudents(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        throw new Error("Session expired. Please log in again.");
      } else {
        throw new Error("Failed to fetch students. Please ensure the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
      setStudents(allStudents);
    } else {
      const filtered = allStudents.filter(student =>
        student.fullName.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.id.toString().includes(term)
      );
      setStudents(filtered);
    }
  };

  // Handle delete student
  const handleDelete = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete ${studentName}?`)) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/students/${studentId}`);
      
      // Refresh the students list
      await fetchStudents();
      return "Student deleted successfully!";
      
    } catch (err) {
      console.error("Error deleting student:", err);
      
      if (err.response?.status === 401) {
        handleLogout();
        throw new Error("Session expired. Please log in again.");
      } else if (err.response?.status === 403) {
        throw new Error("You don't have permission to delete students.");
      } else if (err.response?.status === 404) {
        throw new Error("Student not found");
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      } else {
        throw new Error("Failed to delete student");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    students,
    allStudents,
    loading,
    searchTerm,
    fetchStudents,
    handleSearch,
    handleDelete
  };
};
