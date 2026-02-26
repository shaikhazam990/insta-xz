// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../../auth/hook/useAuth'
// import "./nav.css"

// const Nav = () => {
//   const navigate = useNavigate()
//   const { user } = useAuth()

//   return (
//     <nav className="navbar">
//       <div className="nav-container">
//         <div className="nav-brand">
//           <h2 onClick={() => navigate('/feed')}>InstaXZ</h2>
//         </div>
//         <div className="nav-menu">
//           <button onClick={() => navigate('/feed')} className="nav-link">
//             Feed
//           </button>
//           <button onClick={() => navigate('/profile')} className="nav-link">
//             Profile
//           </button>
//           <button onClick={() => navigate('/')} className="nav-link logout">
//             Logout
//           </button>
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default Nav


import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/hook/useAuth'
import './nav.css'

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <polyline points="9 21 9 12 15 12 15 21"/>
  </svg>
)

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const ExploreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
)

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

const CreateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
)

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const Nav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { label: 'Home',          path: '/feed',    icon: <HomeIcon /> },
    { label: 'Search',        path: '/search',  icon: <SearchIcon /> },
    { label: 'Explore',       path: '/explore', icon: <ExploreIcon /> },
    { label: 'Notifications', path: '/notifs',  icon: <NotificationIcon /> },
    { label: 'Create',        path: '/create',  icon: <CreateIcon /> },
    { label: 'Profile',       path: '/profile', icon: <ProfileIcon /> },
  ]

  return (
    <nav className="sidebar">

      {/* Brand */}
      <div className="sidebar__brand" onClick={() => navigate('/feed')}>
        <span className="sidebar__brand-text">InstaXZ</span>
      </div>

      {/* Nav Items */}
      <ul className="sidebar__menu">
        {navItems.map(({ label, path, icon }) => (
          <li key={label}>
            <button
              className={`sidebar__item ${isActive(path) ? 'sidebar__item--active' : ''}`}
              onClick={() => navigate(path)}
            >
              <span className="sidebar__icon">{icon}</span>
              <span className="sidebar__label">{label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* User info + Logout pinned at bottom */}
      <div className="sidebar__footer">
        {user && (
          <div className="sidebar__user">
            <div className="sidebar__user-avatar">
              {user.profilePic
                ? <img src={user.profilePic} alt={user.username} />
                : <span>{user.username?.[0]?.toUpperCase()}</span>
              }
            </div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user.username}</span>
              <span className="sidebar__user-stats">
                {user.followers?.length ?? 0} followers · {user.following?.length ?? 0} following
              </span>
            </div>
          </div>
        )}

        <button
          className="sidebar__item sidebar__item--logout"
          onClick={() => navigate('/')}
        >
          <span className="sidebar__icon"><LogoutIcon /></span>
          <span className="sidebar__label">Logout</span>
        </button>
      </div>

    </nav>
  )
}

export default Nav

