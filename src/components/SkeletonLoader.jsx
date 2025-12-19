import React from 'react'
import '../styles/SkeletonLoader.css'

function SkeletonLoader({ type = 'card', count = 1 }) {
  const renderSkeleton = () => {
    switch(type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-info">
              <div className="skeleton-title"></div>
              <div className="skeleton-meta">
                <div className="skeleton-badge"></div>
                <div className="skeleton-rating"></div>
              </div>
            </div>
          </div>
        )
      
      case 'hero':
        return (
          <div className="skeleton-hero">
            <div className="skeleton-hero-content">
              <div className="skeleton-hero-text">
                <div className="skeleton-hero-title"></div>
                <div className="skeleton-hero-title short"></div>
                <div className="skeleton-hero-description"></div>
                <div className="skeleton-hero-description"></div>
                <div className="skeleton-hero-description short"></div>
                <div className="skeleton-hero-buttons">
                  <div className="skeleton-button"></div>
                  <div className="skeleton-button"></div>
                </div>
              </div>
              <div className="skeleton-hero-grid">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="skeleton-hero-card"></div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'modal':
        return (
          <div className="skeleton-modal">
            <div className="skeleton-modal-hero"></div>
            <div className="skeleton-modal-content">
              <div className="skeleton-modal-title"></div>
              <div className="skeleton-modal-meta">
                <div className="skeleton-badge"></div>
                <div className="skeleton-badge"></div>
                <div className="skeleton-badge"></div>
              </div>
              <div className="skeleton-modal-description"></div>
              <div className="skeleton-modal-description"></div>
              <div className="skeleton-modal-description short"></div>
            </div>
          </div>
        )
      
      case 'continue':
        return (
          <div className="skeleton-continue">
            <div className="skeleton-continue-header">
              <div className="skeleton-continue-title"></div>
              <div className="skeleton-badge"></div>
            </div>
            <div className="skeleton-continue-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-continue-card">
                  <div className="skeleton-continue-image"></div>
                  <div className="skeleton-continue-info">
                    <div className="skeleton-continue-text"></div>
                    <div className="skeleton-continue-text short"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  )
}

export default SkeletonLoader
