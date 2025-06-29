import React from "react";

function UserList({ 
  users, 
  allUsers, 
  searchTerm, 
  hasRole, 
  loading, 
  onSearch, 
  onRefresh, 
  onDelete
}) {
  return (
    <div className="list-section">
      <div className="section-header">
        <h2>
          {hasRole('ADMIN') || hasRole('MODERATOR') 
            ? `User Profiles (${users.length}${searchTerm ? ` of ${allUsers.length}` : ''})`
            : 'Your Profile'
          }
        </h2>
        {searchTerm && (
          <div className="search-info">
            Filtered by: "{searchTerm}"
          </div>
        )}
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name, email, username, or role..."
              value={searchTerm}
              onChange={onSearch}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => onSearch({ target: { value: "" } })}
                className="search-clear"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <button 
            onClick={onRefresh} 
            disabled={loading}
            className="btn btn-outline"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {loading && !users.length ? (
        <div className="loading-message">Loading users...</div>
      ) : users.length === 0 ? (
        allUsers.length === 0 ? (
          <div className="empty-state">
            <p>No user profiles found yet.</p>
            <p>Create users using the Add User form.</p>
          </div>
        ) : (
          <div className="empty-state">
            <p>No user profiles found matching "{searchTerm}"</p>
            <p>Try a different search term or <button 
                onClick={() => onSearch({ target: { value: "" } })}
                className="btn-link"
              >clear search</button></p>
          </div>
        )
      ) : (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Registration Date</th>
                {hasRole('ADMIN') && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.fullName || 'Not provided'}</td>
                  <td>{user.email}</td>
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
                      }) || <span className="role-badge role-user">USER</span>}
                    </div>
                  </td>
                  <td>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 
                     user.enrollmentDate ? new Date(user.enrollmentDate).toLocaleDateString() : 
                     'Unknown'}
                  </td>
                  {(hasRole('ADMIN')) && (
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => onDelete(user.id, user.username)}
                          className="btn btn-small btn-delete"
                          disabled={loading}
                          title="Delete user"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserList;
