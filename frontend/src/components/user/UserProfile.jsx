import React from "react";

function UserProfile({ currentUser }) {
  if (!currentUser.fullName) {
    return null;
  }

  return (
    <div className="profile-view">
      <h3>Profile Details</h3>
      <div className="profile-info">
        <div className="profile-field">
          <span className="field-label">Full Name:</span>
          <span className="field-value">{currentUser.fullName}</span>
        </div>
        
        <div className="profile-field">
          <span className="field-label">Email:</span>
          <span className="field-value">{currentUser.email}</span>
        </div>
        
        <div className="profile-field">
          <span className="field-label">Username:</span>
          <span className="field-value">{currentUser.username}</span>
        </div>
        
        {currentUser.enrollmentDate && (
          <div className="profile-field">
            <span className="field-label">Enrollment Date:</span>
            <span className="field-value">{currentUser.enrollmentDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
