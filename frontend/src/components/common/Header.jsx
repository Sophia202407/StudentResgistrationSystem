import React from "react";

function Header({ currentUser, onLogout }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div>
          <h1>Student Self-Registration System</h1>
          <p>Manage student enrollments efficiently</p>
        </div>
        <div className="user-info">
          <span>Welcome, {currentUser.username}!</span>
          <span className="user-roles">
            {currentUser.roles?.map(role => role.replace('ROLE_', '')).join(', ')}
          </span>
          <button onClick={onLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
