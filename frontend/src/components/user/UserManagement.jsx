import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../services/AuthService";

function UserManagement({ hasRole, currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    fullName: "",
    enrollmentDate: "",
    roles: []
  });

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      // Add cache busting parameter to ensure fresh data
      const response = await axios.get(`${API_BASE_URL}/students?_t=${Date.now()}`);
      console.log("Fetched users from API:", response.data);
      
      // Log each user's roles for debugging
      response.data.forEach(user => {
        console.log(`User ${user.username} has roles:`, user.roles);
        console.log(`User ${user.username} enrollment date:`, user.enrollmentDate);
      });
      
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.response?.status === 403) {
        setError("You don't have permission to view users.");
      } else if (err.response?.status === 404) {
        setError("User endpoint not found. Please check backend configuration.");
      } else {
        setError("Failed to fetch users. Please ensure the backend is running.");
      }
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since this function doesn't depend on any changing values

  useEffect(() => {
    // Check if user has ADMIN role directly to avoid function dependency
    if (currentUser?.roles?.includes('ROLE_ADMIN')) {
      fetchUsers();
    }
  }, [currentUser?.id, currentUser?.roles, fetchUsers]); // fetchUsers is now stable

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.fullName?.toLowerCase().includes(term) ||
        user.roles?.some(role => role.toLowerCase().includes(term))
      );
      setFilteredUsers(filtered);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user ${username}? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/students/${userId}`);
      setSuccess(`User ${username} deleted successfully!`);
      await fetchUsers();
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Error deleting user:", err);
      if (err.response?.status === 403) {
        setError("You cannot delete this user.");
      } else {
        setError("Failed to delete user.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    
    // Convert roles to simple string array for easier handling
    let userRoles = [];
    if (user.roles && Array.isArray(user.roles)) {
      userRoles = user.roles.map(role => {
        // Handle both string and object role formats
        if (typeof role === 'string') {
          return role;
        } else if (role?.name) {
          return `ROLE_${role.name}`;
        } else if (role?.authority) {
          return role.authority;
        } else {
          return String(role);
        }
      });
    }
    
    setEditForm({
      username: user.username || "",
      email: user.email || "",
      fullName: user.fullName || "",
      enrollmentDate: user.enrollmentDate ? user.enrollmentDate.split('T')[0] : 
                      user.createdAt ? user.createdAt.split('T')[0] : "",
      roles: userRoles
    });
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle role changes
  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, value]
        : prev.roles.filter(role => role !== value)
    }));
  };

  // Handle update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    // Validate form data to match backend constraints exactly
    if (!editForm.username.trim()) {
      setError("Username is required.");
      return;
    }
    if (editForm.username.trim().length > 20) {
      setError("Username must be 20 characters or less.");
      return;
    }
    
    if (!editForm.email.trim()) {
      setError("Email is required.");
      return;
    }
    if (editForm.email.trim().length > 50) {
      setError("Email must be 50 characters or less.");
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    
    if (!editForm.fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (editForm.fullName.trim().length < 2) {
      setError("Full name must be at least 2 characters.");
      return;
    }
    if (editForm.fullName.trim().length > 100) {
      setError("Full name must be 100 characters or less.");
      return;
    }
    
    if (!editForm.enrollmentDate) {
      setError("Enrollment date is required.");
      return;
    }

    // Validate roles
    if (!editForm.roles || editForm.roles.length === 0) {
      setError("At least one role must be selected.");
      return;
    }
    
    // Check if enrollment date is not in the future
    const enrollmentDate = new Date(editForm.enrollmentDate);
    const today = new Date();
    
    // Reset both dates to start of day for accurate comparison
    enrollmentDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    console.log("Enrollment date:", enrollmentDate);
    console.log("Today:", today);
    console.log("Is enrollment date in future?", enrollmentDate > today);
    
    if (enrollmentDate > today) {
      setError("Enrollment date cannot be in the future.");
      return;
    }
    
    try {
      setLoading(true);
      
      // Create the update request object
      const updateRequest = {
        id: editingUser.id,
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        fullName: editForm.fullName.trim(),
        enrollmentDate: editForm.enrollmentDate,
        roles: editForm.roles, // Send roles as simple string array
        createdAt: editingUser.createdAt
      };
      
      console.log("Updating user with data:", updateRequest);
      console.log("Original user roles:", editingUser.roles);
      console.log("New roles being sent:", editForm.roles);
      
      // Update the user with all data including roles
      await axios.put(`${API_BASE_URL}/students/${editingUser.id}`, updateRequest);
      
      setSuccess(`User ${editingUser.username} updated successfully!`);
      setEditingUser(null);
      setEditForm({
        username: "",
        email: "",
        fullName: "",
        enrollmentDate: "",
        roles: []
      });
      
      // Refresh the user list to show updated data
      await fetchUsers();
      
      // Clear success message after 5 seconds to give user time to see the update
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Error updating user:", err);
      console.error("Error response:", err.response?.data);
      console.error("Validation errors:", err.response?.data?.validationErrors);
      console.error("Editing user data:", editingUser);
      console.error("Form data:", editForm);
      
      let errorMessage = "Failed to update user.";
      
      if (err.response?.status === 400) {
        if (err.response.data?.validationErrors && err.response.data.validationErrors.length > 0) {
          // Handle Spring Boot validation errors
          const validationErrors = err.response.data.validationErrors.map(error => 
            `${error.field}: ${error.message}`
          ).join(', ');
          errorMessage = `Validation Error: ${validationErrors}`;
        } else if (err.response.data?.message) {
          errorMessage = `Validation Error: ${err.response.data.message}`;
        } else if (typeof err.response.data === 'string') {
          errorMessage = `Error: ${err.response.data}`;
        } else if (err.response.data?.errors) {
          // Handle validation errors array
          const errors = Object.values(err.response.data.errors).join(', ');
          errorMessage = `Validation Error: ${errors}`;
        } else {
          errorMessage = "Invalid data provided. Please check all fields meet the requirements.";
        }
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to update this user.";
      } else if (err.response?.status === 404) {
        errorMessage = "User not found.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      username: "",
      email: "",
      fullName: "",
      enrollmentDate: "",
      roles: []
    });
  };

  if (!hasRole('ADMIN')) {
    return (
      <div className="access-denied">
        <h3>Access Denied</h3>
        <p>You don't have permission to access user management.</p>
      </div>
    );
  }

  return (
    <div className="user-management-section">
      <div className="section-header">
        <h2>User Management</h2>
        <p>View and manage all users who have signed up to the system</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="alert alert-success">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="alert-close">×</button>
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button onClick={() => setError("")} className="alert-close">×</button>
        </div>
      )}

      <div className="user-management-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by username, email, name, or role..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch({ target: { value: "" } })}
              className="search-clear"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <button 
          onClick={fetchUsers} 
          disabled={loading}
          className="btn btn-outline"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading && !users.length ? (
        <div className="loading-message">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        users.length === 0 ? (
          <div className="empty-state">
            <p>No users found in the system.</p>
          </div>
        ) : (
          <div className="empty-state">
            <p>No users found matching "{searchTerm}"</p>
            <button 
              onClick={() => handleSearch({ target: { value: "" } })}
              className="btn-link"
            >
              Clear search
            </button>
          </div>
        )
      ) : (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Full Name</th>
                <th>Roles</th>
                <th>Enrollment Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.fullName || 'Not provided'}</td>
                  <td>
                    <div className="user-roles">
                      {user.roles?.map((role, index) => {
                        // Handle different role formats
                        const roleString = typeof role === 'string' ? role : role?.name || role?.authority || String(role);
                        const cleanRole = roleString.replace('ROLE_', '').toLowerCase();
                        const displayRole = roleString.replace('ROLE_', '');
                        
                        return (
                          <span key={`${role}-${index}`} className={`role-badge role-${cleanRole}`}>
                            {displayRole}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    {user.enrollmentDate ? new Date(user.enrollmentDate).toLocaleDateString() : 
                     user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {user.id !== currentUser?.id && (
                        <>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="btn btn-small btn-edit"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            className="btn btn-small btn-delete"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && (
        <div className="edit-user-modal">
          <div className="modal-content">
            <h3>Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>Username (max 20 characters)</label>
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleFormChange}
                  required
                  maxLength={20}
                />
              </div>
              <div className="form-group">
                <label>Email (max 50 characters)</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleFormChange}
                  required
                  maxLength={50}
                />
              </div>
              <div className="form-group">
                <label>Full Name (2-100 characters)</label>
                <input
                  type="text"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleFormChange}
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>
              <div className="form-group">
                <label>Enrollment Date</label>
                <input
                  type="date"
                  name="enrollmentDate"
                  value={editForm.enrollmentDate}
                  onChange={handleFormChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Roles</label>
                <div className="role-checkboxes">
                  {['ROLE_USER', 'ROLE_MODERATOR', 'ROLE_ADMIN'].map(role => {
                    const isChecked = editForm.roles.includes(role);
                    
                    return (
                      <label key={role} className="checkbox-label">
                        <input
                          type="checkbox"
                          value={role}
                          checked={isChecked}
                          onChange={handleRoleChange}
                        />
                        <span>{role.replace('ROLE_', '')}</span>
                      </label>
                    );
                  })}
                </div>
                <small className="form-help">Select at least one role for the user</small>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Updating..." : "Update User"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="user-stats">
        <p>
          Total Users: {users.length}
          {users.length > 0 && (
            <span>
              {' | '}
              Admins: {users.filter(u => 
                u.roles?.some(role => {
                  const roleString = typeof role === 'string' ? role : role?.name || role?.authority || String(role);
                  return roleString.includes('ADMIN');
                })
              ).length}
              {' | '}
              Moderators: {users.filter(u => 
                u.roles?.some(role => {
                  const roleString = typeof role === 'string' ? role : role?.name || role?.authority || String(role);
                  return roleString.includes('MODERATOR');
                })
              ).length}
              {' | '}
              Regular Users: {users.filter(u => 
                u.roles?.some(role => {
                  const roleString = typeof role === 'string' ? role : role?.name || role?.authority || String(role);
                  return roleString.includes('USER') && !roleString.includes('ADMIN') && !roleString.includes('MODERATOR');
                })
              ).length}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default UserManagement;
