import React, { useState } from "react";

function UserForm({ loading, onSuccess, onError, onUserAdded }) {
  const [form, setForm] = useState({
    fullName: "",
    userName: "",
    password: "",
    email: "",
    enrollmentDate: new Date().toISOString().split('T')[0],
    roles: ["user"]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setForm(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, value]
        : prev.roles.filter(role => role !== value)
    }));
  };

  const validateForm = () => {
    if (!form.username.trim()) {
      onError("Username is required");
      return false;
    }
    if (!form.email.trim()) {
      onError("Email is required");
      return false;
    }
    if (!form.password.trim() || form.password.length < 6) {
      onError("Password must be at least 6 characters long");
      return false;
    }
    if (!form.fullName.trim()) {
      onError("Full name is required");
      return false;
    }
    if (!form.enrollmentDate) {
      onError("Enrollment date is required");
      return false;
    }
    if (form.roles.length === 0) {
      onError("At least one role must be selected");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(() => {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            return user.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {};
          })()
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        onSuccess("User created successfully! Switching to User Management...");
        setForm({
          fullName: "",
          userName: "",
          password: "",
          email: "",
          enrollmentDate: new Date().toISOString().split('T')[0],
          roles: ["user"]
        });
        
        // Redirect to user management page after a short delay
        if (onUserAdded) {
          setTimeout(() => {
            onUserAdded();
          }, 1500);
        }
      } else {
        const errorData = await response.text();
        onError(errorData || "Failed to create user");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      onError("Failed to create user. Please ensure the backend is running.");
    }
  };

  return (
    <div className="user-form-section">
      <div className="form-section">
        <h2>Add New User</h2>
        <p>Create a new user account in the system.</p>
        
        <form onSubmit={handleSubmit} className="user-form compact-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name*</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter full name"
              value={form.fullName}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="userName">User Name*</label>
            <input
              id="userName"
              name="userName"
              type="text"
              placeholder="Enter username"
              value={form.userName}
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
            <label htmlFor="password">Password*</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password (min 6 characters)"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
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

          <div className="form-group">
            <label>Roles*</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  value="user"
                  checked={form.roles.includes("user")}
                  onChange={handleRoleChange}
                />
                <span>User</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  value="moderator"
                  checked={form.roles.includes("moderator")}
                  onChange={handleRoleChange}
                />
                <span>Moderator</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  value="admin"
                  checked={form.roles.includes("admin")}
                  onChange={handleRoleChange}
                />
                <span>Admin</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Creating..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;
