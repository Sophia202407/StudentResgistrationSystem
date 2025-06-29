import React from "react";

function StudentList({ 
  students, 
  allStudents, 
  searchTerm, 
  hasRole, 
  loading, 
  onSearch, 
  onRefresh, 
  onEdit, 
  onDelete,
  editingStudent 
}) {
  return (
    <div className="list-section">
      <div className="section-header">
        <h2>
          {hasRole('ADMIN') || hasRole('MODERATOR') 
            ? `User Profiles (${students.length}${searchTerm ? ` of ${allStudents.length}` : ''})`
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
              placeholder="Search by name, email, username, or ID..."
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

      {loading && !students.length ? (
        <div className="loading-message">Loading students...</div>
      ) : students.length === 0 ? (
        allStudents.length === 0 ? (
          <div className="empty-state">
            <p>No user profiles found yet.</p>
            <p>Register users using the registration form.</p>
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
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Enrollment Date</th>
                {(hasRole('MODERATOR') || hasRole('ADMIN')) && <th>Owner</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className={editingStudent?.id === student.id ? "editing" : ""}>
                  <td>#{student.id}</td>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>
                    <div className="user-roles">
                      {student.user?.roles?.map(role => (
                        <span key={role} className={`role-badge role-${role.replace('ROLE_', '').toLowerCase()}`}>
                          {role.replace('ROLE_', '')}
                        </span>
                      )) || <span className="role-badge role-user">USER</span>}
                    </div>
                  </td>
                  <td>{new Date(student.enrollmentDate).toLocaleDateString()}</td>
                  {(hasRole('MODERATOR') || hasRole('ADMIN')) && (
                    <td>{student.user?.username || 'Unknown'}</td>
                  )}
                  <td>
                    <div className="action-buttons">
                      {(hasRole('USER') || hasRole('MODERATOR') || hasRole('ADMIN')) && (
                        <button
                          onClick={() => onEdit(student)}
                          className="btn btn-small btn-edit"
                          disabled={loading}
                        >
                          Edit
                        </button>
                      )}
                      {(hasRole('USER') || hasRole('MODERATOR') || hasRole('ADMIN')) && (
                        <button
                          onClick={() => onDelete(student.id, student.fullName)}
                          className="btn btn-small btn-delete"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentList;
