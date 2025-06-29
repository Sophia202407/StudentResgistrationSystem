import React, { useEffect } from "react";
import Header from "./common/Header";
import AlertMessage from "./common/AlertMessage";
import UserProfileSection from "./user/UserProfileSection";
import AdminDashboard from "./admin/AdminDashboard";
import { useStudentManagement } from "../hooks/useStudentManagement";
import { useProfileForm } from "../hooks/useProfileForm";
import { useMessages } from "../hooks/useMessages";

function AuthenticatedApp({ 
  currentUser, 
  handleLogout, 
  hasRole, 
  updateCurrentUser 
}) {
  const { error, success, showSuccess, showError, clearError } = useMessages();
  
  const {
    students,
    allStudents,
    loading: studentsLoading,
    searchTerm,
    fetchStudents,
    handleSearch,
    handleDelete
  } = useStudentManagement(handleLogout);

  const {
    form,
    editingStudent,
    loading: formLoading,
    handleChange,
    handleSubmit,
    handleCancelEdit
  } = useProfileForm(currentUser, hasRole, updateCurrentUser, handleLogout);

  // Check authentication on component mount and fetch students if needed
  useEffect(() => {
    if (currentUser && (currentUser.roles?.includes('ROLE_ADMIN') || currentUser.roles?.includes('ROLE_MODERATOR'))) {
      // Use a stable reference to prevent infinite loops
      const loadStudents = async () => {
        try {
          await fetchStudents();
        } catch (err) {
          showError(err.message);
        }
      };
      loadStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, currentUser?.roles]); // Only depend on user ID and roles, not functions

  // Enhanced handlers with message management
  const handleFormSubmit = async (e) => {
    try {
      const message = await handleSubmit(e, fetchStudents);
      showSuccess(message);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleStudentDelete = async (studentId, studentName) => {
    try {
      const message = await handleDelete(studentId, studentName);
      showSuccess(message);
    } catch (err) {
      showError(err.message);
    }
  };

  const loading = studentsLoading || formLoading;

  return (
    <div className="app-container">
      <div className="app-content">
        <Header currentUser={currentUser} onLogout={handleLogout} />

        {/* Success and Error Messages */}
        <AlertMessage type="success" message={success} onClose={() => {}} />
        <AlertMessage type="error" message={error} onClose={clearError} />

        {/* Role-based Interface */}
        {hasRole('USER') && !hasRole('MODERATOR') && !hasRole('ADMIN') ? (
          // Regular User Interface - Profile Management
          <UserProfileSection
            currentUser={currentUser}
            form={form}
            loading={loading}
            editingStudent={editingStudent}
            onSubmit={handleFormSubmit}
            onChange={handleChange}
            onCancelEdit={handleCancelEdit}
          />
        ) : (
          // Admin/Moderator Interface - User Management
          <AdminDashboard
            loading={loading}
            students={students}
            allStudents={allStudents}
            searchTerm={searchTerm}
            hasRole={hasRole}
            currentUser={currentUser}
            onSearch={handleSearch}
            onRefresh={() => fetchStudents().catch(err => showError(err.message))}
            onDelete={handleStudentDelete}
            onSuccess={showSuccess}
            onError={showError}
          />
        )}
      </div>
    </div>
  );
}

export default AuthenticatedApp;
