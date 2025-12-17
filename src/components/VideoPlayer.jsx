import React, { useState, useEffect } from 'react'
import '../styles/VideoPlayer.css'

function VideoPlayer({ movie, onClose }) {
  const [selectedSource, setSelectedSource] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  // Sources that work better in development
  const sources = [
    {
      name: 'VidSrc',
      url: movie.type === 'tv' 
        ? `https://vidsrc.xyz/embed/tv/${movie.id}/1/1`
        : `https://vidsrc.xyz/embed/movie/${movie.id}`
    },
    {
      name: 'VidSrc Pro',
      url: movie.type === 'tv'
        ? `https://vidsrc.pro/embed/tv/${movie.id}/1/1`
        : `https://vidsrc.pro/embed/movie/${movie.id}`
    },
    {
      name: 'VidLink',
      url: movie.type === 'tv'
        ? `https://vidlink.pro/tv/${movie.id}/1/1`
        : `https://vidlink.pro/movie/${movie.id}`
    },
    {
      name: 'Embed.su',
      url: movie.type === 'tv'
        ? `https://embed.su/embed/tv/${movie.id}/1/1`
        : `https://embed.su/embed/movie/${movie.id}`
    },
    {
      name: 'AutoEmbed',
      url: movie.type === 'tv'
        ? `https://autoembed.co/tv/tmdb/${movie.id}-1-1`
        : `https://autoembed.co/movie/tmdb/${movie.id}`
    }
  ]

  useEffect(() => {
    setLoading(true)
    setError(false)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [selectedSource])

  const handleSourceChange = (index) => {
    setSelectedSource(index)
  }

  const handleIframeError = () => {
    setError(true)
    setLoading(false)
  }

  return (
    <div className="video-player-overlay" onClick={onClose}>
      <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
        <div className="video-player-header">
          <div className="video-player-title">
            <h2>{movie.title}</h2>
            <span className="video-player-meta">
              {movie.year} • {movie.type === 'tv' ? 'TV Show (S1 E1)' : 'Movie'}
            </span>
          </div>
          <button className="video-player-close" onClick={onClose}>✕</button>
        </div>

        <div className="video-player-content">
          <div className="video-player-main">
            {loading && (
              <div className="video-player-loading">
                <div className="loading-spinner"></div>
                <p>Loading from {sources[selectedSource].name}...</p>
                <span className="loading-source">This may take a few seconds</span>
              </div>
            )}
            
            {error && !loading && (
              <div className="video-error">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h3>Source unavailable</h3>
                <p>This source couldn't load the video.</p>
                <p className="error-hint">Try selecting a different source from the list →</p>
              </div>
            )}
            
            <iframe
              key={selectedSource}
              src={sources[selectedSource].url}
              allowFullScreen
              frameBorder="0"
              scrolling="no"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              referrerPolicy="origin"
              onLoad={() => setLoading(false)}
              onError={handleIframeError}
              style={{ 
                display: (loading || error) ? 'none' : 'block',
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            />
          </div>

          <div className="video-sources-sidebar">
            <div className="sources-header">
              <h3>Available Sources</h3>
              <span className="sources-count">{sources.length} sources</span>
            </div>
            
            <p className="sources-description">
              Try different sources if one doesn't work. Each source searches different streaming providers.
            </p>
            
            <div className="sources-list">
              {sources.map((source, index) => (
                <button
                  key={index}
                  className={`source-btn ${selectedSource === index ? 'active' : ''}`}
                  onClick={() => handleSourceChange(index)}
                >
                  <span className="source-number">{index + 1}</span>
                  <div className="source-content">
                    <span className="source-name">{source.name}</span>
                    {selectedSource === index && (
                      <span className="source-status">
                        {loading ? '⏳ Loading...' : error ? '❌ Failed' : '✓ Playing'}
                      </span>
                    )}
                  </div>
                  {selectedSource === index && !error && (
                    <div className="source-indicator">
                      <div className="pulse"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="sources-info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <div>
                <p><strong>Troubleshooting:</strong></p>
                <ul>
                  <li>If video shows blank, try a different source</li>
                  <li>Player controls appear inside the video frame</li>
                  <li>Some sources may take longer to load</li>
                  <li>Ad-blockers may interfere with playback</li>
                </ul>
                <p style="margin-top: 0.75rem; opacity: 0.7; font-size: 0.8rem;">
                  No content is hosted by us. Sources search the web for streams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
