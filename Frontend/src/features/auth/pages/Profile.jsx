import React, { useEffect } from 'react'
import { useAuth } from '../hook/useAuth'
import { useNavigate } from 'react-router-dom'
import '../style/form.css'

const Profile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-title">{user?.username || 'User Profile'}</h1>
          <p className="profile-subtitle">{user?.email || 'No email'}</p>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <label>Username</label>
            <p>{user?.username || 'N/A'}</p>
          </div>

          <div className="profile-section">
            <label>Email</label>
            <p>{user?.email || 'N/A'}</p>
          </div>

          <div className="profile-section">
            <label>User ID</label>
            <p>{user?._id || 'N/A'}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            className="auth-button"
            onClick={() => navigate('/feed')}
          >
            Back to Feed
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
