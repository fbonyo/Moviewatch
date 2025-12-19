import React, { useState, useEffect, useRef } from 'react'
import '../styles/VideoPlayer.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'

function VideoPlayer({ movie, onClose, onUpdateProgress }) {
  const [selectedSource, setSelectedSource] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isPiP, setIsPiP] = useState(false)
  const [pipPosition, setPipPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 280 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [connectionSpeed, setConnectionSpeed] = useState('high')
  const [autoQuality, setAutoQuality] = useState(true)
  const [movieDetails, setMovieDetails] = useState(null)
  const [credits, setCredits] = useState(null)
  const [similarContent, setSimilarContent] = useState([])
  const [loadingSimilar, setLoadingSimilar] = useState(true)
  const startTimeRef = useRef(Date.now())
  const progressIntervalRef = useRef(null)
  const pipRef = useRef(null)
  const speedTestRef = useRef(null)
  
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
    fetchMovieDetails()
    fetchCredits()
    fetchSimilarContent()
  }, [movie.id, movie.type])

  const fetchMovieDetails = async () => {
    try {
      const endpoint = movie.type === 'tv' ? 'tv' : 'movie'
      const response = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${movie.id}?api_key=${TMDB_API_KEY}&language=en-US`
      )
      const data = await response.json()
      setMovieDetails(data)
    } catch (error) {
      console.error('Error fetching movie details:', error)
    }
  }

  const fetchCredits = async () => {
    try {
      const endpoint = movie.type === 'tv' ? 'tv' : 'movie'
      const response = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${movie.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`
      )
      const data = await response.json()
      setCredits(data)
    } catch (error) {
      console.error('Error fetching credits:', error)
    }
  }

  const fetchSimilarContent = async () => {
    setLoadingSimilar(true)
    try {
      const endpoint = movie.type === 'tv' ? 'tv' : 'movie'
      const response = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${movie.id}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      )
      const data = await response.json()
      
      const formatted = data.results?.slice(0, 6).map(item => ({
        id: item.id,
        title: item.title || item.name,
        year: (item.release_date || item.first_air_date)?.split('-')[0] || 'N/A',
        rating: item.vote_average?.toFixed(1) || 'N/A',
        poster_url: item.poster_path 
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : 'https://via.placeholder.com/500x750',
        description: item.overview || 'No description available.',
        backdrop_url: item.backdrop_path
          ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
          : null,
        type: movie.type
      })) || []
      
      setSimilarContent(formatted)
    } catch (error) {
      console.error('Error fetching similar content:', error)
    }
    setLoadingSimilar(false)
  }

  // Monitor connection speed
  useEffect(() => {
    const checkConnectionSpeed = async () => {
      if (!navigator.connection && !navigator.mozConnection && !navigator.webkitConnection) {
        const startTime = Date.now()
        try {
          await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' })
          const endTime = Date.now()
          const latency = endTime - startTime
          
          if (latency < 200) {
            setConnectionSpeed('high')
          } else if (latency < 500) {
            setConnectionSpeed('medium')
          } else {
            setConnectionSpeed('low')
          }
        } catch (error) {
          setConnectionSpeed('low')
        }
        return
      }

      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      
      const updateSpeed = () => {
        const effectiveType = connection.effectiveType
        
        if (effectiveType === '4g') {
          setConnectionSpeed('high')
        } else if (effectiveType === '3g') {
          setConnectionSpeed('medium')
        } else {
          setConnectionSpeed('low')
        }
      }

      updateSpeed()
      connection.addEventListener('change', updateSpeed)
      
      return () => {
        connection.removeEventListener('change', updateSpeed)
      }
    }

    checkConnectionSpeed()
    speedTestRef.current = setInterval(checkConnectionSpeed, 30000)

    return () => {
      if (speedTestRef.current) {
        clearInterval(speedTestRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(false)
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [selectedSource])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isPiP) {
          setIsPiP(false)
        } else {
          onClose()
        }
      }
      
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        togglePiP()
      }

      if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault()
        setAutoQuality(!autoQuality)
      }
      
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
  }, [onClose, sources.length, isPiP, autoQuality])

  useEffect(() => {
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

  const handleSimilarClick = (similarMovie) => {
    onClose()
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openMovie', { detail: similarMovie }))
    }, 100)
  }

  const getQualityIcon = () => {
    switch(connectionSpeed) {
      case 'high':
        return '🟢'
      case 'medium':
        return '🟡'
      case 'low':
        return '🔴'
      default:
        return '⚪'
    }
  }

  const getQualityText = () => {
    switch(connectionSpeed) {
      case 'high':
        return '1080p'
      case 'medium':
        return '720p'
      case 'low':
        return '480p'
      default:
        return 'Auto'
    }
  }

  const getQualityDescription = () => {
    switch(connectionSpeed) {
      case 'high':
        return '1080p Quality'
      case 'medium':
        return '720p Quality'
      case 'low':
        return '480p Quality'
      default:
        return 'Auto Quality'
    }
  }

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const director = credits?.crew?.find(person => person.job === 'Director')
  const cast = credits?.cast?.slice(0, 6)

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
    <div className="video-player-overlay-new">
      <div className="video-player-scrollable">
        
        {/* Video Section */}
        <div className="video-player-fixed-section">
          <div className="video-player-header-new">
            <div className="video-player-title">
              <h2>{movie.title}</h2>
              <span className="video-player-meta">
                {movie.year} • {movie.type === 'tv' ? 'TV Show (S1 E1)' : 'Movie'}
              </span>
            </div>
            <div className="video-player-controls">
              <div className="quality-indicator" title={`Connection: ${connectionSpeed}`}>
                <span className="quality-icon">{getQualityIcon()}</span>
                <span className="quality-text">{getQualityText()}</span>
              </div>
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
              <button 
                className="video-player-close-btn" 
                onClick={onClose}
                title="Close (ESC)"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="video-player-main-new">
            {loading && (
              <div className="video-player-loading">
                <div className="loading-spinner"></div>
                <p>Loading {sources[selectedSource].name}...</p>
                <span className="loading-source">
                  {autoQuality ? `Optimizing for ${connectionSpeed} speed...` : 'Finding best quality stream...'}
                </span>
                <div className="loading-tip">
                  💡 Scroll down for more info • Press P for Picture-in-Picture
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
        </div>

        {/* Scrollable Content Below */}
        <div className="video-player-info-section">
          <div className="video-info-container">
            {/* Movie Description */}
            <div className="video-info-block">
              <h3 className="video-info-title">About {movie.title}</h3>
              <p className="video-info-description">
                {movie.description || 'No description available for this title.'}
              </p>
              <div className="video-info-meta">
                {movie.rating && (
                  <div className="info-badge">
                    <span className="badge-label">Rating:</span>
                    <span className="badge-value">⭐ {movie.rating}/10</span>
                  </div>
                )}
                {movieDetails?.runtime && (
                  <div className="info-badge">
                    <span className="badge-label">Duration:</span>
                    <span className="badge-value">{formatRuntime(movieDetails.runtime)}</span>
                  </div>
                )}
                {movie.year && (
                  <div className="info-badge">
                    <span className="badge-label">Year:</span>
                    <span className="badge-value">{movie.year}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cast */}
            {cast && cast.length > 0 && (
              <div className="video-info-block">
                <h3 className="video-info-title">Cast</h3>
                <div className="cast-scroll">
                  {cast.map((person) => (
                    <div key={person.id} className="cast-item">
                      <div className="cast-photo-small">
                        {person.profile_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} 
                            alt={person.name}
                          />
                        ) : (
                          <div className="cast-placeholder-small">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="cast-info-small">
                        <p className="cast-name-small">{person.name}</p>
                        <p className="cast-character-small">{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Director */}
            {director && (
              <div className="video-info-block">
                <h3 className="video-info-title">Director</h3>
                <p className="director-name">{director.name}</p>
              </div>
            )}

            {/* Video Sources */}
            <div className="video-info-block">
              <h3 className="video-info-title">Video Sources ({sources.length} available)</h3>
              
              {/* Connection Status */}
              <div className="connection-status-inline">
                <div className="connection-inline-item">
                  <span className="connection-icon-inline">{getQualityIcon()}</span>
                  <div className="connection-text">
                    <span className="connection-speed-inline">
                      {connectionSpeed === 'high' ? 'Fast' : connectionSpeed === 'medium' ? 'Moderate' : 'Slow'} Connection
                    </span>
                    <span className="connection-quality-inline">{getQualityDescription()}</span>
                  </div>
                </div>
                <button 
                  className={`auto-quality-toggle ${autoQuality ? 'active' : ''}`}
                  onClick={() => setAutoQuality(!autoQuality)}
                  title="Toggle auto quality (Q)"
                >
                  {autoQuality ? 'Auto ✓' : 'Manual'}
                </button>
              </div>

              <div className="sources-grid">
                {sources.map((source, index) => (
                  <button
                    key={index}
                    className={`source-card ${selectedSource === index ? 'active' : ''}`}
                    onClick={() => handleSourceChange(index)}
                  >
                    <span className="source-card-number">{index + 1}</span>
                    <span className="source-card-name">{source.name}</span>
                    {selectedSource === index && (
                      <span className="source-card-status">
                        {loading ? '⏳' : error ? '❌' : '✓'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Similar Content */}
            {similarContent.length > 0 && (
              <div className="video-info-block">
                <h3 className="video-info-title">More Like This</h3>
                <div className="similar-scroll">
                  {similarContent.map((item) => (
                    <div 
                      key={item.id} 
                      className="similar-card-inline"
                      onClick={() => handleSimilarClick(item)}
                    >
                      <div className="similar-poster-inline">
                        <img src={item.poster_url} alt={item.title} loading="lazy" />
                        <div className="similar-overlay-inline">
                          <span className="similar-play-inline">▶</span>
                        </div>
                        <div className="similar-rating-inline">⭐ {item.rating}</div>
                      </div>
                      <div className="similar-info-inline">
                        <h4>{item.title}</h4>
                        <span className="similar-year-inline">{item.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
