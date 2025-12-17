import React, { useState, useEffect, useRef } from 'react'
import '../styles/VideoPlayer.css'

function VideoPlayer({ movie, onClose, onUpdateProgress }) {
  const [selectedSource, setSelectedSource] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const startTimeRef = useRef(Date.now())
  const progressIntervalRef = useRef(null)
  
  const sources = [
    {
      name: 'VidSrc.to',
      url: movie.type === 'tv' 
        ? `https://vidsrc.to/embed/tv/${movie.id}/1/1`
        : `https://vidsrc.to/embed/movie/${movie.id}`
    },
    {
      name: 'VidSrc.xyz',
      url: movie.type === 'tv'
        ? `https://vidsrc.xyz/embed/tv?tmdb=${movie.id}&season=1&episode=1`
        : `https://vidsrc.xyz/embed/movie?tmdb=${movie.id}`
    },
    {
      name: 'VidSrc.me',
      url: movie.type === 'tv'
        ? `https://vidsrc.me/embed/tv?tmdb=${movie.id}&season=1&episode=1`
        : `https://vidsrc.me/embed/movie?tmdb=${movie.id}`
    },
    {
      name: 'Embed.su',
      url: movie.type === 'tv'
        ? `https://embed.su/embed/tv/${movie.id}/1/1`
        : `https://embed.su/embed/movie/${movie.id}`
    },
    {
      name: 'VidLink Pro',
      url: movie.type === 'tv'
        ? `https://vidlink.pro/tv/${movie.id}?s=1&e=1`
        : `https://vidlink.pro/movie/${movie.id}`
    },
    {
      name: 'Movie API',
      url: movie.type === 'tv'
        ? `https://moviesapi.club/tv/${movie.id}-1-1`
        : `https://moviesapi.club/movie/${movie.id}`
    },
    {
      name: '2Embed',
      url: movie.type === 'tv'
        ? `https://www.2embed.cc/embedtv/${movie.id}&s=1&e=1`
        : `https://www.2embed.cc/embed/${movie.id}`
    }
  ]

  useEffect(() => {
    setLoading(true)
    setError(false)
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [selectedSource])

  useEffect(() => {
    // Track watch progress every 30 seconds
    progressIntervalRef.current = setInterval(() => {
      const watchedTime = Math.floor((Date.now() - startTimeRef.current) / 1000)
      if (onUpdateProgress && watchedTime > 10) { // Only save if watched more than 10 seconds
        onUpdateProgress(movie, watchedTime)
      }
    }, 30000) // Update every 30 seconds

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      // Save final progress on unmount
      const finalWatchedTime = Math.floor((Date.now() - startTimeRef.current) / 1000)
      if (onUpdateProgress && finalWatchedTime > 10) {
        onUpdateProgress(movie, finalWatchedTime)
      }
    }
  }, [movie, onUpdateProgress])

  const handleSourceChange = (index) => {
    setSelectedSource(index)
    // Reset start time when changing source
    startTimeRef.current = Date.now()
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
                <p>Loading {sources[selectedSource].name}...</p>
                <span className="loading-source">Finding best quality stream...</span>
                <div className="loading-tip">
                  💡 Tip: If this source doesn't load, try another from the list →
                </div>
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
              key={`${selectedSource}-${movie.id}`}
              src={sources[selectedSource].url}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              referrerPolicy="origin"
              onLoad={() => {
                console.log(`Loaded source ${selectedSource}: ${sources[selectedSource].name}`)
                setLoading(false)
              }}
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
              <h3>Video Sources</h3>
              <span className="sources-count">{sources.length} available</span>
            </div>
            
            <div className="sources-tip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              <p>Click different sources if one doesn't work. Each searches different servers.</p>
            </div>
            
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
                        {loading ? '⏳ Loading...' : error ? '❌ Failed' : '✓ Active'}
                      </span>
                    )}
                  </div>
                  {selectedSource === index && !loading && !error && (
                    <div className="source-pulse"></div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="sources-info">
              <h4>📺 How to Watch</h4>
              <ol>
                <li>Wait for the player to load (3-10 seconds)</li>
                <li>If you see a blank screen, try sources 2-7</li>
                <li>Some movies/shows may not be available yet</li>
                <li>Player controls appear inside the video frame</li>
              </ol>
              
              <div className="info-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                <p>We don't host content. Sources search the web for streams.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
