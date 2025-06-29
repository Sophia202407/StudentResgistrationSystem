import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../services/AuthService";

function RoleDebugPanel({ currentUser }) {
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRoleDebugData = async () => {
    setLoading(true);
    try {
      // Fetch students data
      const studentsResponse = await axios.get(`${API_BASE_URL}/students`);
      
      // Try different endpoints to understand data structure
      let authTestResponse = null;
      try {
        authTestResponse = await axios.get(`${API_BASE_URL}/auth/user`);
      } catch (err) {
        console.log("Auth user endpoint not available:", err.response?.status);
      }

      const debugInfo = {
        currentUser: {
          data: currentUser,
          roles: currentUser?.roles,
          rolesType: typeof currentUser?.roles,
          rolesLength: currentUser?.roles?.length
        },
        studentsData: studentsResponse.data.map(user => ({
          id: user.id,
          username: user.username,
          roles: user.roles,
          rolesType: typeof user.roles,
          rolesIsArray: Array.isArray(user.roles),
          rolesLength: user.roles?.length,
          firstRole: user.roles?.[0],
          firstRoleType: typeof user.roles?.[0]
        })),
        authUser: authTestResponse?.data || "Not available",
        timestamp: new Date().toISOString()
      };

      setDebugData(debugInfo);
      console.log("Role Debug Data:", debugInfo);
    } catch (err) {
      console.error("Role debug fetch error:", err);
      setDebugData({
        error: err.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      background: '#fff3cd', 
      border: '1px solid #ffeaa7', 
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '500px',
      maxHeight: '400px',
      overflow: 'auto',
      fontSize: '12px',
      zIndex: 1001,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ color: '#856404', marginBottom: '10px' }}>🔍 Role Debug Panel</h4>
      <button 
        onClick={fetchRoleDebugData} 
        disabled={loading}
        style={{ 
          marginBottom: '10px', 
          padding: '5px 10px', 
          backgroundColor: '#ffc107',
          border: 'none',
          borderRadius: '4px',
          color: '#212529'
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze Role Data'}
      </button>
      
      {debugData && (
        <div style={{ 
          background: 'white', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '11px',
          border: '1px solid #dee2e6'
        }}>
          <pre>{JSON.stringify(debugData, null, 2)}</pre>
        </div>
      )}
      
      <div style={{ marginTop: '10px', fontSize: '10px', color: '#856404' }}>
        💡 This panel helps identify role data structure issues
      </div>
    </div>
  );
}

export default RoleDebugPanel;
