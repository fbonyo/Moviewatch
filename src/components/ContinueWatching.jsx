import React from 'react'
import '../styles/ContinueWatching.css'

function ContinueWatching({ continueWatching, onSelectMovie, onRemove }) {
  if (continueWatching.length === 0) {
    return null
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getProgress = (watched, total) => {
    if (!total || total === 0) return 0
    return Math.min((watched / total) * 100, 100)
  }

  return (
    <div className="continue-watching-container">
      <div className="continue-watching-header">
        <h2 className="continue-watching-title">Continue Watching</h2>
        <span className="continue-count">{continueWatching.length} items</span>
      </div>
      
      <div className="continue-watching-scroll">
        <div className="continue-watching-grid">
          {continueWatching.map((item) => (
            <div key={`${item.type}-${item.id}`} className="continue-card">
              <div className="continue-poster" onClick={() => onSelectMovie(item)}>
                <img src={item.backdrop_url || item.poster_url} alt={item.title} />
                <div className="continue-overlay">
                  <button className="continue-play-btn">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
                <div className="continue-progress-bar">
                  <div 
                    className="continue-progress-fill" 
                    style={{ width: `${getProgress(item.watchedTime, item.totalTime)}%` }}
                  />
                </div>
                <button 
                  className="continue-remove"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(item)
                  }}
                  title="Remove from Continue Watching"
                >
                  ✕
                </button>
              </div>
              <div className="continue-info">
                <h3 className="continue-title">{item.title}</h3>
                <div className="continue-meta">
                  <span className="continue-time">
                    {formatTime(item.watchedTime)} of {formatTime(item.totalTime || 3600)}
                  </span>
                  <span className="continue-percent">
                    {Math.round(getProgress(item.watchedTime, item.totalTime))}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContinueWatching
