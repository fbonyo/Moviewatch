import React, { useState } from 'react'
import '../styles/AuthModal.css'

function AuthModal({ onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (!isLogin) {
      if (!formData.username) {
        setError('Please enter a username')
        setLoading(false)
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }
    }

    try {
      if (isLogin) {
        // Login
        const usersResult = await window.storage.get('users')
        if (!usersResult) {
          setError('No account found with this email')
          setLoading(false)
          return
        }

        const users = JSON.parse(usersResult.value)
        const user = users.find(u => u.email === formData.email)

        if (!user) {
          setError('No account found with this email')
          setLoading(false)
          return
        }

        if (user.password !== formData.password) {
          setError('Incorrect password')
          setLoading(false)
          return
        }

        // Store current user session
        await window.storage.set('currentUser', JSON.stringify({
          email: user.email,
          username: user.username,
          id: user.id
        }))

        onAuthSuccess(user)
      } else {
        // Sign up
        let users = []
        try {
          const usersResult = await window.storage.get('users')
          if (usersResult) {
            users = JSON.parse(usersResult.value)
          }
        } catch (err) {
          users = []
        }

        // Check if email already exists
        const existingUser = users.find(u => u.email === formData.email)
        if (existingUser) {
          setError('An account with this email already exists')
          setLoading(false)
          return
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          email: formData.email,
          password: formData.password,
          username: formData.username,
          createdAt: new Date().toISOString()
        }

        users.push(newUser)
        await window.storage.set('users', JSON.stringify(users))

        // Store current user session
        await window.storage.set('currentUser', JSON.stringify({
          email: newUser.email,
          username: newUser.username,
          id: newUser.id
        }))

        onAuthSuccess(newUser)
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>✕</button>
        
        <div className="auth-modal-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Sign in to continue' : 'Join Frobo\'s Cinema today'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="auth-spinner"></div>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  username: ''
                })
              }}
              disabled={loading}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
