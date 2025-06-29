import React from "react";
import UserProfile from "./UserProfile";

function UserProfileSection({ 
  currentUser, 
  form, 
  loading, 
  editingStudent,
  onSubmit, 
  onChange, 
  onCancelEdit 
}) {
  return (
    <div className="user-profile-section">
      <div className="profile-header">
        <h2>My Student Profile</h2>
        <p>Welcome, {currentUser.username}! Manage your student profile below.</p>
      </div>
      
      {/* View Profile */}
      <UserProfile currentUser={currentUser} />

      {/* Update Profile Form */}
      <div className="form-section">
        <h3>Update My Profile</h3>
        <form onSubmit={onSubmit} className="student-form">
          <div className="form-group">
            <label htmlFor="username">Username* (max 20 characters)</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={form.username || ""}
              onChange={onChange}
              required
              maxLength={20}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name*</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password (optional, min 6 characters)</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter new password (leave blank to keep current)"
              value={form.password || ""}
              onChange={onChange}
              minLength={6}
              className="form-input"
            />
            <small className="form-help">Leave blank to keep your current password</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={form.confirmPassword || ""}
              onChange={onChange}
              className="form-input"
            />
            <small className="form-help">Must match new password if changing password</small>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Updating..." : "Update Profile"}
            </button>
            {editingStudent && (
              <button 
                type="button" 
                onClick={onCancelEdit} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserProfileSection;
