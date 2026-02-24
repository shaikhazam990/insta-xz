import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/form.css'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="hero-container">
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <div className="logo-section">
          <h1 className="hero-title">InstaXZ</h1>
          <p className="hero-subtitle">Share your moments, connect with the world</p>
        </div>

        <div className="hero-description">
          <p>Join millions of users sharing their stories every day. Connect, create, and inspire.</p>
        </div>

        <div className="hero-buttons">
          <button 
            className="hero-button hero-login-btn"
            onClick={() => navigate('/login')}
            aria-label="Go to login page"
          >
            Login
          </button>
          <button 
            className="hero-button hero-signup-btn"
            onClick={() => navigate('/register')}
            aria-label="Go to sign up page"
          >
            Sign Up
          </button>
        </div>

        <div className="hero-footer">
          <p className="hero-small-text">Share your best moments with the world</p>
        </div>
      </div>
    </div>
  )
}

export default Home