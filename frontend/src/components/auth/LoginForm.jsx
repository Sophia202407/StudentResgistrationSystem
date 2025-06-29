import React, { useState } from "react";
import AuthService from "../../services/AuthService";

function LoginForm({ onLogin, onToggleMode }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await AuthService.login(credentials.username, credentials.password);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login to Self-Registration System</h2>
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
              className="form-input"
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="auth-toggle">
          <p>Don't have an account? <button onClick={onToggleMode} className="btn-link">Register here</button></p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
