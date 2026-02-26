import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hook/useAuth'

const Nav = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h2 onClick={() => navigate('/feed')}>InstaXZ</h2>
        </div>
        <div className="nav-menu">
          <button onClick={() => navigate('/feed')} className="nav-link">
            Feed
          </button>
          <button onClick={() => navigate('/profile')} className="nav-link">
            Profile
          </button>
          <button onClick={() => navigate('/')} className="nav-link logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Nav
