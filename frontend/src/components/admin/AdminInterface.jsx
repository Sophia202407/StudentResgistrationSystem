import React from "react";

function AdminInterface({ 
  form, 
  loading, 
  editingStudent,
  onSubmit, 
  onChange, 
  onCancelEdit 
}) {
  return (
    <div className="admin-interface">
      <div className="form-section">
        <h2>Student Management</h2>
        <p>Manage student profiles in the system.</p>
        
        <form onSubmit={onSubmit} className="student-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name*</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter student's full name"
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

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Processing..." : (editingStudent ? "Update Student" : "Add Student")}
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

export default AdminInterface;
