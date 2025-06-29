import React, { useState } from "react";
import AuthService from "../../services/AuthService";

function RegisterForm({ onRegister, onToggleMode }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    enrollmentDate: "",
    role: "user"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await AuthService.register(
        formData.username, 
        formData.email, 
        formData.password, 
        formData.fullName,
        formData.enrollmentDate,
        [formData.role]
      );
      setSuccess("Registration successful! Please log in.");
      setTimeout(() => onToggleMode(), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Student Self-Registration</h2>
        
        {/* Role Information */}
        <div className="role-info">
          <h3>Student Self-Registration</h3>
          <p>Register as a student and provide your information:</p>
          <ul>
            <li><strong>User:</strong> Student account (manage your own profile)</li>
            <li><strong>Moderator:</strong> Student with moderation privileges</li>
            <li><strong>Admin:</strong> Student with administrative access</li>
          </ul>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              minLength="6"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label>Enrollment Date</label>
            <input
              type="date"
              value={formData.enrollmentDate}
              onChange={(e) => setFormData({...formData, enrollmentDate: e.target.value})}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="form-input"
            >
              <option value="user">User (Student with basic access)</option>
              <option value="mod">Moderator (Student with moderation privileges)</option>
              <option value="admin">Admin (Student with administrative access)</option>
            </select>
            <small className="form-help">
              Choose your role based on the permissions you need
            </small>
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        
        <p className="auth-toggle">
          Already have an account? 
          <button onClick={onToggleMode} className="btn-link">Login here</button>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
