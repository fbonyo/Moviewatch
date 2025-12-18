import React, { useState, useEffect } from 'react'
import '../styles/VideoPlayer.css'

const TMDB_API_KEY = '9430d8abce320d89568c56813102ec1d'

function VideoPlayer({ movie, onClose }) {
  const [selectedSource, setSelectedSource] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)
  const [tvDetails, setTvDetails] = useState(null)
  const [seasonDetails, setSeasonDetails] = useState(null)

  const sources = [
    {
      name: 'VidSrc.to',
      url: movie.type === 'tv'
        ? `https://vidsrc.to/embed/tv/${movie.id}/${selectedSeason}/${selectedEpisode}`
        : `https://vidsrc.to/embed/movie/${movie.id}`
    },
    {
      name: 'VidSrc.xyz',
      url: movie.type === 'tv'
        ? `https://vidsrc.xyz/embed/tv?tmdb=${movie.id}&season=${selectedSeason}&episode=${selectedEpisode}`
        : `https://vidsrc.xyz/embed/movie?tmdb=${movie.id}`
    },
    {
      name: 'VidSrc.me',
      url: movie.type === 'tv'
        ? `https://vidsrc.me/embed/tv?tmdb=${movie.id}&season=${selectedSeason}&episode=${selectedEpisode}`
        : `https://vidsrc.me/embed/movie?tmdb=${movie.id}`
    },
    {
      name: 'Embed.su',
      url: movie.type === 'tv'
        ? `https://embed.su/embed/tv/${movie.id}/${selectedSeason}/${selectedEpisode}`
        : `https://embed.su/embed/movie/${movie.id}`
    },
    {
      name: 'VidLink Pro',
      url: movie.type === 'tv'
        ? `https://vidlink.pro/tv/${movie.id}?s=${selectedSeason}&e=${selectedEpisode}`
        : `https://vidlink.pro/movie/${movie.id}`
    },
    {
      name: 'Movie API',
      url: movie.type === 'tv'
        ? `https://moviesapi.club/tv/${movie.id}-${selectedSeason}-${selectedEpisode}`
        : `https://moviesapi.club/movie/${movie.id}`
    },
    {
      name: '2Embed',
      url: movie.type === 'tv'
        ? `https://www.2embed.cc/embedtv/${movie.id}&s=${selectedSeason}&e=${selectedEpisode}`
        : `https://www.2embed.cc/embed/${movie.id}`
    }
  ]

  useEffect(() => {
    if (movie.type === 'tv') {
      fetchTVDetails()
    }
  }, [movie.id])

  useEffect(() => {
    if (movie.type === 'tv' && selectedSeason) {
      fetchSeasonDetails()
    }
  }, [selectedSeason])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [selectedSource, selectedSeason, selectedEpisode])

  const fetchTVDetails = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${movie.id}?api_key=${TMDB_API_KEY}&language=en-US`
      )
      const data = await response.json()
      setTvDetails(data)
    } catch (error) {
      console.error('Error fetching TV details:', error)
    }
  }

  const fetchSeasonDetails = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${movie.id}/season/${selectedSeason}?api_key=${TMDB_API_KEY}&language=en-US`
      )
      const data = await response.json()
      setSeasonDetails(data)
    } catch (error) {
      console.error('Error fetching season details:', error)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleSeasonChange = (season) => {
    setSelectedSeason(season)
    setSelectedEpisode(1)
  }

  const numberOfSeasons = tvDetails?.number_of_seasons || 1
  const numberOfEpisodes = seasonDetails?.episodes?.length || 1

  return (
    <div className="video-player-overlay" onClick={handleOverlayClick}>
      <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
        <div className="video-player-header">
          <button className="back-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <div className="video-player-title">
            <h2>{movie.title}</h2>
            <span className="video-player-meta">
              {movie.year} • {movie.type === 'tv' ? `TV Show (S${selectedSeason} E${selectedEpisode})` : 'Movie'}
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
              </div>
            )}
            
            <iframe
              key={`${selectedSource}-${selectedSeason}-${selectedEpisode}`}
              src={sources[selectedSource].url}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ 
                display: loading ? 'none' : 'block',
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            />
          </div>

          <div className="video-sources-sidebar">
            {movie.type === 'tv' && (
              <div className="episode-selector">
                <h3>Select Episode</h3>
                <div className="season-selector">
                  <label>Season:</label>
                  <select value={selectedSeason} onChange={(e) => handleSeasonChange(Number(e.target.value))}>
                    {[...Array(numberOfSeasons)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Season {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div className="episode-selector-grid">
                  <label>Episode:</label>
                  <select value={selectedEpisode} onChange={(e) => setSelectedEpisode(Number(e.target.value))}>
                    {[...Array(numberOfEpisodes)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Episode {i + 1}
                        {seasonDetails?.episodes?.[i]?.name ? ` - ${seasonDetails.episodes[i].name}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="sources-header">
              <h3>Video Sources</h3>
              <span className="sources-count">{sources.length} available</span>
            </div>
            
            <div className="sources-tip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              <p>Click different sources if one doesn't work.</p>
            </div>
            
            <div className="sources-list">
              {sources.map((source, index) => (
                <button
                  key={index}
                  className={`source-btn ${selectedSource === index ? 'active' : ''}`}
                  onClick={() => setSelectedSource(index)}
                >
                  <span className="source-number">{index + 1}</span>
                  <div className="source-content">
                    <span className="source-name">{source.name}</span>
                    {selectedSource === index && <span className="source-status">✓ Active</span>}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="sources-info">
              <h4>📺 How to Watch</h4>
              <ol>
                <li>Select season and episode for TV shows</li>
                <li>Wait for the player to load (3-10 seconds)</li>
                <li>If you see a blank screen, try sources 2-7</li>
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
