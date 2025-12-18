import React, { useState, useEffect } from 'react'
import NotificationPanel from './NotificationPanel'
import '../styles/Header.css'

function Header({ searchQuery, setSearchQuery, onSearch, theme, setTheme, activeSection, setActiveSection }) {
  const [scrolled, setScrolled] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [hasNewNotifications, setHasNewNotifications] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleNavClick = (section) => {
    setActiveSection(section)
    setSearchQuery('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleMovieSelect = (movie) => {
    window.dispatchEvent(new CustomEvent('openMovie', { detail: movie }))
  }

  const handleNotificationUpdate = (count) => {
    setNotificationCount(count)
    if (count > 0) {
      setHasNewNotifications(true)
      // Show browser notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('MovieWatch', {
          body: `${count} new content available!`,
          icon: '/vite.svg'
        })
      }
    } else {
      setHasNewNotifications(false)
    }
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      setHasNewNotifications(false)
    }
  }

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="logo" onClick={() => handleNavClick('home')}>
          <span className="logo-text">Frobo's Cinema</span>
          <span className="logo-icon">🍿</span>
        </div>
        
        <nav className="nav">
          <a 
            href="#" 
            className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
          >
            <span>Home</span>
          </a>
          <a 
            href="#" 
            className={`nav-link ${activeSection === 'movies' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('movies'); }}
          >
            <span>Movies</span>
          </a>
          <a 
            href="#" 
            className={`nav-link ${activeSection === 'tvshows' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('tvshows'); }}
          >
            <span>TV Shows</span>
          </a>
          <a 
            href="#" 
            className={`nav-link ${activeSection === 'mylist' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('mylist'); }}
          >
            <span>My List</span>
          </a>
        </nav>

        <div className="header-actions">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search movies & TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </form>
          
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <button 
            className={`notification-btn ${hasNewNotifications ? 'has-new' : ''}`}
            onClick={handleNotificationClick}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {notificationCount > 0 && (
              <span className="notification-count">{notificationCount}</span>
            )}
            {hasNewNotifications && <span className="notification-dot"></span>}
          </button>
        </div>
      </div>
      
      {showNotifications && (
        <NotificationPanel 
          onClose={() => setShowNotifications(false)}
          onSelectMovie={handleMovieSelect}
          onNotificationUpdate={handleNotificationUpdate}
        />
      )}
    </header>
  )
}

export default Header
