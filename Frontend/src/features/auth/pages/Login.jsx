import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/form.css";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const {user, loading, handleLogin} = useAuth()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate()

  const handleSubmit =  async (e) => {
    e.preventDefault();
    setError("");
    console.log("Login:", { username, password });

    try {
      await handleLogin(username, password)
      console.log("user loggedin")
      navigate('/feed')
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
      console.error("Login error:", err)
    }
  }; 

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              username
            </label>
            <input
              type="username"
              id="username"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-footer">
            <a href="#" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        <div className="social-buttons">
          <button type="button" className="social-button google">
            Google
          </button>
          <button type="button" className="social-button github">
            GitHub
          </button>
        </div>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
