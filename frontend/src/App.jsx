import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "http://localhost:8080/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", enrollmentDate: "" });
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allStudents, setAllStudents] = useState([]);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setStudents(response.data);
      setAllStudents(response.data);
      setError("");
    } catch {
      setError("Failed to fetch students. Please ensure the backend is running.");
      setStudents([]);
      setAllStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate form data
  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!form.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!form.enrollmentDate) {
      setError("Enrollment date is required");
      return false;
    }
    return true;
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      if (editingStudent) {
        // Update existing student
        await axios.put(`${API_BASE_URL}/${editingStudent.id}`, form);
        setSuccess("Student updated successfully!");
        setEditingStudent(null);
      } else {
        // Add new student
        await axios.post(API_BASE_URL, form);
        setSuccess("Student added successfully!");
      }
      
      // Reset form and refresh list
      setForm({ name: "", email: "", enrollmentDate: "" });
      await fetchStudents();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error("Error details:", err);
      let errorMessage = "An unexpected error occurred";
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 400 && err.response.data) {
          errorMessage = err.response.data.message || err.response.data;
        } else {
          errorMessage = `Server error: ${err.response.status}`;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check if the backend is running.";
      } else {
        // Something else happened
        errorMessage = err.message || "Request setup error";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      enrollmentDate: student.enrollmentDate
    });
    setEditingStudent(student);
    setError("");
    setSuccess("");
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setForm({ name: "", email: "", enrollmentDate: "" });
    setEditingStudent(null);
    setError("");
    setSuccess("");
  };

  // Clear error message
  const clearError = () => {
    setError("");
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
      setStudents(allStudents);
    } else {
      const filtered = allStudents.filter(student =>
        student.name.toLowerCase().includes(term) ||
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
      setError("");
      
      await axios.delete(`${API_BASE_URL}/${studentId}`);
      setSuccess("Student deleted successfully!");
      
      // Refresh the students list
      await fetchStudents();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error("Error deleting student:", err);
      let errorMessage = "Failed to delete student";
      
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = "Student not found";
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <header className="app-header">
          <h1>Student Registration System</h1>
          <p>Manage student enrollments efficiently</p>
        </header>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success">
            <span>{success}</span>
            <button onClick={() => setSuccess("")} className="alert-close">×</button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
            <button onClick={clearError} className="alert-close">×</button>
          </div>
        )}

        {/* Student Form */}
        <div className="form-section">
          <h2>{editingStudent ? "Edit Student" : "Add New Student"}</h2>
          <form onSubmit={handleSubmit} className="student-form">
            <div className="form-group">
              <label htmlFor="name">Full Name*</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter student's full name"
                value={form.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address*</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="enrollmentDate">Enrollment Date*</label>
              <input
                id="enrollmentDate"
                name="enrollmentDate"
                type="date"
                value={form.enrollmentDate}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Processing..." : editingStudent ? "Update Student" : "Add Student"}
              </button>
              
              {editingStudent && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Students List */}
        <div className="list-section">
          <div className="section-header">
            <h2>Registered Students ({students.length})</h2>
            <div className="header-actions">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>
              <button 
                onClick={fetchStudents} 
                disabled={loading}
                className="btn btn-outline"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {loading && !students.length ? (
            <div className="loading-message">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              <p>No students registered yet.</p>
              <p>Add your first student using the form above.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Enrollment Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className={editingStudent?.id === student.id ? "editing" : ""}>
                      <td>#{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{new Date(student.enrollmentDate).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(student)}
                            className="btn btn-small btn-edit"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id, student.name)}
                            className="btn btn-small btn-delete"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;