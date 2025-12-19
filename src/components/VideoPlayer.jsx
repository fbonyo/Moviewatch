import React, { useState, useEffect, useRef } from 'react'
import '../styles/VideoPlayer.css'

function VideoPlayer({ movie, onClose, onUpdateProgress }) {
  const [selectedSource, setSelectedSource] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isPiP, setIsPiP] = useState(false)
  const [pipPosition, setPipPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 280 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const startTimeRef = useRef(Date.now())
  const progressIntervalRef = useRef(null)
  const pipRef = useRef(null)
  
  const sources = [
    {
      name: 'VidSrc.to',
      url: movie.type === 'tv' 
        ? `https://vidsrc.to/embed/tv/${movie.id}/1/1`
        : `https://vidsrc.to/embed/movie/${movie.id}`,
      quality: 'HD'
    },
    {
      name: 'VidSrc.xyz',
      url: movie.type === 'tv'
        ? `https://vidsrc.xyz/embed/tv?tmdb=${movie.id}&season=1&episode=1`
        : `https://vidsrc.xyz/embed/movie?tmdb=${movie.id}`,
      quality: 'HD'
    },
    {
      name: 'SuperEmbed',
      url: movie.type === 'tv'
        ? `https://multiembed.mov/?video_id=${movie.id}&tmdb=1&s=1&e=1`
        : `https://multiembed.mov/?video_id=${movie.id}&tmdb=1`,
      quality: 'HD'
    },
    {
      name: 'VidSrc.me',
      url: movie.type === 'tv'
        ? `https://vidsrc.me/embed/tv?tmdb=${movie.id}&season=1&episode=1`
        : `https://vidsrc.me/embed/movie?tmdb=${movie.id}`,
      quality: 'HD'
    },
    {
      name: 'Embed.su',
      url: movie.type === 'tv'
        ? `https://embed.su/embed/tv/${movie.id}/1/1`
        : `https://embed.su/embed/movie/${movie.id}`,
      quality: 'HD'
    },
    {
      name: 'VidLink Pro',
      url: movie.type === 'tv'
        ? `https://vidlink.pro/tv/${movie.id}?s=1&e=1`
        : `https://vidlink.pro/movie/${movie.id}`,
      quality: 'HD'
    },
    {
      name: 'Smashystream',
      url: movie.type === 'tv'
        ? `https://player.smashy.stream/tv/${movie.id}?s=1&e=1`
        : `https://player.smashy.stream/movie/${movie.id}`,
      quality: 'HD'
    },
    {
      name: 'Movie API',
      url: movie.type === 'tv'
        ? `https://moviesapi.club/tv/${movie.id}-1-1`
        : `https://moviesapi.club/movie/${movie.id}`,
      quality: 'HD'
    },
    {
      name: '2Embed',
      url: movie.type === 'tv'
        ? `https://www.2embed.cc/embedtv/${movie.id}&s=1&e=1`
        : `https://www.2embed.cc/embed/${movie.id}`,
      quality: 'HD'
    },
    {
      name: 'AutoEmbed',
      url: movie.type === 'tv'
        ? `https://autoembed.cc/tv/tmdb/${movie.id}-1-1`
        : `https://autoembed.cc/movie/tmdb/${movie.id}`,
      quality: 'HD'
    }
  ]

  useEffect(() => {
    setLoading(true)
    setError(false)
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [selectedSource])

  // Keyboard shortcuts: ESC to close, number keys to switch sources, P for PiP
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isPiP) {
          setIsPiP(false)
        } else {
          onClose()
        }
      }
      
      // P key for Picture-in-Picture
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        togglePiP()
      }
      
      // Number keys 1-9 and 0 to switch sources
      const num = parseInt(e.key)
      if (!isNaN(num)) {
        const sourceIndex = num === 0 ? 9 : num - 1
        if (sourceIndex >= 0 && sourceIndex < sources.length) {
          setSelectedSource(sourceIndex)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, sources.length, isPiP])

  useEffect(() => {
    // Track watch progress every 30 seconds
    progressIntervalRef.current = setInterval(() => {
      const watchedTime = Math.floor((Date.now() - startTimeRef.current) / 1000)
      if (onUpdateProgress && watchedTime > 10) {
        onUpdateProgress(movie, watchedTime)
      }
    }, 30000)

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      const finalWatchedTime = Math.floor((Date.now() - startTimeRef.current) / 1000)
      if (onUpdateProgress && finalWatchedTime > 10) {
        onUpdateProgress(movie, finalWatchedTime)
      }
    }
  }, [movie, onUpdateProgress])

  // PiP Dragging
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => {
      setPipPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const handleSourceChange = (index) => {
    setSelectedSource(index)
    startTimeRef.current = Date.now()
  }

  const handleIframeError = () => {
    setError(true)
    setLoading(false)
  }

  const togglePiP = () => {
    setIsPiP(!isPiP)
  }

  const handlePipMouseDown = (e) => {
    if (e.target.closest('.pip-controls')) return
    
    setIsDragging(true)
    const rect = pipRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  if (isPiP) {
    return (
      <div 
        ref={pipRef}
        className="pip-player"
        style={{
          left: `${pipPosition.x}px`,
          top: `${pipPosition.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handlePipMouseDown}
      >
        <div className="pip-header">
          <span className="pip-title">{movie.title}</span>
          <div className="pip-controls">
            <button 
              className="pip-btn pip-expand" 
              onClick={togglePiP}
              title="Expand (P)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 3 21 3 21 9"/>
                <polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/>
                <line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </button>
            <button 
              className="pip-btn pip-close" 
              onClick={onClose}
              title="Close (ESC)"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="pip-video">
          <iframe
            key={`pip-${selectedSource}-${movie.id}`}
            src={sources[selectedSource].url}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="origin"
            style={{ 
              width: '100%',
              height: '100%',
              border: 'none'
            }}
          />
        </div>
      </div>
    )
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
          <div className="video-player-controls">
            <button 
              className="video-player-pip" 
              onClick={togglePiP}
              title="Picture-in-Picture (P)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <rect x="8" y="10" width="12" height="8" rx="1"/>
              </svg>
            </button>
            <button className="video-player-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="video-player-content">
          <div className="video-player-main">
            {loading && (
              <div className="video-player-loading">
                <div className="loading-spinner"></div>
                <p>Loading {sources[selectedSource].name}...</p>
                <span className="loading-source">Finding best quality stream...</span>
                <div className="loading-tip">
                  💡 Tip: Press P for Picture-in-Picture mode
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
                <p className="error-hint">Try pressing 2, 3, or 4 to switch sources</p>
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
              <p>Press 1-9 or 0 to switch sources. Press P for Picture-in-Picture mode.</p>
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
              <h4>⌨️ Keyboard Shortcuts</h4>
              <ol>
                <li><strong>1-9, 0</strong> → Switch to source 1-10</li>
                <li><strong>P</strong> → Picture-in-Picture mode</li>
                <li><strong>ESC</strong> → Close player</li>
                <li>Wait 3-10 seconds for player to load</li>
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
