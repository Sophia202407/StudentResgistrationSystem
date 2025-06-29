import React, { useState } from "react";
import UserForm from "../user/UserForm";
import UserList from "../user/UserList";
import UserManagement from "../user/UserManagement";

function AdminDashboard({ 
  loading,
  students,
  allStudents,
  searchTerm,
  hasRole,
  currentUser,
  onSearch,
  onRefresh,
  onDelete,
  onSuccess,
  onError
}) {
  const [activeTab, setActiveTab] = useState('userlist');

  // Handle user added successfully - switch to user management
  const handleUserAdded = () => {
    setActiveTab('users'); // Switch to User Management tab
  };

  return (
    <div className="admin-dashboard">
      {/* Enhanced Tab Navigation */}
      <div className="tab-navigation-container">
        <div className="tab-navigation">
          <button 
            onClick={() => setActiveTab('userlist')}
            className={`tab-button ${activeTab === 'userlist' ? 'active' : ''}`}
          >
            <span className="tab-icon">�</span>
            <span className="tab-text">
              <span className="tab-title">User Profiles</span>
              <span className="tab-subtitle">View all users</span>
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('adduser')}
            className={`tab-button ${activeTab === 'adduser' ? 'active' : ''}`}
          >
            <span className="tab-icon">✨</span>
            <span className="tab-text">
              <span className="tab-title">Add User</span>
              <span className="tab-subtitle">Create new user</span>
            </span>
          </button>
          {hasRole('ADMIN') && (
            <button 
              onClick={() => setActiveTab('users')}
              className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            >
              <span className="tab-icon">🛠️</span>
              <span className="tab-text">
                <span className="tab-title">User Management</span>
                <span className="tab-subtitle">Edit & manage users</span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'userlist' ? (
          <UserList 
            users={students}
            allUsers={allStudents}
            searchTerm={searchTerm}
            hasRole={hasRole}
            loading={loading}
            onSearch={onSearch}
            onRefresh={onRefresh}
            onDelete={onDelete}
          />
        ) : activeTab === 'adduser' ? (
          <UserForm 
            loading={loading}
            onSuccess={onSuccess}
            onError={onError}
            onUserAdded={handleUserAdded}
          />
        ) : (
          <UserManagement 
            hasRole={hasRole}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
