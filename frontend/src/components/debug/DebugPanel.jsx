import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../services/AuthService";

function DebugPanel({ currentUser }) {
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDebugData = async () => {
    setLoading(true);
    try {
      // Fetch students
      const studentsResponse = await axios.get(`${API_BASE_URL}/students`);
      
      // Try to fetch users (if endpoint exists)
      let usersResponse = null;
      try {
        usersResponse = await axios.get(`${API_BASE_URL}/admin/users`);
      } catch (err) {
        console.log("Users endpoint not available:", err.response?.status);
      }

      setDebugData({
        currentUser: currentUser,
        students: studentsResponse.data,
        users: usersResponse?.data || "Endpoint not available",
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error("Debug fetch error:", err);
      setDebugData({
        error: err.message,
        currentUser: currentUser,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      background: '#f8f9fa', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      fontSize: '12px',
      zIndex: 1000,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h4>Debug Panel</h4>
      <button 
        onClick={fetchDebugData} 
        disabled={loading}
        style={{ marginBottom: '10px', padding: '5px 10px' }}
      >
        {loading ? 'Loading...' : 'Fetch Debug Data'}
      </button>
      
      {debugData && (
        <pre style={{ 
          background: 'white', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '11px'
        }}>
          {JSON.stringify(debugData, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default DebugPanel;
