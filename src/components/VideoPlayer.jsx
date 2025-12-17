import React, { useState, useEffect } from 'react'
import '../styles/VideoPlayer.css'

function VideoPlayer({ movie, onClose }) {
  const [selectedSource, setSelectedSource] = useState(0)
  const [loading, setLoading] = useState(true)
  
  // Multiple streaming sources that search for content
  const sources = [
    {
      name: 'VidSrc',
      url: movie.type === 'tv' 
        ? `https://vidsrc.to/embed/tv/${movie.id}`
        : `https://vidsrc.to/embed/movie/${movie.id}`
    },
    {
      name: 'VidSrc Pro',
      url: movie.type === 'tv'
        ? `https://vidsrc.pro/embed/tv/${movie.id}`
        : `https://vidsrc.pro/embed/movie/${movie.id}`
    },
    {
      name: 'SuperEmbed',
      url: movie.type === 'tv'
        ? `https://multiembed.mov/?video_id=${movie.id}&tmdb=1&tv=1`
        : `https://multiembed.mov/?video_id=${movie.id}&tmdb=1`
    },
    {
      name: '2Embed',
      url: movie.type === 'tv'
        ? `https://www.2embed.cc/embedtv/${movie.id}`
        : `https://www.2embed.cc/embed/${movie.id}`
    }
  ]

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [selectedSource])

  return (
    <div className="video-player-overlay" onClick={onClose}>
      <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
        <div className="video-player-header">
          <div className="video-player-title">
            <h2>{movie.title}</h2>
            <span className="video-player-meta">
              {movie.year} • {movie.type === 'tv' ? 'TV Show' : 'Movie'}
            </span>
          </div>
          <button className="video-player-close" onClick={onClose}>✕</button>
        </div>

        <div className="video-player-content">
          <div className="video-player-main">
            {loading && (
              <div className="video-player-loading">
                <div className="loading-spinner"></div>
                <p>Searching for video sources...</p>
                <span className="loading-source">Using: {sources[selectedSource].name}</span>
              </div>
            )}
            <iframe
              src={sources[selectedSource].url}
              allowFullScreen
              frameBorder="0"
              scrolling="no"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onLoad={() => setLoading(false)}
            />
          </div>

          <div className="video-sources-sidebar">
            <h3>Video Sources</h3>
            <p className="sources-description">
              Select a different source if the current one doesn't work
            </p>
            <div className="sources-list">
              {sources.map((source, index) => (
                <button
                  key={index}
                  className={`source-btn ${selectedSource === index ? 'active' : ''}`}
                  onClick={() => setSelectedSource(index)}
                >
                  <span className="source-number">{index + 1}</span>
                  <span className="source-name">{source.name}</span>
                  {selectedSource === index && (
                    <span className="source-active-badge">Active</span>
                  )}
                </button>
              ))}
            </div>
            <div className="sources-info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <p>Sources search the internet for available streams. No content is hosted by us.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
