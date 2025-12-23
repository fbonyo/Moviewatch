import React from 'react'
import '../styles/Header.css'

function Header({ theme, setTheme }) {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-text">Frobo's Cinema</span>
          <span className="logo-icon">🍿</span>
        </div>
        
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}

export default Header
