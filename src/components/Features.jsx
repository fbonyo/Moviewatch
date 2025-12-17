import React from 'react'
import '../styles/Features.css'

function Features() {
  const features = [
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      ),
      title: "Works Worldwide",
      description: "Stream your favorite movies and TV shows from anywhere in the world. Access unlimited entertainment with no geographical restrictions or regional blocks. Your content travels with you."
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
          <polyline points="17 2 12 7 7 2"/>
          <line x1="7" y1="12" x2="7.01" y2="12"/>
          <line x1="12" y1="12" x2="12.01" y2="12"/>
          <line x1="17" y1="12" x2="17.01" y2="12"/>
        </svg>
      ),
      title: "Thousands of Titles",
      description: "Discover an extensive library featuring the latest blockbusters, timeless classics, trending series, and exclusive originals. From action-packed thrillers to heartwarming dramas, find something for every mood and moment."
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
          <path d="M12 14v7"/>
          <path d="M9 18h6"/>
        </svg>
      ),
      title: "Always 100% Free",
      description: "Enjoy unlimited streaming without spending a dime. No subscription fees, no hidden charges, no credit card required. Just pure entertainment, completely free forever. Watch as much as you want, whenever you want."
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
          <path d="M12 18h.01"/>
          <rect x="8" y="6" width="8" height="8" rx="1"/>
        </svg>
      ),
      title: "Device-Friendly",
      description: "Stream seamlessly across all your devices. Whether you're on your smartphone, tablet, laptop, desktop, or Smart TV, enjoy the same premium experience everywhere. Start on one device, continue on another."
    }
  ]

  return (
    <div className="features-section">
      <div className="features-header">
        <h2 className="features-main-title">Why Choose MovieWatch?</h2>
        <p className="features-subtitle">The ultimate streaming experience designed for movie lovers</p>
      </div>
      <div className="features-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Features
